import { Request, Response } from "express";
import { ProposalService } from "../services/proposalService";
import { VotingService } from "../services/votingService";
import { ShareService } from "../services/shareService";
import { VoteType, ShareholderType, UserRole, ProposalType } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/authMiddleware";

// Helper to merge metadata stored in description back into the proposal response
const mergeProposalMetadata = (proposal: any) => {
  if (!proposal?.description || !proposal.description.includes("METADATA:")) return proposal;
  const [, metaRaw] = proposal.description.split("METADATA:");
  try {
    const meta = JSON.parse(metaRaw.trim());
    return { ...proposal, ...meta };
  } catch {
    return proposal;
  }
};

export const createNewShareholderProposal = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      acquisitionMode,
      fromShareholderId,
      newShareholder,
      requiredThreshold
    } = req.body;

    // Validate required fields
    if (!title || !description || !acquisitionMode || !newShareholder) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate acquisition mode
    if (!['purchaseFromSingle', 'purchaseByDilution'].includes(acquisitionMode)) {
      return res.status(400).json({ error: "Invalid acquisition mode" });
    }

    // Validate new shareholder data
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      type,
      role,
      targetOwnership,
      targetShares
    } = newShareholder;

    if (!username || !password || !firstName || !lastName || !email || !type || !role) {
      return res.status(400).json({ error: "Missing required shareholder fields" });
    }

    // Validate enums
    if (!Object.values(ShareholderType).includes(type)) {
      return res.status(400).json({ error: "Invalid shareholder type" });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create proposal
    const proposal = await ProposalService.createNewShareholderProposal({
      title,
      description,
      authorId: req.user!.sub,
      acquisitionMode,
      fromShareholderId,
      newShareholderData: {
        username,
        passwordHash,
        firstName,
        lastName,
        email,
        phone,
        address,
        type,
        role,
        targetOwnership: parseFloat(targetOwnership) || 0,
        targetShares: parseInt(targetShares) || 0
      },
      requiredThreshold: requiredThreshold ? parseFloat(requiredThreshold) : 75
    });

    return res.status(201).json({
      message: "New shareholder proposal created successfully",
      proposal: mergeProposalMetadata(proposal)
    });
  } catch (error: any) {
    console.error("Error creating new shareholder proposal:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const createShareTransferProposal = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      toShareholderId,
      shareClassId,
      amount,
      price,
      requiredThreshold
    } = req.body;

    // Validate required fields
    if (!title || !description || !toShareholderId || !shareClassId || !amount || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // The fromShareholderId is the current user
    const fromShareholderId = req.user!.sub;

    // Create proposal
    const result = await ProposalService.createShareTransferProposal({
      title,
      description,
      authorId: fromShareholderId,
      fromShareholderId,
      toShareholderId,
      shareClassId,
      amount: parseInt(amount),
      price: parseFloat(price),
      requiredThreshold: requiredThreshold ? parseFloat(requiredThreshold) : 75
    });

    return res.status(201).json({
      message: "Share transfer proposal created successfully",
      proposal: mergeProposalMetadata(result.proposal),
      transferRequest: result.transferRequest
    });
  } catch (error: any) {
    console.error("Error creating share transfer proposal:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const createGeneralProposal = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      requiredThreshold,
      candidates,
      position,
      numberOfPositions,
      otherDetails
    } = req.body;

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate proposal type
    if (!['GENERAL', 'AMENDMENT'].includes(type)) {
      return res.status(400).json({ error: "Invalid proposal type. Must be GENERAL or AMENDMENT" });
    }

    // Create proposal
    const proposal = await ProposalService.createGeneralProposal({
      title,
      description,
      authorId: req.user!.sub,
      requiredThreshold: requiredThreshold ? parseFloat(requiredThreshold) : 75,
      candidates: candidates || [],
      position,
      numberOfPositions: numberOfPositions ? parseInt(numberOfPositions) : undefined,
      otherDetails
    }, type as ProposalType);

    return res.status(201).json({
      message: `${type} proposal created successfully`,
      proposal: mergeProposalMetadata(proposal)
    });
  } catch (error: any) {
    console.error("Error creating general proposal:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllProposals = async (req: Request, res: Response) => {
  try {
    // Return all proposals (open, approved, rejected, closed) so frontend can filter
    const proposals = await ProposalService.getAllProposals();
    const enriched = proposals.map(mergeProposalMetadata);
    return res.json({ proposals: enriched });
  } catch (error: any) {
    console.error("Error fetching proposals:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProposalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const proposal = await ProposalService.getProposalById(id);

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    // Calculate current voting results
    const votingResults = await VotingService.calculateVotingResults(id);

    return res.json({
      proposal: mergeProposalMetadata(proposal),
      votingResults
    });
  } catch (error: any) {
    console.error("Error fetching proposal:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const castVote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;

    // Validate vote type
    if (!Object.values(VoteType).includes(vote)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    const shareholderId = req.user!.sub;

    // Cast the vote
    const voteRecord = await VotingService.castVote(id, shareholderId, vote);

    // Check if voting should be finalized
    const shouldClose = await VotingService.shouldCloseVoting(id);
    let votingResults = null;

    let executionResult = null;
    let executionSuccess = false;
    let proposalType = null;

    if (shouldClose) {
      votingResults = await VotingService.finalizeVoting(id);
      
      // If approved, execute the proposal
      if (votingResults.isApproved) {
        try {
          const proposal = await ProposalService.getProposalById(id);
          proposalType = proposal.type;
          
          if (proposal.type === 'NEW_SHAREHOLDER') {
            executionResult = await ProposalService.executeNewShareholderProposal(id);
            console.log("New shareholder created successfully:", executionResult.id);
            executionSuccess = true;
          } else if (proposal.type === 'TRANSFER_APPROVAL') {
            executionResult = await ProposalService.executeShareTransferProposal(id);
            console.log("Share transfer executed successfully:", executionResult);
            executionSuccess = true;
          }
        } catch (executionError: any) {
          console.error("Error executing approved proposal:", executionError);
          // Re-throw to ensure error is visible
          throw new Error(`Failed to execute approved proposal: ${executionError.message}`);
        }
      }
    }

    return res.json({
      message: "Vote cast successfully",
      vote: voteRecord,
      votingClosed: shouldClose,
      votingResults,
      executionSuccess,
      executionResult: executionSuccess ? {
        type: proposalType,
        shareholderId: executionResult?.id,
        message: "Proposal executed successfully"
      } : null
    });
  } catch (error: any) {
    console.error("Error casting vote:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getVotingResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const votingResults = await VotingService.calculateVotingResults(id);
    return res.json({ votingResults });
  } catch (error: any) {
    console.error("Error getting voting results:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const finalizeVoting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const votingResults = await VotingService.finalizeVoting(id);
    
    // If approved, execute the proposal
    if (votingResults.isApproved) {
      const proposal = await ProposalService.getProposalById(id);
      
      let executionResult = null;
      if (proposal.type === 'NEW_SHAREHOLDER') {
        executionResult = await ProposalService.executeNewShareholderProposal(id);
      } else if (proposal.type === 'TRANSFER_APPROVAL') {
        executionResult = await ProposalService.executeShareTransferProposal(id);
      }

      return res.json({
        message: "Voting finalized and proposal executed successfully",
        votingResults,
        executionResult
      });
    }

    return res.json({
      message: "Voting finalized - proposal rejected",
      votingResults
    });
  } catch (error: any) {
    console.error("Error finalizing voting:", error);
    return res.status(500).json({ error: error.message });
  }
};