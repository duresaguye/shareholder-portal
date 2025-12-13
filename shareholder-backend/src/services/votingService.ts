import { ProposalType, ProposalStatus, VoteType, ShareholderStatus } from "@prisma/client";
import { prisma } from "../prismaClient";

export interface VotingResult {
  totalVotingWeight: number;
  yesWeight: number;
  noWeight: number;
  abstainWeight: number;
  yesPercentage: number;
  noPercentage: number;
  abstainPercentage: number;
  isApproved: boolean;
  requiredThreshold: number;
}

export class VotingService {
  
  /**
   * Calculate voting results for a proposal
   */
  static async calculateVotingResults(proposalId: string): Promise<VotingResult> {
    // Get all votes for this proposal
    const votes = await prisma.vote.findMany({
      where: { proposalId },
      include: {
        shareholder: {
          select: {
            id: true,
            ownership: true,
            status: true
          }
        }
      }
    });

    // Get proposal to check required threshold
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { requiredThreshold: true }
    });

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    // Get total ownership of ALL approved shareholders (not just those who voted)
    const allApprovedShareholders = await prisma.shareholder.findMany({
      where: { 
        status: ShareholderStatus.approved,
        role: 'shareholder' // Exclude admins from voting weight
      },
      select: { ownership: true }
    });

    const totalOwnership = allApprovedShareholders.reduce((sum: number, s: { ownership: number }) => sum + s.ownership, 0);

    // Calculate total voting weight (only approved shareholders who voted)
    const totalVotingWeight = votes.reduce((sum: any, vote: { shareholder: { status: any; ownership: any; }; }) => {
      if (vote.shareholder.status === ShareholderStatus.approved) {
        return sum + vote.shareholder.ownership;
      }
      return sum;
    }, 0);

    // Calculate weighted votes
    let yesWeight = 0;
    let noWeight = 0;
    let abstainWeight = 0;

    votes.forEach((vote: { shareholder: { status: any; ownership: any; }; vote: any; }) => {
      if (vote.shareholder.status === ShareholderStatus.approved) {
        const weight = vote.shareholder.ownership;
        switch (vote.vote) {
          case VoteType.YES:
            yesWeight += weight;
            break;
          case VoteType.NO:
            noWeight += weight;
            break;
          case VoteType.ABSTAIN:
            abstainWeight += weight;
            break;
        }
      }
    });

    // Calculate percentages based on total ownership (not just voting weight)
    // This ensures threshold is compared against total ownership, not just those who voted
    const yesPercentage = totalOwnership > 0 ? (yesWeight / totalOwnership) * 100 : 0;
    const noPercentage = totalOwnership > 0 ? (noWeight / totalOwnership) * 100 : 0;
    const abstainPercentage = totalOwnership > 0 ? (abstainWeight / totalOwnership) * 100 : 0;

    // Check if approved - threshold is based on total ownership
    const isApproved = yesPercentage >= proposal.requiredThreshold;

    return {
      totalVotingWeight,
      yesWeight,
      noWeight,
      abstainWeight,
      yesPercentage,
      noPercentage,
      abstainPercentage,
      isApproved,
      requiredThreshold: proposal.requiredThreshold
    };
  }

  /**
   * Cast a vote for a proposal
   */
  static async castVote(
    proposalId: string, 
    shareholderId: string, 
    voteType: VoteType
  ): Promise<any> {
    return await prisma.$transaction(async (tx: { shareholder: { findUnique: (arg0: { where: { id: string; }; select: { id: boolean; ownership: boolean; status: boolean; }; }) => any; }; proposal: { findUnique: (arg0: { where: { id: string; }; select: { id: boolean; status: boolean; }; }) => any; }; vote: { findFirst: (arg0: { where: { proposalId: string; shareholderId: string; }; }) => any; update: (arg0: { where: { id: any; }; data: { vote: VoteType; voteWeight: any; }; }) => any; create: (arg0: { data: { proposalId: string; shareholderId: string; vote: VoteType; voteWeight: any; }; }) => any; }; }) => {
      // Check if shareholder exists and is approved
      const shareholder = await tx.shareholder.findUnique({
        where: { id: shareholderId },
        select: { id: true, ownership: true, status: true }
      });

      if (!shareholder) {
        throw new Error("Shareholder not found");
      }

      if (shareholder.status !== ShareholderStatus.approved) {
        throw new Error("Only approved shareholders can vote");
      }

      // Check if proposal exists and is open
      const proposal = await tx.proposal.findUnique({
        where: { id: proposalId },
        select: { id: true, status: true }
      });

      if (!proposal) {
        throw new Error("Proposal not found");
      }

      if (proposal.status !== ProposalStatus.open) {
        throw new Error("Proposal is not open for voting");
      }

      // Check if shareholder has already voted
      const existingVote = await tx.vote.findFirst({
        where: {
          proposalId,
          shareholderId
        }
      });

      if (existingVote) {
        // Update existing vote
        return await tx.vote.update({
          where: { id: existingVote.id },
          data: {
            vote: voteType,
            voteWeight: shareholder.ownership
          }
        });
      } else {
        // Create new vote
        return await tx.vote.create({
          data: {
            proposalId,
            shareholderId,
            vote: voteType,
            voteWeight: shareholder.ownership
          }
        });
      }
    });
  }

  /**
   * Check if voting should be closed (either threshold reached or all shareholders voted)
   */
  static async shouldCloseVoting(proposalId: string): Promise<boolean> {
    // First check if threshold is reached
    const votingResult = await this.calculateVotingResults(proposalId);
    
    // If threshold is reached (approved or rejected), close voting
    if (votingResult.isApproved) {
      return true;
    }

    // Also check if threshold for rejection is reached (if NO votes exceed threshold)
    // For now, we'll close if all shareholders voted OR if threshold is reached
    // Check if all shareholders have voted
    const approvedShareholders = await prisma.shareholder.findMany({
      where: { 
        status: ShareholderStatus.approved,
        role: 'shareholder' // Exclude admins from mandatory voting
      },
      select: { id: true }
    });

    // Get votes for this proposal
    const votes = await prisma.vote.findMany({
      where: { proposalId },
      select: { shareholderId: true }
    });

    const votedShareholderIds = new Set(votes.map((v: { shareholderId: any; }) => v.shareholderId));
    
    // Check if all shareholders have voted
    const allVoted = approvedShareholders.every((s: { id: unknown; }) => votedShareholderIds.has(s.id));
    
    // Also check if we can't reach threshold anymore (if remaining votes can't push it over)
    // For simplicity, we'll close if threshold is reached OR all voted
    return allVoted || votingResult.isApproved;
  }

  /**
   * Finalize voting and update proposal status
   */
  static async finalizeVoting(proposalId: string): Promise<VotingResult> {
    return await prisma.$transaction(async (tx: { proposal: { update: (arg0: { where: { id: string; }; data: { status: any; }; }) => any; }; }) => {
      const votingResult = await this.calculateVotingResults(proposalId);

      // Update proposal status
      const newStatus = votingResult.isApproved ? ProposalStatus.approved : ProposalStatus.rejected;
      
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: newStatus }
      });

      return votingResult;
    });
  }
}