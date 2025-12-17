"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotingService = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../prismaClient");
class VotingService {
    /**
     * Calculate voting results for a proposal
     */
    static async calculateVotingResults(proposalId) {
        // Get all votes for this proposal
        const votes = await prismaClient_1.prisma.vote.findMany({
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
        const proposal = await prismaClient_1.prisma.proposal.findUnique({
            where: { id: proposalId },
            select: { requiredThreshold: true }
        });
        if (!proposal) {
            throw new Error("Proposal not found");
        }
        // Get total ownership of ALL approved shareholders (not just those who voted)
        const allApprovedShareholders = await prismaClient_1.prisma.shareholder.findMany({
            where: {
                status: client_1.ShareholderStatus.approved,
                role: 'shareholder' // Exclude admins from voting weight
            },
            select: { ownership: true }
        });
        const totalOwnership = allApprovedShareholders.reduce((sum, s) => sum + s.ownership, 0);
        // Calculate total voting weight (only approved shareholders who voted)
        const totalVotingWeight = votes.reduce((sum, vote) => {
            if (vote.shareholder.status === client_1.ShareholderStatus.approved) {
                return sum + vote.shareholder.ownership;
            }
            return sum;
        }, 0);
        // Calculate weighted votes
        let yesWeight = 0;
        let noWeight = 0;
        let abstainWeight = 0;
        votes.forEach((vote) => {
            if (vote.shareholder.status === client_1.ShareholderStatus.approved) {
                const weight = vote.shareholder.ownership;
                switch (vote.vote) {
                    case client_1.VoteType.YES:
                        yesWeight += weight;
                        break;
                    case client_1.VoteType.NO:
                        noWeight += weight;
                        break;
                    case client_1.VoteType.ABSTAIN:
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
    static async castVote(proposalId, shareholderId, voteType) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            // Check if shareholder exists and is approved
            const shareholder = await tx.shareholder.findUnique({
                where: { id: shareholderId },
                select: { id: true, ownership: true, status: true }
            });
            if (!shareholder) {
                throw new Error("Shareholder not found");
            }
            if (shareholder.status !== client_1.ShareholderStatus.approved) {
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
            if (proposal.status !== client_1.ProposalStatus.open) {
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
            }
            else {
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
     * Check if voting should be closed (ONLY when all shareholders have voted)
     * This ensures that votes stay open until everyone has cast their vote,
     * preventing early closure that could be reversed by remaining votes.
     */
    static async shouldCloseVoting(proposalId) {
        // Get all approved shareholders who are eligible to vote
        const approvedShareholders = await prismaClient_1.prisma.shareholder.findMany({
            where: {
                status: client_1.ShareholderStatus.approved,
                role: 'shareholder' // Exclude admins from mandatory voting
            },
            select: { id: true }
        });
        // Get all votes for this proposal
        const votes = await prismaClient_1.prisma.vote.findMany({
            where: { proposalId },
            select: { shareholderId: true }
        });
        const votedShareholderIds = new Set(votes.map((v) => v.shareholderId));
        // Check if ALL shareholders have voted
        const allVoted = approvedShareholders.every((s) => votedShareholderIds.has(s.id));
        // ONLY close voting when ALL shareholders have voted
        // This prevents early closure that could be reversed by remaining votes
        return allVoted;
    }
    /**
     * Finalize voting and update proposal status
     */
    static async finalizeVoting(proposalId) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            const votingResult = await this.calculateVotingResults(proposalId);
            // Update proposal status
            const newStatus = votingResult.isApproved ? client_1.ProposalStatus.approved : client_1.ProposalStatus.rejected;
            await tx.proposal.update({
                where: { id: proposalId },
                data: { status: newStatus }
            });
            return votingResult;
        });
    }
}
exports.VotingService = VotingService;
