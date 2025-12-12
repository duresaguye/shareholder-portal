import express from "express";
import {
  createAnnouncement,
  getAnnouncementById,
  getAnnouncements,
} from "../controllers/announcementController";

const router = express.Router();


router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);
router.post("/", createAnnouncement);

export default router;

