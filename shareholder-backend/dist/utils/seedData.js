"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedShareClasses = seedShareClasses;
exports.seedTestShareholders = seedTestShareholders;
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seedShareClasses() {
    try {
        // Check if share classes already exist
        const existingClasses = await prismaClient_1.prisma.shareClass.findMany();
        if (existingClasses.length > 0) {
            console.log("Share classes already exist, skipping seed");
            return;
        }
        // Create default share classes
        const shareClasses = [
            {
                name: client_1.ShareClassType.COMMON,
                description: "Common shares with voting rights"
            },
            {
                name: client_1.ShareClassType.PREFERRED,
                description: "Preferred shares with priority dividends"
            },
            {
                name: client_1.ShareClassType.OPTIONS_POOL,
                description: "Employee stock option pool"
            },
            {
                name: client_1.ShareClassType.TREASURY,
                description: "Treasury shares held by the company"
            }
        ];
        for (const shareClass of shareClasses) {
            await prismaClient_1.prisma.shareClass.create({
                data: shareClass
            });
        }
        console.log("Share classes seeded successfully");
    }
    catch (error) {
        console.error("Error seeding share classes:", error);
    }
}
async function seedTestShareholders() {
    try {
        // Check if our specific test shareholders already exist
        const existingTestShareholders = await prismaClient_1.prisma.shareholder.findMany({
            where: {
                username: {
                    in: ["admin.alice", "bob.shareholder", "cara.institution"]
                }
            }
        });
        if (existingTestShareholders.length === 3) {
            console.log("Test shareholders already exist, skipping shareholder seed");
            return;
        }
        // Ensure COMMON share class exists
        let commonShareClass = await prismaClient_1.prisma.shareClass.findFirst({
            where: { name: client_1.ShareClassType.COMMON }
        });
        if (!commonShareClass) {
            commonShareClass = await prismaClient_1.prisma.shareClass.create({
                data: {
                    name: client_1.ShareClassType.COMMON,
                    description: "Common shares with voting rights"
                }
            });
        }
        // Simple test password for all seeded users
        const password = "Password123!";
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // Create a few test shareholders (1 admin + 2 normal shareholders)
        const alice = existingTestShareholders.find((s) => s.username === "admin.alice") ??
            (await prismaClient_1.prisma.shareholder.create({
                data: {
                    username: "admin.alice",
                    passwordHash,
                    firstName: "Alice",
                    lastName: "Admin",
                    email: "alice.admin@example.com",
                    phone: "+1-555-0001",
                    address: "1 Admin Street",
                    type: client_1.ShareholderType.individual,
                    status: client_1.ShareholderStatus.approved,
                    role: client_1.UserRole.admin,
                    ownership: 0, // will be recalculated from shares
                    totalShares: 5000
                }
            }));
        const bob = existingTestShareholders.find((s) => s.username === "bob.shareholder") ??
            (await prismaClient_1.prisma.shareholder.create({
                data: {
                    username: "bob.shareholder",
                    passwordHash,
                    firstName: "Bob",
                    lastName: "Investor",
                    email: "bob.shareholder@example.com",
                    phone: "+1-555-0002",
                    address: "2 Market Road",
                    type: client_1.ShareholderType.individual,
                    status: client_1.ShareholderStatus.approved,
                    role: client_1.UserRole.shareholder,
                    ownership: 0,
                    totalShares: 3000
                }
            }));
        const cara = existingTestShareholders.find((s) => s.username === "cara.institution") ??
            (await prismaClient_1.prisma.shareholder.create({
                data: {
                    username: "cara.institution",
                    passwordHash,
                    firstName: "Cara",
                    lastName: "Capital",
                    email: "cara.institution@example.com",
                    phone: "+1-555-0003",
                    address: "3 Wall Street",
                    type: client_1.ShareholderType.institution,
                    status: client_1.ShareholderStatus.approved,
                    role: client_1.UserRole.shareholder,
                    ownership: 0,
                    totalShares: 2000
                }
            }));
        // Create ShareholderShare records in COMMON class
        const issueDate = new Date();
        await prismaClient_1.prisma.shareholderShare.createMany({
            data: [
                {
                    shareholderId: alice.id,
                    shareClassId: commonShareClass.id,
                    amount: 5000,
                    price: 1.5,
                    issueDate
                },
                {
                    shareholderId: bob.id,
                    shareClassId: commonShareClass.id,
                    amount: 3000,
                    price: 1.2,
                    issueDate
                },
                {
                    shareholderId: cara.id,
                    shareClassId: commonShareClass.id,
                    amount: 2000,
                    price: 2.0,
                    issueDate
                }
            ]
        });
        // Recalculate ownership percentages based on totalShares
        const totalShares = (alice.totalShares || 0) +
            (bob.totalShares || 0) +
            (cara.totalShares || 0);
        if (totalShares > 0) {
            await prismaClient_1.prisma.shareholder.updateMany({
                where: { id: { in: [alice.id, bob.id, cara.id] } },
                data: { ownership: 0 }
            });
            await prismaClient_1.prisma.shareholder.update({
                where: { id: alice.id },
                data: { ownership: (alice.totalShares / totalShares) * 100 }
            });
            await prismaClient_1.prisma.shareholder.update({
                where: { id: bob.id },
                data: { ownership: (bob.totalShares / totalShares) * 100 }
            });
            await prismaClient_1.prisma.shareholder.update({
                where: { id: cara.id },
                data: { ownership: (cara.totalShares / totalShares) * 100 }
            });
        }
        console.log("Test shareholders seeded successfully");
        console.log("You can log in with username 'admin.alice' and password 'Password123!'");
    }
    catch (error) {
        console.error("Error seeding test shareholders:", error);
    }
}
// Run seed if this file is executed directly
if (require.main === module) {
    (async () => {
        try {
            await seedShareClasses();
            await seedTestShareholders();
            console.log("Seeding completed");
            process.exit(0);
        }
        catch (error) {
            console.error("Seeding failed:", error);
            process.exit(1);
        }
    })();
}
