import { Request, Response } from "express";
import { ShareClassType } from "@prisma/client";
import { prisma } from "../prismaClient";

export const getAllShareClasses = async (req: Request, res: Response) => {
  try {
    const shareClasses = await prisma.shareClass.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.json({ shareClasses });
  } catch (error) {
    console.error("Error fetching share classes:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

export const createShareClass = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Share class name is required" });
    }

    if (!Object.values(ShareClassType).includes(name)) {
      return res.status(400).json({ error: "Invalid share class type" });
    }

    const shareClass = await prisma.shareClass.create({
      data: {
        name,
        description: description || null
      }
    });

    return res.status(201).json({
      message: "Share class created successfully",
      shareClass
    });
  } catch (error) {
    console.error("Error creating share class:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};