import express from 'express';
import { register, login, addShareholder } from '../controllers/authController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/add-shareholder', authenticateJWT, authorizeRoles('admin'), addShareholder);

export default router;
