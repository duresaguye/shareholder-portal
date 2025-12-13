import { ProposalType, ProposalStatus } from "@prisma/client";
import { NewShareholderData } from "./shareService";
import { prisma } from "../prismaClient";

export interface NewShareholderProposalData {
  title: string;
  description: string;
  authorId: string;
  acquisitionMode: 'purchaseFromSingle' | 'purchaseByDilution';
  fromShareholderId?: string; // Required for purchaseFromSingle
  newShareholderData: NewShareholderData;
  requiredThreshold?: number;
}

export interface ShareTransferProposalData {
  title: string;
  description: string;
  authorId: string;
  fromShareholderId: string;
  toShareholderId: string;
  shareClassId: string;
  amount: number;
  price: number;
  requiredThreshold?: number;
}

export interface GeneralProposalData {
  title: string;
  description: string;
  authorId: string;
  requiredThreshold?: number;
  candidates?: Array<{
    name: string;
    position?: string;
    bio?: string;
  }>;
  position?: string;
  numberOfPositions?: number;
  otherDetails?: string;
}

export class ProposalService {
  
  /**
   * Create a proposal for adding a new shareholder
   */
  static async createNewShareholderProposal(
    data: NewShareholderProposalData
  ): Promise<any> {
    return await prisma.$transaction(async (tx: { shareholder: { findUnique: (arg0: { where: { id: string; }; }) => any; }; proposal: { create: (arg0: { data: { title: string; description: string; type: any; status: any; requiredThreshold: number; authorId: string; targetShareholderId: string | null; }; }) => any; update: (arg0: { where: { id: any; }; data: { description: string; }; }) => any; }; }) => {
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
          type: ProposalType.NEW_SHAREHOLDER,
          status: ProposalStatus.open,
          requiredThreshold: data.requiredThreshold || 75,
          authorId: data.authorId,
          targetShareholderId: data.fromShareholderId || null
        }
      });

   
      const metadata = {
        acquisitionMode: data.acquisitionMode,
        fromShareholderId: data.fromShareholderId,
        newShareholderData: data.newShareholderData
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
  static async createShareTransferProposal(
    data: ShareTransferProposalData
  ): Promise<any> {
    return await prisma.$transaction(async (tx) => {
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
          type: ProposalType.TRANSFER_APPROVAL,
          status: ProposalStatus.open,
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
  static async createGeneralProposal(
    data: GeneralProposalData,
    proposalType: ProposalType
  ): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      // Create the proposal
      const proposal = await tx.proposal.create({
        data: {
          title: data.title,
          description: data.description,
          type: proposalType,
          status: ProposalStatus.open,
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
  static async executeNewShareholderProposal(proposalId: string): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.findUnique({
        where: { id: proposalId }
      });

      if (!proposal || proposal.status !== ProposalStatus.approved) {
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
      const { ShareService } = await import('./shareService');

      if (acquisitionMode === 'purchaseByDilution') {
        // Execute dilution
        const allocations = await ShareService.calculateDilution(
          newShareholderData.targetOwnership,
          newShareholderData.targetShares
        );
        
        return await ShareService.executeDilution(newShareholderData, allocations);
      } else if (acquisitionMode === 'purchaseFromSingle') {
        // Execute single transfer
        return await ShareService.executeSingleTransfer(
          newShareholderData,
          fromShareholderId,
          newShareholderData.targetShares
        );
      }

      throw new Error("Invalid acquisition mode");
    });
  }

  /**
   * Execute an approved share transfer proposal
   */
  static async executeShareTransferProposal(proposalId: string): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.findUnique({
        where: { id: proposalId },
        include: {
          transferRequests: true
        }
      });

      if (!proposal || proposal.status !== ProposalStatus.approved) {
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
      const { ShareService } = await import('./shareService');

      // Execute the transfer
      const result = await ShareService.executeShareTransfer(
        transferRequest.fromShareholderId,
        transferRequest.toShareholderId,
        transferRequest.amount,
        transferRequest.shareClassId,
        transferRequest.price
      );

      return result;
    });
  }

  /**
   * Get all open proposals
   */
  static async getOpenProposals(): Promise<any[]> {
    return await prisma.proposal.findMany({
      where: { status: ProposalStatus.open },
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
  static async getAllProposals(): Promise<any[]> {
    return await prisma.proposal.findMany({
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
  static async getProposalById(proposalId: string): Promise<any> {
    return await prisma.proposal.findUnique({
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