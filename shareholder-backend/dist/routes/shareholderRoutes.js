"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shareholderController_1 = require("../controllers/shareholderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Current user route 
router.get('/me', authMiddleware_1.authenticateJWT, shareholderController_1.getCurrentUser); // Get current user's shareholder info
// Admin-only routes
router.get('/all', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), shareholderController_1.getAllShareholders);
router.get('/users', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareholderController_1.getAllUsers); // All users including admins
router.get('/pending', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareholderController_1.getPendingShareholders); // Pending approvals
router.get('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareholderController_1.getShareholderById); // Get single shareholder
router.put('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareholderController_1.updateShareholder); // Update shareholder details
router.patch('/:id/status', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareholderController_1.updateShareholderStatus); // Update status only
router.delete('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareholderController_1.deleteShareholder); // Delete shareholder
exports.default = router;
