import dotenv from "dotenv";
dotenv.config(); 

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment.");
}


const url = new URL(process.env.DATABASE_URL);
const pool = new Pool({
  user: url.username,
  password: decodeURIComponent(url.password),
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
});

const adapter = new PrismaPg(pool);


export const prisma = new PrismaClient({ adapter });

console.log("✓ Prisma client initialized");
