"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.getPendingShareholders = exports.deleteShareholder = exports.updateShareholder = exports.getShareholderById = exports.updateShareholderStatus = exports.getAllUsers = exports.getAllShareholders = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../prismaClient");
const getAllShareholders = async (req, res) => {
    try {
        const shareholders = await prismaClient_1.prisma.shareholder.findMany({
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
    }
    catch (e) {
        console.error("Error fetching shareholders:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getAllShareholders = getAllShareholders;
const getAllUsers = async (req, res) => {
    try {
        const users = await prismaClient_1.prisma.shareholder.findMany({
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
    }
    catch (e) {
        console.error("Error fetching users:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getAllUsers = getAllUsers;
const updateShareholderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!Object.values(client_1.ShareholderStatus).includes(status)) {
            return res.status(400).json({ error: "Invalid status." });
        }
        const shareholder = await prismaClient_1.prisma.shareholder.update({
            where: { id },
            data: { status: status },
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
    }
    catch (e) {
        console.error("Error updating shareholder status:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.updateShareholderStatus = updateShareholderStatus;
const getShareholderById = async (req, res) => {
    try {
        const { id } = req.params;
        const shareholder = await prismaClient_1.prisma.shareholder.findUnique({
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
                updatedAt: true,
                shares: {
                    select: {
                        price: true,
                        amount: true,
                        issueDate: true
                    },
                    orderBy: {
                        issueDate: 'desc'
                    }
                }
            }
        });
        if (!shareholder) {
            return res.status(404).json({ error: "Shareholder not found." });
        }
        // Calculate average share price from all share purchases
        // If no shares exist, use a default or calculate from the most recent purchase
        let shareValue = 0;
        if (shareholder.shares && shareholder.shares.length > 0) {
            // Calculate weighted average price
            const totalValue = shareholder.shares.reduce((sum, share) => sum + (share.price * share.amount), 0);
            const totalAmount = shareholder.shares.reduce((sum, share) => sum + share.amount, 0);
            shareValue = totalAmount > 0 ? totalValue / totalAmount : shareholder.shares[0].price;
        }
        return res.json({
            shareholder: {
                ...shareholder,
                shareValue: shareValue || 0,
                shares: shareholder.shares // Include shares array for frontend calculations
            }
        });
    }
    catch (e) {
        console.error("Error fetching shareholder:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getShareholderById = getShareholderById;
const updateShareholder = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, address, type, ownership, totalShares } = req.body;
        // Check if shareholder exists
        const existingShareholder = await prismaClient_1.prisma.shareholder.findUnique({ where: { id } });
        if (!existingShareholder) {
            return res.status(404).json({ error: "Shareholder not found." });
        }
        // Check if email is being changed and if it already exists
        if (email && email !== existingShareholder.email) {
            const existingEmail = await prismaClient_1.prisma.shareholder.findUnique({ where: { email } });
            if (existingEmail) {
                return res.status(409).json({ error: "Email already exists." });
            }
        }
        // Validate type if provided
        if (type && !Object.values(client_1.ShareholderType).includes(type)) {
            return res.status(400).json({ error: "Invalid shareholder type." });
        }
        const updatedShareholder = await prismaClient_1.prisma.shareholder.update({
            where: { id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(email && { email }),
                ...(phone !== undefined && { phone: phone || null }),
                ...(address !== undefined && { address: address || null }),
                ...(type && { type: type }),
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
    }
    catch (e) {
        console.error("Error updating shareholder:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.updateShareholder = updateShareholder;
const deleteShareholder = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if shareholder exists
        const existingShareholder = await prismaClient_1.prisma.shareholder.findUnique({ where: { id } });
        if (!existingShareholder) {
            return res.status(404).json({ error: "Shareholder not found." });
        }
        // Prevent deleting admins
        if (existingShareholder.role === 'admin') {
            return res.status(403).json({ error: "Cannot delete admin users." });
        }
        await prismaClient_1.prisma.shareholder.delete({ where: { id } });
        return res.json({
            message: "Shareholder deleted successfully.",
            deletedId: id
        });
    }
    catch (e) {
        console.error("Error deleting shareholder:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.deleteShareholder = deleteShareholder;
const getPendingShareholders = async (req, res) => {
    try {
        const pendingShareholders = await prismaClient_1.prisma.shareholder.findMany({
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
    }
    catch (e) {
        console.error("Error fetching pending shareholders:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getPendingShareholders = getPendingShareholders;
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const shareholder = await prismaClient_1.prisma.shareholder.findUnique({
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
    }
    catch (e) {
        console.error("Error fetching current user:", e);
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.getCurrentUser = getCurrentUser;
