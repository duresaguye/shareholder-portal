"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shareClassController_1 = require("../controllers/shareClassController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/all', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), shareClassController_1.getAllShareClasses);
router.post('/create', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), shareClassController_1.createShareClass);
exports.default = router;
