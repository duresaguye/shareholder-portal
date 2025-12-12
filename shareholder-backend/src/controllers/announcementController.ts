import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const mapAnnouncement = (announcement: any) => {
  const authorName =
    announcement.author?.firstName && announcement.author?.lastName
      ? `${announcement.author.firstName} ${announcement.author.lastName}`
      : announcement.authorName || "Unknown";

  const role =
    announcement.role ||
    announcement.author?.role ||
    (announcement.author?.role === "admin" ? "Administrator" : "Shareholder");

  const date = announcement.date instanceof Date ? announcement.date : new Date(announcement.date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  let timeAgo = "Just now";

  if (diffInHours >= 24) {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) timeAgo = "1 day ago";
    else if (diffInDays < 7) timeAgo = `${diffInDays} days ago`;
    else if (diffInDays < 30) timeAgo = `${Math.floor(diffInDays / 7)} weeks ago`;
    else timeAgo = `${Math.floor(diffInDays / 30)} months ago`;
  } else if (diffInHours >= 1) {
    timeAgo = `${diffInHours} hours ago`;
  }

  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    author: authorName,
    role,
    date: date.toISOString().split("T")[0],
    timeAgo,
    priority: announcement.priority,
    category: announcement.category,
  };
};

// GET all announcements
export const getAnnouncements = async (_req: Request, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: "desc" },
      include: {
        author: {
          select: { firstName: true, lastName: true, role: true },
        },
      },
    });

    return res.json(announcements.map(mapAnnouncement));
  } catch (e: any) {
    console.error("Error fetching announcements:", e);
    return res.status(500).json({ error: e.message });
  }
};

// GET announcement by ID
export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: { firstName: true, lastName: true, role: true },
        },
      },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found." });
    }

    return res.json(mapAnnouncement(announcement));
  } catch (e: any) {
    console.error("Error fetching announcement:", e);
    return res.status(500).json({ error: e.message });
  }
};

// CREATE a new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, author, role, category = "General", priority = "medium", authorId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    // Determine author
    let authorRecord = null;
    if (authorId) {
      authorRecord = await prisma.shareholder.findUnique({
        where: { id: authorId },
        select: { id: true, firstName: true, lastName: true, role: true },
      });
    }

    if (!authorRecord) {
      authorRecord = await prisma.shareholder.findFirst({
        where: { role: "admin" },
        select: { id: true, firstName: true, lastName: true, role: true },
      });
    }

    if (!authorRecord) {
      authorRecord = await prisma.shareholder.findFirst({
        select: { id: true, firstName: true, lastName: true, role: true },
      });
    }

    if (!authorRecord) {
      return res.status(400).json({ error: "No author available to create announcement." });
    }

    const created = await prisma.announcement.create({
      data: {
        title,
        content,
        role: role || authorRecord.role || "Administrator",
        date: new Date(),
        priority,
        category,
        author: { connect: { id: authorRecord.id } },
      } as Parameters<typeof prisma.announcement.create>[0]['data'], 
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
      },
    });

    return res.status(201).json(mapAnnouncement({ ...created, authorName: author || undefined }));
  } catch (e: any) {
    console.error("Error creating announcement:", e);
    return res.status(500).json({ error: e.message });
  }
};
