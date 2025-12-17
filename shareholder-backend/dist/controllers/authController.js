"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.addShareholder = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../prismaClient");
const JWT_SECRET = process.env.JWT_SECRET || "development_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "12h";
const register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, role } = req.body;
        // Only allow admin registration
        if (!username || !password || !firstName || !lastName || !email || !role) {
            return res.status(400).json({ error: "Missing fields." });
        }
        if (role !== "admin") {
            return res.status(403).json({ error: "Only admin accounts can be registered directly. Shareholders must be added through the voting process." });
        }
        if (typeof role !== "string" || role.trim() === "" || !Object.values(client_1.UserRole).includes(role)) {
            return res.status(400).json({ error: "Invalid role." });
        }
        const existingUsername = await prismaClient_1.prisma.shareholder.findUnique({ where: { username } });
        if (existingUsername) {
            return res.status(409).json({ error: "Username already exists." });
        }
        const existingEmail = await prismaClient_1.prisma.shareholder.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({ error: "Email already exists." });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await prismaClient_1.prisma.shareholder.create({
            data: {
                username,
                passwordHash: hashed,
                firstName,
                lastName,
                email,
                role: role,
                status: 'approved', // Admins are always approved
                type: 'individual',
                ownership: 0,
                totalShares: 0
            }
        });
        return res.status(201).json({
            message: "Admin user registered successfully.",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                status: user.status
            }
        });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.register = register;
const addShareholder = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, phone, address, type, status, role, ownership, totalShares } = req.body;
        // Required fields validation
        if (!username || !password || !firstName || !lastName || !email || !type || !status || !role) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        // Validate enums
        if (!['individual', 'institution'].includes(type)) {
            return res.status(400).json({ error: "Invalid shareholder type. Must be 'individual' or 'institution'." });
        }
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: "Invalid status. Must be 'pending', 'approved', or 'rejected'." });
        }
        if (!['admin', 'shareholder'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'shareholder'." });
        }
        // Check for existing username
        const existingUsername = await prismaClient_1.prisma.shareholder.findUnique({ where: { username } });
        if (existingUsername) {
            return res.status(409).json({ error: "Username already exists." });
        }
        // Check for existing email
        const existingEmail = await prismaClient_1.prisma.shareholder.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({ error: "Email already exists." });
        }
        // Hash password
        const hashed = await bcrypt_1.default.hash(password, 10);
        // Create shareholder
        const shareholder = await prismaClient_1.prisma.shareholder.create({
            data: {
                username,
                passwordHash: hashed,
                firstName,
                lastName,
                email,
                phone: phone || null,
                address: address || null,
                type,
                status,
                role,
                ownership: ownership || 0,
                totalShares: totalShares || 0,
            }
        });
        return res.status(201).json({
            message: "Shareholder added successfully.",
            shareholder: {
                id: shareholder.id,
                username: shareholder.username,
                firstName: shareholder.firstName,
                lastName: shareholder.lastName,
                email: shareholder.email,
                type: shareholder.type,
                status: shareholder.status,
                role: shareholder.role,
                ownership: shareholder.ownership,
                totalShares: shareholder.totalShares
            }
        });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.addShareholder = addShareholder;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields." });
        }
        const user = await prismaClient_1.prisma.shareholder.findUnique({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        // All created users can login (no status check needed)
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({
            sub: user.id,
            role: user.role,
            username: user.username
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        // lastLogin update
        await prismaClient_1.prisma.shareholder.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return res.status(500).json({ error: message });
    }
};
exports.login = login;
