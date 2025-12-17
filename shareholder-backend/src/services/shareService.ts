import { ShareholderType, ShareholderStatus, UserRole, TransferStatus, ShareClassType } from "@prisma/client";
import { prisma } from "../prismaClient";

export interface ShareAllocation {
  shareholderId: string;
  currentShares: number;
  newShares: number;
  currentOwnership: number;
  newOwnership: number;
}

export interface NewShareholderData {
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  type: ShareholderType;
  role: UserRole;
  targetOwnership: number;
  targetShares: number;
  price?: number; // Share purchase price per share
  shareClassId?: string; // Share class ID (defaults to COMMON if not provided)
}

export class ShareService {
  
  /**
   * Calculate share dilution for all shareholders when adding a new shareholder
   */
  static async calculateDilution(
    targetOwnership: number,
    targetShares: number
  ): Promise<ShareAllocation[]> {
    // Get all current shareholders
    const shareholders = await prisma.shareholder.findMany({
      where: { 
        status: ShareholderStatus.approved,
        totalShares: { gt: 0 }
      },
      select: {
        id: true,
        totalShares: true,
        ownership: true
      }
    });

    const totalCurrentShares = shareholders.reduce(
      (sum: number, s: { totalShares: number }) => sum + s.totalShares,
      0
    );
    const totalNewShares = totalCurrentShares + targetShares;

    // Calculate new ownership percentages
    const allocations: ShareAllocation[] = shareholders.map((shareholder) => {
      const newOwnership = (shareholder.totalShares / totalNewShares) * 100;
      
      return {
        shareholderId: shareholder.id,
        currentShares: shareholder.totalShares,
        newShares: shareholder.totalShares, // Shares stay the same in dilution
        currentOwnership: shareholder.ownership,
        newOwnership: newOwnership
      };
    });

    return allocations;
  }

  /**
   * Calculate share transfer from a single shareholder
   */
  static async calculateSingleTransfer(
    fromShareholderId: string,
    targetShares: number
  ): Promise<ShareAllocation[]> {
    // Get the selling shareholder
    const fromShareholder = await prisma.shareholder.findUnique({
      where: { id: fromShareholderId },
      select: {
        id: true,
        totalShares: true,
        ownership: true
      }
    });

    if (!fromShareholder) {
      throw new Error("Source shareholder not found");
    }

    if (fromShareholder.totalShares < targetShares) {
      throw new Error("Insufficient shares for transfer");
    }

    // Get total shares to calculate new ownership
    const totalShares = await this.getTotalShares();
    
    const newShares = fromShareholder.totalShares - targetShares;
    const newOwnership = (newShares / totalShares) * 100;

    return [{
      shareholderId: fromShareholderId,
      currentShares: fromShareholder.totalShares,
      newShares: newShares,
      currentOwnership: fromShareholder.ownership,
      newOwnership: newOwnership
    }];
  }

  /**
   * Execute share dilution (add new shareholder by diluting existing ones)
   */
  static async executeDilution(
    newShareholderData: NewShareholderData,
    allocations: ShareAllocation[]
  ): Promise<unknown> {
    return await prisma.$transaction(async (tx) => {
      // Get or create COMMON share class if shareClassId not provided
      let shareClass;
      if (newShareholderData.shareClassId) {
        shareClass = await tx.shareClass.findUnique({
          where: { id: newShareholderData.shareClassId }
        });
        if (!shareClass) {
          throw new Error("Specified share class not found");
        }
      } else {
        // Default to COMMON share class
        shareClass = await tx.shareClass.findFirst({
          where: { name: ShareClassType.COMMON }
        });
        
        // If COMMON doesn't exist, create it
        if (!shareClass) {
          shareClass = await tx.shareClass.create({
            data: {
              name: ShareClassType.COMMON,
              description: "Common shares"
            }
          });
        }
      }

      // Create the new shareholder
      const newShareholder = await tx.shareholder.create({
        data: {
          username: newShareholderData.username,
          passwordHash: newShareholderData.passwordHash,
          firstName: newShareholderData.firstName,
          lastName: newShareholderData.lastName,
          email: newShareholderData.email,
          phone: newShareholderData.phone,
          address: newShareholderData.address,
          type: newShareholderData.type,
          status: ShareholderStatus.approved,
          role: newShareholderData.role,
          ownership: newShareholderData.targetOwnership,
          totalShares: newShareholderData.targetShares
        }
      });

      // Create ShareholderShare record to track share purchase with price
      const sharePrice = newShareholderData.price || 0; // Default to 0 if price not provided
      if (shareClass) {
        await tx.shareholderShare.create({
          data: {
            shareholderId: newShareholder.id,
            shareClassId: shareClass.id,
            amount: newShareholderData.targetShares,
            price: sharePrice,
            issueDate: new Date()
          }
        });
      }

      // Update existing shareholders' ownership percentages
      for (const allocation of allocations) {
        await tx.shareholder.update({
          where: { id: allocation.shareholderId },
          data: { ownership: allocation.newOwnership }
        });
      }

      return newShareholder;
    });
  }

