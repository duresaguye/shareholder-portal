import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { prisma } from "../prismaClient";

const JWT_SECRET = process.env.JWT_SECRET || "development_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "12h";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, firstName, lastName, email, role } = req.body;
    
    // Only allow admin registration
    if (!username || !password || !firstName || !lastName || !email || !role) {
      return res.status(400).json({ error: "Missing fields." });
    }
    
    if (role !== "admin") {
      return res.status(403).json({ error: "Only admin accounts can be registered directly. Shareholders must be added through the voting process." });
    }
    
    if (typeof role !== "string" || role.trim() === "" || !Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ error: "Invalid role." });
    }
    
    const existingUsername = await prisma.shareholder.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists." });
    }
    
    const existingEmail = await prisma.shareholder.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists." });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.shareholder.create({
      data: {
        username,
        passwordHash: hashed,
        firstName,
        lastName,
        email,
        role: role as UserRole,
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}

export const addShareholder = async (req: Request, res: Response) => {
  try {
    const { 
      username, 
      password, 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      type, 
      status, 
      role, 
      ownership, 
      totalShares 
    } = req.body;

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
    const existingUsername = await prisma.shareholder.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists." });
    }
    
    // Check for existing email
    const existingEmail = await prisma.shareholder.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create shareholder
    const shareholder = await prisma.shareholder.create({
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields." });
    }
    const user = await prisma.shareholder.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    // All created users can login (no status check needed)
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        username: user.username
      },
      JWT_SECRET as Secret,
      { expiresIn: JWT_EXPIRES } as SignOptions
    );
    // lastLogin update
    await prisma.shareholder.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
