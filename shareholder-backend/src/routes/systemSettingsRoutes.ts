import express from "express";
import { getSystemSettings, updateSystemSettings } from "../controllers/systemSettingsController";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();


router.get("/", authenticateJWT, getSystemSettings);


router.put("/", authenticateJWT, authorizeRoles("admin"), updateSystemSettings);

export default router;

