"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalService = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../prismaClient");
class ProposalService {
    /**
     * Create a proposal for adding a new shareholder
     */
    static async createNewShareholderProposal(data) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            // Validate the from shareholder if purchaseFromSingle
            if (data.acquisitionMode === 'purchaseFromSingle') {
                if (!data.fromShareholderId) {
                    throw new Error("fromShareholderId is required for purchaseFromSingle mode");
                }
                const fromShareholder = await tx.shareholder.findUnique({
                    where: { id: data.fromShareholderId }
                });
                if (!fromShareholder) {
                    throw new Error("Source shareholder not found");
                }
                if (fromShareholder.totalShares < data.newShareholderData.targetShares) {
                    throw new Error("Source shareholder has insufficient shares");
                }
            }
            // Create the proposal
            const proposal = await tx.proposal.create({
                data: {
                    title: data.title,
                    description: data.description,
                    type: client_1.ProposalType.NEW_SHAREHOLDER,
                    status: client_1.ProposalStatus.open,
                    requiredThreshold: data.requiredThreshold || 75,
                    authorId: data.authorId,
                    targetShareholderId: data.fromShareholderId || null
                }
            });
            const metadata = {
                acquisitionMode: data.acquisitionMode,
                fromShareholderId: data.fromShareholderId,
                newShareholderData: {
                    ...data.newShareholderData,
                    price: data.price || data.newShareholderData.price || 0,
                    shareClassId: data.shareClassId || data.newShareholderData.shareClassId
                }
            };
            await tx.proposal.update({
                where: { id: proposal.id },
                data: {
                    description: `${data.description}\n\nMETADATA: ${JSON.stringify(metadata)}`
                }
            });
            return proposal;
        });
    }
    /**
     * Create a proposal for share transfer between existing shareholders
     */
    static async createShareTransferProposal(data) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            // Validate shareholders exist
            const fromShareholder = await tx.shareholder.findUnique({
                where: { id: data.fromShareholderId }
            });
            const toShareholder = await tx.shareholder.findUnique({
                where: { id: data.toShareholderId }
            });
            if (!fromShareholder || !toShareholder) {
                throw new Error("One or both shareholders not found");
            }
            if (fromShareholder.totalShares < data.amount) {
                throw new Error("Source shareholder has insufficient shares");
            }
            // Validate share class exists
            const shareClass = await tx.shareClass.findUnique({
                where: { id: data.shareClassId }
            });
            if (!shareClass) {
                throw new Error("Share class not found");
            }
            // Create the share transfer request first
            const transferRequest = await tx.shareTransferRequest.create({
                data: {
                    fromShareholderId: data.fromShareholderId,
                    toShareholderId: data.toShareholderId,
                    shareClassId: data.shareClassId,
                    amount: data.amount,
                    price: data.price,
                    issueDate: new Date(),
                    status: 'voting'
                }
            });
            // Create the proposal
            const proposal = await tx.proposal.create({
                data: {
                    title: data.title,
                    description: data.description,
                    type: client_1.ProposalType.TRANSFER_APPROVAL,
                    status: client_1.ProposalStatus.open,
                    requiredThreshold: data.requiredThreshold || 75,
                    authorId: data.authorId,
                    targetTransferId: transferRequest.id
                }
            });
            // Link the transfer request to the proposal
            await tx.shareTransferRequest.update({
                where: { id: transferRequest.id },
                data: { proposalId: proposal.id }
            });
            return { proposal, transferRequest };
        });
    }
    /**
     * Create a general proposal (for elections, amendments, etc.)
     */
    static async createGeneralProposal(data, proposalType) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            // Create the proposal
            const proposal = await tx.proposal.create({
                data: {
                    title: data.title,
                    description: data.description,
                    type: proposalType,
                    status: client_1.ProposalStatus.open,
                    requiredThreshold: data.requiredThreshold || 75,
                    authorId: data.authorId
                }
            });
            // Store metadata in description
            const metadata = {
                candidates: data.candidates || [],
                position: data.position,
                numberOfPositions: data.numberOfPositions,
                otherDetails: data.otherDetails
            };
            await tx.proposal.update({
                where: { id: proposal.id },
                data: {
                    description: `${data.description}\n\nMETADATA: ${JSON.stringify(metadata)}`
                }
            });
            return proposal;
        });
    }
    /**
     * Execute an approved new shareholder proposal
     */
    static async executeNewShareholderProposal(proposalId) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            const proposal = await tx.proposal.findUnique({
                where: { id: proposalId }
            });
            if (!proposal || proposal.status !== client_1.ProposalStatus.approved) {
                throw new Error("Proposal not found or not approved");
            }
            // Extract metadata from description
            const descriptionParts = proposal.description.split('\n\nMETADATA: ');
            if (descriptionParts.length !== 2) {
                throw new Error("Invalid proposal metadata");
            }
            const metadata = JSON.parse(descriptionParts[1]);
            const { acquisitionMode, fromShareholderId, newShareholderData } = metadata;
            // Import ShareService here to avoid circular dependency
            const { ShareService } = await Promise.resolve().then(() => __importStar(require('./shareService')));
            // Ensure price and shareClassId are included in newShareholderData
            const enrichedShareholderData = {
                ...newShareholderData,
                price: newShareholderData.price || 0,
                shareClassId: newShareholderData.shareClassId
            };
            if (acquisitionMode === 'purchaseByDilution') {
                // Execute dilution
                const allocations = await ShareService.calculateDilution(enrichedShareholderData.targetOwnership, enrichedShareholderData.targetShares);
                return await ShareService.executeDilution(enrichedShareholderData, allocations);
            }
            else if (acquisitionMode === 'purchaseFromSingle') {
                // Execute single transfer
                return await ShareService.executeSingleTransfer(enrichedShareholderData, fromShareholderId, enrichedShareholderData.targetShares);
            }
            throw new Error("Invalid acquisition mode");
        });
    }
    /**
     * Execute an approved share transfer proposal
     */
    static async executeShareTransferProposal(proposalId) {
        return await prismaClient_1.prisma.$transaction(async (tx) => {
            const proposal = await tx.proposal.findUnique({
                where: { id: proposalId },
                include: {
                    transferRequests: true
                }
            });
            if (!proposal || proposal.status !== client_1.ProposalStatus.approved) {
                throw new Error("Proposal not found or not approved");
            }
            if (!proposal.targetTransferId) {
                throw new Error("No transfer request associated with this proposal");
            }
            const transferRequest = await tx.shareTransferRequest.findUnique({
                where: { id: proposal.targetTransferId }
            });
            if (!transferRequest) {
                throw new Error("Transfer request not found");
            }
            // Import ShareService here to avoid circular dependency
            const { ShareService } = await Promise.resolve().then(() => __importStar(require('./shareService')));
            // Execute the transfer
            const result = await ShareService.executeShareTransfer(transferRequest.fromShareholderId, transferRequest.toShareholderId, transferRequest.amount, transferRequest.shareClassId, transferRequest.price);
            return result;
        });
    }
    /**
     * Get all open proposals
     */
    static async getOpenProposals() {
        return await prismaClient_1.prisma.proposal.findMany({
            where: { status: client_1.ProposalStatus.open },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true
                    }
                },
                votes: {
                    include: {
                        shareholder: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                ownership: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Get all proposals (open, approved, rejected, closed)
     */
    static async getAllProposals() {
        return await prismaClient_1.prisma.proposal.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true
                    }
                },
                votes: {
                    include: {
                        shareholder: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                ownership: true
                            }
                        }
                    }
                },
                transferRequests: {
                    include: {
                        from: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        to: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        shareClass: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                targetShareholder: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Get proposal by ID with full details
     */
    static async getProposalById(proposalId) {
        return await prismaClient_1.prisma.proposal.findUnique({
            where: { id: proposalId },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true
                    }
                },
                votes: {
                    include: {
                        shareholder: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                ownership: true
                            }
                        }
                    }
                },
                transferRequests: {
                    include: {
                        from: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                totalShares: true
                            }
                        },
                        to: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                totalShares: true
                            }
                        },
                        shareClass: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                },
                targetShareholder: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        totalShares: true,
                        ownership: true
                    }
                }
            }
        });
    }
}
exports.ProposalService = ProposalService;
