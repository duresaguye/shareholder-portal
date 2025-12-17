"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables FIRST before any other imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const shareholderRoutes_1 = __importDefault(require("./routes/shareholderRoutes"));
const proposalRoutes_1 = __importDefault(require("./routes/proposalRoutes"));
const shareClassRoutes_1 = __importDefault(require("./routes/shareClassRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const announcementRoutes_1 = __importDefault(require("./routes/announcementRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "https://fayda-profile.velnet.et",
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Health check route
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/shareholders", shareholderRoutes_1.default);
app.use("/api/proposals", proposalRoutes_1.default);
app.use("/api/share-classes", shareClassRoutes_1.default);
app.use("/api/announcements", announcementRoutes_1.default);
app.use("/api/test", testRoutes_1.default); // TEMPORARY - Remove in production
app.get("/api/protected", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("admin"), (req, res) => {
    res.json({ message: "You are an admin and authenticated!" });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
});
// Generic error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