  /**
   * Execute single shareholder transfer (buy shares from one shareholder)
   */
  static async executeSingleTransfer(
    newShareholderData: NewShareholderData,
    fromShareholderId: string,
    transferShares: number
  ): Promise<unknown> {
    return await prisma.$transaction(async (tx) => {
      // Get the selling shareholder first
      const fromShareholder = await tx.shareholder.findUnique({
        where: { id: fromShareholderId }
      });

      if (!fromShareholder) {
        throw new Error("Source shareholder not found");
      }

      // Get or create COMMON share class if shareClassId not provided
      let shareClass;
      if (newShareholderData.shareClassId) {
        shareClass = await tx.shareClass.findUnique({
          where: { id: newShareholderData.shareClassId }
        });
        if (!shareClass) {
          throw new Error("Specified share class not found");
        }
      } else {
        // Default to COMMON share class
        shareClass = await tx.shareClass.findFirst({
          where: { name: ShareClassType.COMMON }
        });
        
        // If COMMON doesn't exist, create it
        if (!shareClass) {
          shareClass = await tx.shareClass.create({
            data: {
              name: ShareClassType.COMMON,
              description: "Common shares"
            }
          });
        }
      }

      // Get all current shareholders to calculate total shares
      const allShareholders = await tx.shareholder.findMany({
        where: {
          status: ShareholderStatus.approved
        },
        select: { totalShares: true }
      });

      const totalSharesBefore = allShareholders.reduce(
        (sum: number, s: { totalShares: number }) => sum + s.totalShares,
        0
      );
      
      // Create the new shareholder
      const newShareholder = await tx.shareholder.create({
        data: {
          username: newShareholderData.username,
          passwordHash: newShareholderData.passwordHash,
          firstName: newShareholderData.firstName,
          lastName: newShareholderData.lastName,
          email: newShareholderData.email,
          phone: newShareholderData.phone,
          address: newShareholderData.address,
          type: newShareholderData.type,
          status: ShareholderStatus.approved,
          role: newShareholderData.role,
          ownership: newShareholderData.targetOwnership,
          totalShares: newShareholderData.targetShares
        }
      });

      // Create ShareholderShare record for the new shareholder
      const sharePrice = newShareholderData.price || 0; // Default to 0 if price not provided
      if (shareClass) {
        await tx.shareholderShare.create({
          data: {
            shareholderId: newShareholder.id,
            shareClassId: shareClass.id,
            amount: transferShares,
            price: sharePrice,
            issueDate: new Date()
          }
        });
      }

      // Calculate new total shares (after adding new shareholder)
      // Total shares remain the same (shares are transferred, not created)
      const totalShares = totalSharesBefore; // Shares are transferred, total stays same

      // Update the selling shareholder
      const newFromShares = fromShareholder.totalShares - transferShares;
      const newFromOwnership = totalShares > 0 ? (newFromShares / totalShares) * 100 : 0;

      await tx.shareholder.update({
        where: { id: fromShareholderId },
        data: {
          totalShares: newFromShares,
          ownership: newFromOwnership
        }
      });

      // Recalculate ownership for new shareholder based on actual total
      const newShareholderOwnership = totalShares > 0 ? (newShareholderData.targetShares / totalShares) * 100 : 0;
      await tx.shareholder.update({
        where: { id: newShareholder.id },
        data: {
          ownership: newShareholderOwnership
        }
      });

      return newShareholder;
    });
  }

