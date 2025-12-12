import express from 'express';
import { getAllShareClasses, createShareClass } from '../controllers/shareClassController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/all', authenticateJWT, authorizeRoles('shareholder', 'admin'), getAllShareClasses);
router.post('/create', authenticateJWT, authorizeRoles('admin'), createShareClass);

export default router;