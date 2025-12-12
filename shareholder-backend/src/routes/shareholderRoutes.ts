import express from 'express';
import { 
  getAllShareholders, 
  getAllUsers, 
  updateShareholderStatus,
  getShareholderById,
  updateShareholder,
  deleteShareholder,
  getPendingShareholders,
  getCurrentUser
} from '../controllers/shareholderController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Current user route 
router.get('/me', authenticateJWT, getCurrentUser); // Get current user's shareholder info

// Admin-only routes


router.get('/all', authenticateJWT, authorizeRoles('shareholder', 'admin'), getAllShareholders);
router.get('/users', authenticateJWT, authorizeRoles('admin'), getAllUsers); // All users including admins
router.get('/pending', authenticateJWT, authorizeRoles('admin'), getPendingShareholders); // Pending approvals
router.get('/:id', authenticateJWT, authorizeRoles('admin'), getShareholderById); // Get single shareholder
router.put('/:id', authenticateJWT, authorizeRoles('admin'), updateShareholder); // Update shareholder details
router.patch('/:id/status', authenticateJWT, authorizeRoles('admin'), updateShareholderStatus); // Update status only
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteShareholder); // Delete shareholder

export default router;