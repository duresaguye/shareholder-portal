"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestShareholders = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = require("../prismaClient");
// TEMPORARY ENDPOINT FOR TESTING - Creates initial shareholders with shares
// This should be removed in production
const createTestShareholders = async (req, res) => {
    try {
        // Check if test shareholders already exist
        const existing = await prismaClient_1.prisma.shareholder.findMany({
            where: {
                username: { in: ['johnsmith', 'sarahjones', 'mikebrown'] }
            }
        });
        if (existing.length > 0) {
            return res.status(400).json({ error: "Test shareholders already exist" });
        }
        const testShareholders = [
            {
                username: 'johnsmith',
                password: 'password123',
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@example.com',
                phone: '+1234567890',
                address: '123 Main Street',
                type: client_1.ShareholderType.individual,
                role: client_1.UserRole.shareholder,
                ownership: 40.0,
                totalShares: 40000
            },
            {
                username: 'sarahjones',
                password: 'password123',
                firstName: 'Sarah',
                lastName: 'Jones',
                email: 'sarah.jones@example.com',
                phone: '+1987654321',
                address: '789 Pine Street',
                type: client_1.ShareholderType.individual,
                role: client_1.UserRole.shareholder,
                ownership: 35.0,
                totalShares: 35000
            },
            {
                username: 'mikebrown',
                password: 'password123',
                firstName: 'Mike',
                lastName: 'Brown',
                email: 'mike.brown@example.com',
                phone: '+1555666777',
                address: '456 Oak Avenue',
                type: client_1.ShareholderType.individual,
                role: client_1.UserRole.shareholder,
                ownership: 25.0,
                totalShares: 25000
            }
        ];
        const createdShareholders = [];
        for (const shareholderData of testShareholders) {
            const passwordHash = await bcrypt_1.default.hash(shareholderData.password, 10);
            const shareholder = await prismaClient_1.prisma.shareholder.create({
                data: {
                    username: shareholderData.username,
                    passwordHash,
                    firstName: shareholderData.firstName,
                    lastName: shareholderData.lastName,
                    email: shareholderData.email,
                    phone: shareholderData.phone,
                    address: shareholderData.address,
                    type: shareholderData.type,
                    status: client_1.ShareholderStatus.approved,
                    role: shareholderData.role,
                    ownership: shareholderData.ownership,
                    totalShares: shareholderData.totalShares
                }
            });
            createdShareholders.push({
                id: shareholder.id,
                username: shareholder.username,
                name: `${shareholder.firstName} ${shareholder.lastName}`,
                ownership: shareholder.ownership,
                totalShares: shareholder.totalShares
            });
        }
        return res.status(201).json({
            message: "Test shareholders created successfully",
            shareholders: createdShareholders,
            note: "These shareholders can now login and participate in voting. Total ownership: 100%"
        });
    }
    catch (error) {
        console.error("Error creating test shareholders:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.createTestShareholders = createTestShareholders;
