"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testController_1 = require("../controllers/testController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// TEMPORARY TESTING ROUTES - Remove in production
router.post('/create-shareholders', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), testController_1.createTestShareholders);
exports.default = router;
