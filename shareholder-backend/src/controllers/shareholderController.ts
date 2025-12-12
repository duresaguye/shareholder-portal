import { Request, Response } from "express";
import { UserRole, ShareholderType, ShareholderStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../prismaClient";



export const getAllShareholders = async (req: Request, res: Response) => {
  try {
    const shareholders = await prisma.shareholder.findMany({
      where: {
        role: 'shareholder' // Only return shareholders, not admins
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        status: true,
        role: true,
        ownership: true,
        totalShares: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({ shareholders });
  } catch (e: any) {
    console.error("Error fetching shareholders:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.shareholder.findMany({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        status: true,
        role: true,
        ownership: true,
        totalShares: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({ users });
  } catch (e: any) {
    console.error("Error fetching users:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const updateShareholderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ShareholderStatus).includes(status as ShareholderStatus)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const shareholder = await prisma.shareholder.update({
      where: { id },
      data: { status: status as ShareholderStatus },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        status: true
      }
    });

    return res.json({
      message: "Shareholder status updated successfully.",
      shareholder
    });
  } catch (e: any) {
    console.error("Error updating shareholder status:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const getShareholderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const shareholder = await prisma.shareholder.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        status: true,
        role: true,
        ownership: true,
        totalShares: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!shareholder) {
      return res.status(404).json({ error: "Shareholder not found." });
    }

    return res.json({ shareholder });
  } catch (e: any) {
    console.error("Error fetching shareholder:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const updateShareholder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      type,
      ownership,
      totalShares
    } = req.body;

    // Check if shareholder exists
    const existingShareholder = await prisma.shareholder.findUnique({ where: { id } });
    if (!existingShareholder) {
      return res.status(404).json({ error: "Shareholder not found." });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingShareholder.email) {
      const existingEmail = await prisma.shareholder.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ error: "Email already exists." });
      }
    }

    // Validate type if provided
    if (type && !Object.values(ShareholderType).includes(type as ShareholderType)) {
      return res.status(400).json({ error: "Invalid shareholder type." });
    }

    const updatedShareholder = await prisma.shareholder.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(address !== undefined && { address: address || null }),
        ...(type && { type: type as ShareholderType }),
        ...(ownership !== undefined && { ownership: parseFloat(ownership) }),
        ...(totalShares !== undefined && { totalShares: parseInt(totalShares) }),
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        status: true,
        role: true,
        ownership: true,
        totalShares: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json({
      message: "Shareholder updated successfully.",
      shareholder: updatedShareholder
    });
  } catch (e: any) {
    console.error("Error updating shareholder:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const deleteShareholder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if shareholder exists
    const existingShareholder = await prisma.shareholder.findUnique({ where: { id } });
    if (!existingShareholder) {
      return res.status(404).json({ error: "Shareholder not found." });
    }

    // Prevent deleting admins
    if (existingShareholder.role === 'admin') {
      return res.status(403).json({ error: "Cannot delete admin users." });
    }

    await prisma.shareholder.delete({ where: { id } });

    return res.json({
      message: "Shareholder deleted successfully.",
      deletedId: id
    });
  } catch (e: any) {
    console.error("Error deleting shareholder:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const getPendingShareholders = async (req: Request, res: Response) => {
  try {
    const pendingShareholders = await prisma.shareholder.findMany({
      where: {
        status: 'pending',
        role: 'shareholder'
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        status: true,
        role: true,
        ownership: true,
        totalShares: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({ 
      pendingShareholders,
      count: pendingShareholders.length 
    });
  } catch (e: any) {
    console.error("Error fetching pending shareholders:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const shareholder = await prisma.shareholder.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        status: true,
        role: true,
        ownership: true,
        totalShares: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!shareholder) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ shareholder });
  } catch (e: any) {
    console.error("Error fetching current user:", e);
    return res.status(500).json({ error: e.message });
  }
};