  /**
   * Execute share transfer between existing shareholders
   */
  static async executeShareTransfer(
    fromShareholderId: string,
    toShareholderId: string,
    transferShares: number,
    shareClassId: string,
    price: number
  ): Promise<{
    transferRequest: unknown;
    fromShareholder: { id: string; newShares: number; newOwnership: number };
    toShareholder: { id: string; newShares: number; newOwnership: number };
  }> {
    return await prisma.$transaction(async (tx) => {
      // Get both shareholders
      const fromShareholder = await tx.shareholder.findUnique({
        where: { id: fromShareholderId }
      });
      const toShareholder = await tx.shareholder.findUnique({
        where: { id: toShareholderId }
      });

      if (!fromShareholder || !toShareholder) {
        throw new Error("One or both shareholders not found");
      }

      if (fromShareholder.totalShares < transferShares) {
        throw new Error("Insufficient shares for transfer");
      }

      // Get total shares for ownership calculation
      const totalShares = await this.getTotalShares();

      // Calculate new shares and ownership
      const newFromShares = fromShareholder.totalShares - transferShares;
      const newToShares = toShareholder.totalShares + transferShares;
      
      const newFromOwnership = (newFromShares / totalShares) * 100;
      const newToOwnership = (newToShares / totalShares) * 100;

      // Update both shareholders
      await tx.shareholder.update({
        where: { id: fromShareholderId },
        data: {
          totalShares: newFromShares,
          ownership: newFromOwnership
        }
      });

      await tx.shareholder.update({
        where: { id: toShareholderId },
        data: {
          totalShares: newToShares,
          ownership: newToOwnership
        }
      });

      // Create share transfer request record
      const transferRequest = await tx.shareTransferRequest.create({
        data: {
          fromShareholderId,
          toShareholderId,
          shareClassId,
          amount: transferShares,
          price,
          issueDate: new Date(),
          status: TransferStatus.completed
        }
      });

      // Verify share class exists
      const shareClass = await tx.shareClass.findUnique({
        where: { id: shareClassId }
      });

      if (!shareClass) {
        throw new Error("Share class not found");
      }

      // Create ShareholderShare record for the receiving shareholder
      // This tracks the share purchase with price for audit and value calculation
      await tx.shareholderShare.create({
        data: {
          shareholderId: toShareholderId,
          shareClassId: shareClassId,
          amount: transferShares,
          price: price,
          issueDate: new Date()
        }
      });

      return {
        transferRequest,
        fromShareholder: { id: fromShareholderId, newShares: newFromShares, newOwnership: newFromOwnership },
        toShareholder: { id: toShareholderId, newShares: newToShares, newOwnership: newToOwnership }
      };
    });
  }

  /**
   * Get total shares in the system
   */
  static async getTotalShares(): Promise<number> {
    const result = await prisma.shareholder.aggregate({
      _sum: {
        totalShares: true
      },
      where: {
        status: ShareholderStatus.approved
      }
    });

    return result._sum.totalShares || 0;
  }

  /**
   * Recalculate all ownership percentages based on current shares
   */
  static async recalculateAllOwnership(): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const totalShares = await this.getTotalShares();
      
      if (totalShares === 0) return;

      const shareholders = await tx.shareholder.findMany({
        where: { status: ShareholderStatus.approved },
        select: { id: true, totalShares: true }
      });

      for (const shareholder of shareholders) {
        const newOwnership = (shareholder.totalShares / totalShares) * 100;
        await tx.shareholder.update({
          where: { id: shareholder.id },
          data: { ownership: newOwnership }
        });
      }
    });
  }
}