import { ShareholderType, ShareholderStatus, UserRole } from "@prisma/client";
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

    const totalCurrentShares = shareholders.reduce((sum: any, s: { totalShares: any; }) => sum + s.totalShares, 0);
    const totalNewShares = totalCurrentShares + targetShares;

    // Calculate new ownership percentages
    const allocations: ShareAllocation[] = shareholders.map((shareholder: { totalShares: number; id: any; ownership: any; }) => {
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
  ): Promise<any> {
    return await prisma.$transaction(async (tx: { shareholder: { create: (arg0: { data: { username: string; passwordHash: string; firstName: string; lastName: string; email: string; phone: string | undefined; address: string | undefined; type: ShareholderType; status: any; role: UserRole; ownership: number; totalShares: number; }; }) => any; update: (arg0: { where: { id: string; }; data: { ownership: number; }; }) => any; }; }) => {
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
  ): Promise<any> {
    return await prisma.$transaction(async (tx: { shareholder: { create: (arg0: { data: { username: string; passwordHash: string; firstName: string; lastName: string; email: string; phone: string | undefined; address: string | undefined; type: ShareholderType; status: any; role: UserRole; ownership: number; totalShares: number; }; }) => any; findUnique: (arg0: { where: { id: string; }; }) => any; update: (arg0: { where: { id: string; }; data: { totalShares: number; ownership: number; }; }) => any; }; }) => {
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

      // Get total shares for ownership calculation
      const totalShares = await this.getTotalShares();

      // Update the selling shareholder
      const fromShareholder = await tx.shareholder.findUnique({
        where: { id: fromShareholderId }
      });

      if (!fromShareholder) {
        throw new Error("Source shareholder not found");
      }

      const newFromShares = fromShareholder.totalShares - transferShares;
      const newFromOwnership = (newFromShares / totalShares) * 100;

      await tx.shareholder.update({
        where: { id: fromShareholderId },
        data: {
          totalShares: newFromShares,
          ownership: newFromOwnership
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
  ): Promise<any> {
    return await prisma.$transaction(async (tx: { shareholder: { findUnique: (arg0: { where: { id: string; } | { id: string; }; }) => any; update: (arg0: { where: { id: string; } | { id: string; }; data: { totalShares: number; ownership: number; } | { totalShares: any; ownership: number; }; }) => any; }; shareTransferRequest: { create: (arg0: { data: { fromShareholderId: string; toShareholderId: string; shareClassId: string; amount: number; price: number; issueDate: Date; status: string; }; }) => any; }; }) => {
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
          status: 'completed'
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
    await prisma.$transaction(async (tx: { shareholder: { findMany: (arg0: { where: { status: any; }; select: { id: boolean; totalShares: boolean; }; }) => any; update: (arg0: { where: { id: any; }; data: { ownership: number; }; }) => any; }; }) => {
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