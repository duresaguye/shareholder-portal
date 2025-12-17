"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeVoting = exports.getVotingResults = exports.castVote = exports.getProposalById = exports.getAllProposals = exports.createGeneralProposal = exports.createShareTransferProposal = exports.createNewShareholderProposal = void 0;
const proposalService_1 = require("../services/proposalService");
const votingService_1 = require("../services/votingService");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Helper to merge metadata stored in description back into the proposal response
const mergeProposalMetadata = (proposal) => {
    if (!proposal?.description || !proposal.description.includes("METADATA:"))
        return proposal;
    const [, metaRaw] = proposal.description.split("METADATA:");
    try {
        const meta = JSON.parse(metaRaw.trim());
        return { ...proposal, ...meta };
    }
    catch {
        return proposal;
    }
};
const createNewShareholderProposal = async (req, res) => {
    try {
        const { title, description, acquisitionMode, fromShareholderId, newShareholder, requiredThreshold } = req.body;
        // Validate required fields
        if (!title || !description || !acquisitionMode || !newShareholder) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Validate acquisition mode
        if (!['purchaseFromSingle', 'purchaseByDilution'].includes(acquisitionMode)) {
            return res.status(400).json({ error: "Invalid acquisition mode" });
        }
        // Validate new shareholder data
        const { username, password, firstName, lastName, email, phone, address, type, role, targetOwnership, targetShares } = newShareholder;
        if (!username || !password || !firstName || !lastName || !email || !type || !role) {
            return res.status(400).json({ error: "Missing required shareholder fields" });
        }
        // Validate enums
        if (!Object.values(client_1.ShareholderType).includes(type)) {
            return res.status(400).json({ error: "Invalid shareholder type" });
        }
        if (!Object.values(client_1.UserRole).includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // Create proposal
        const proposal = await proposalService_1.ProposalService.createNewShareholderProposal({
            title,
            description,
            authorId: req.user.sub,
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
    }
    catch (error) {
        console.error("Error creating new shareholder proposal:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.createNewShareholderProposal = createNewShareholderProposal;
const createShareTransferProposal = async (req, res) => {
    try {
        const { title, description, toShareholderId, shareClassId, amount, price, requiredThreshold } = req.body;
        // Validate required fields
        if (!title || !description || !toShareholderId || !shareClassId || !amount || !price) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // The fromShareholderId is the current user
        const fromShareholderId = req.user.sub;
        // Create proposal
        const result = await proposalService_1.ProposalService.createShareTransferProposal({
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
    }
    catch (error) {
        console.error("Error creating share transfer proposal:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.createShareTransferProposal = createShareTransferProposal;
const createGeneralProposal = async (req, res) => {
    try {
        const { title, description, type, requiredThreshold, candidates, position, numberOfPositions, otherDetails } = req.body;
        // Validate required fields
        if (!title || !description || !type) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Validate proposal type
        if (!['GENERAL', 'AMENDMENT'].includes(type)) {
            return res.status(400).json({ error: "Invalid proposal type. Must be GENERAL or AMENDMENT" });
        }
        // Create proposal
        const proposal = await proposalService_1.ProposalService.createGeneralProposal({
            title,
            description,
            authorId: req.user.sub,
            requiredThreshold: requiredThreshold ? parseFloat(requiredThreshold) : 75,
            candidates: candidates || [],
            position,
            numberOfPositions: numberOfPositions ? parseInt(numberOfPositions) : undefined,
            otherDetails
        }, type);
        return res.status(201).json({
            message: `${type} proposal created successfully`,
            proposal: mergeProposalMetadata(proposal)
        });
    }
    catch (error) {
        console.error("Error creating general proposal:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.createGeneralProposal = createGeneralProposal;
const getAllProposals = async (req, res) => {
    try {
        // Return all proposals (open, approved, rejected, closed) so frontend can filter
        const proposals = await proposalService_1.ProposalService.getAllProposals();
        const enriched = proposals.map(mergeProposalMetadata);
        return res.json({ proposals: enriched });
    }
    catch (error) {
        console.error("Error fetching proposals:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getAllProposals = getAllProposals;
const getProposalById = async (req, res) => {
    try {
        const { id } = req.params;
        const proposal = await proposalService_1.ProposalService.getProposalById(id);
        if (!proposal) {
            return res.status(404).json({ error: "Proposal not found" });
        }
        // Calculate current voting results
        const votingResults = await votingService_1.VotingService.calculateVotingResults(id);
        return res.json({
            proposal: mergeProposalMetadata(proposal),
            votingResults
        });
    }
    catch (error) {
        console.error("Error fetching proposal:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getProposalById = getProposalById;
const castVote = async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body;
        // Validate vote type
        if (!Object.values(client_1.VoteType).includes(vote)) {
            return res.status(400).json({ error: "Invalid vote type" });
        }
        const shareholderId = req.user.sub;
        // Cast the vote
        const voteRecord = await votingService_1.VotingService.castVote(id, shareholderId, vote);
        // Check if voting should be finalized
        const shouldClose = await votingService_1.VotingService.shouldCloseVoting(id);
        let votingResults = null;
        let executionResult = null;
        let executionSuccess = false;
        let proposalType = null;
        if (shouldClose) {
            votingResults = await votingService_1.VotingService.finalizeVoting(id);
            // If approved, execute the proposal
            if (votingResults.isApproved) {
                try {
                    const proposal = await proposalService_1.ProposalService.getProposalById(id);
                    if (!proposal) {
                        throw new Error("Proposal not found during execution");
                    }
                    proposalType = proposal.type;
                    if (proposal.type === 'NEW_SHAREHOLDER') {
                        const result = await proposalService_1.ProposalService.executeNewShareholderProposal(id);
                        executionResult = result;
                        console.log("New shareholder created successfully");
                        executionSuccess = true;
                    }
                    else if (proposal.type === 'TRANSFER_APPROVAL') {
                        const result = await proposalService_1.ProposalService.executeShareTransferProposal(id);
                        executionResult = result;
                        console.log("Share transfer executed successfully:", result);
                        executionSuccess = true;
                    }
                }
                catch (executionError) {
                    console.error("Error executing approved proposal:", executionError);
                    // Re-throw to ensure error is visible
                    const message = executionError instanceof Error ? executionError.message : "Unknown error";
                    throw new Error(`Failed to execute approved proposal: ${message}`);
                }
            }
        }
        return res.json({
            message: "Vote cast successfully",
            vote: voteRecord,
            votingClosed: shouldClose,
            votingResults,
            executionSuccess,
            executionResult: executionSuccess
                ? {
                    type: proposalType,
                    message: "Proposal executed successfully",
                }
                : null
        });
    }
    catch (error) {
        console.error("Error casting vote:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.castVote = castVote;
const getVotingResults = async (req, res) => {
    try {
        const { id } = req.params;
        const votingResults = await votingService_1.VotingService.calculateVotingResults(id);
        return res.json({ votingResults });
    }
    catch (error) {
        console.error("Error getting voting results:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getVotingResults = getVotingResults;
const finalizeVoting = async (req, res) => {
    try {
        const { id } = req.params;
        const votingResults = await votingService_1.VotingService.finalizeVoting(id);
        // If approved, execute the proposal
        if (votingResults.isApproved) {
            const proposal = await proposalService_1.ProposalService.getProposalById(id);
            if (!proposal) {
                return res.status(404).json({ error: "Proposal not found during execution" });
            }
            let executionResult = null;
            if (proposal.type === 'NEW_SHAREHOLDER') {
                executionResult = await proposalService_1.ProposalService.executeNewShareholderProposal(id);
            }
            else if (proposal.type === 'TRANSFER_APPROVAL') {
                executionResult = await proposalService_1.ProposalService.executeShareTransferProposal(id);
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
    }
    catch (error) {
        console.error("Error finalizing voting:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.finalizeVoting = finalizeVoting;
