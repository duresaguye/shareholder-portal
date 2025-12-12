import express from 'express';
import { createTestShareholders } from '../controllers/testController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// TEMPORARY TESTING ROUTES - Remove in production
router.post('/create-shareholders', authenticateJWT, authorizeRoles('admin'), createTestShareholders);

export default router;