import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ShareholderStatus } from "@prisma/client";


export const getSystemSettings = async (_req: Request, res: Response) => {
  try {

    let settings = await prisma.systemSettings.findUnique({
      where: { id: "system" },
      include: {
        updatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

  
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "system",
          authorizedShares: 1000000,
        },
        include: {
          updatedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
      });
    }

   
    const totalDistributedResult = await prisma.shareholder.aggregate({
      _sum: {
        totalShares: true,
      },
      where: {
        status: ShareholderStatus.approved,
      },
    });

    const totalDistributedShares = totalDistributedResult._sum.totalShares || 0;
    const availableShares = Math.max(0, settings.authorizedShares - totalDistributedShares);

    res.json({ 
      settings: {
        ...settings,
        totalDistributedShares,
        availableShares,
      }
    });
  } catch (error) {
    console.error("Error fetching system settings:", error);
    res.status(500).json({ error: "Failed to fetch system settings" });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { authorizedShares } = req.body;

    if (typeof authorizedShares !== "number" || authorizedShares < 0) {
      return res.status(400).json({ error: "authorizedShares must be a positive number" });
    }


    let settings = await prisma.systemSettings.findUnique({
      where: { id: "system" },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "system",
          authorizedShares,
          updatedById: userId || null,
        },
      });
    } else {
      settings = await prisma.systemSettings.update({
        where: { id: "system" },
        data: {
          authorizedShares,
          updatedById: userId || null,
        },
      });
    }

    // Fetch with relation
    const updatedSettings = await prisma.systemSettings.findUnique({
      where: { id: "system" },
      include: {
        updatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    // Calculate total distributed shares and available shares
    const totalDistributedResult = await prisma.shareholder.aggregate({
      _sum: {
        totalShares: true,
      },
      where: {
        status: ShareholderStatus.approved,
      },
    });

    const totalDistributedShares = totalDistributedResult._sum.totalShares || 0;
    const availableShares = Math.max(0, updatedSettings!.authorizedShares - totalDistributedShares);

    res.json({
      message: "System settings updated successfully",
      settings: {
        ...updatedSettings!,
        totalDistributedShares,
        availableShares,
      },
    });
  } catch (error) {
    console.error("Error updating system settings:", error);
    res.status(500).json({ error: "Failed to update system settings" });
  }
};

