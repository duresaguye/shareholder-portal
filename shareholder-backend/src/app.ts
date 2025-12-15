// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import shareholderRoutes from "./routes/shareholderRoutes";
import proposalRoutes from "./routes/proposalRoutes";
import shareClassRoutes from "./routes/shareClassRoutes";
import testRoutes from "./routes/testRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import { authenticateJWT, authorizeRoles } from "./middlewares/authMiddleware";

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://fayda-profile.velnet.et",
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});


app.use("/api/auth", authRoutes);
app.use("/api/shareholders", shareholderRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/share-classes", shareClassRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/test", testRoutes); // TEMPORARY - Remove in production

app.get(
  "/api/protected",
  authenticateJWT,
  authorizeRoles("admin"),
  (req: Request, res: Response) => {
    res.json({ message: "You are an admin and authenticated!" });
  }
);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Generic error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});