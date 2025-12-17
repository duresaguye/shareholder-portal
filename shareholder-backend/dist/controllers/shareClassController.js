"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShareClass = exports.getAllShareClasses = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../prismaClient");
const getAllShareClasses = async (req, res) => {
    try {
        const shareClasses = await prismaClient_1.prisma.shareClass.findMany({
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
    }
    catch (error) {
        console.error("Error fetching share classes:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getAllShareClasses = getAllShareClasses;
const createShareClass = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Share class name is required" });
        }
        if (!Object.values(client_1.ShareClassType).includes(name)) {
            return res.status(400).json({ error: "Invalid share class type" });
        }
        const shareClass = await prismaClient_1.prisma.shareClass.create({
            data: {
                name,
                description: description || null
            }
        });
        return res.status(201).json({
            message: "Share class created successfully",
            shareClass
        });
    }
    catch (error) {
        console.error("Error creating share class:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.createShareClass = createShareClass;
