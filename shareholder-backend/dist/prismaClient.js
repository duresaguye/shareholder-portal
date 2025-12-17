"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment.");
}
const url = new URL(process.env.DATABASE_URL);
const pool = new pg_1.Pool({
    user: url.username,
    password: decodeURIComponent(url.password),
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({ adapter });
console.log("✓ Prisma client initialized");
