"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proposalController_1 = require("../controllers/proposalController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Proposal management routes
router.post('/new-shareholder', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), proposalController_1.createNewShareholderProposal);
router.post('/share-transfer', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), proposalController_1.createShareTransferProposal);
router.post('/general', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), proposalController_1.createGeneralProposal);
router.get('/all', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), proposalController_1.getAllProposals);
router.get('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), proposalController_1.getProposalById);
// Voting routes
router.post('/:id/vote', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), proposalController_1.castVote);
router.get('/:id/results', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('shareholder', 'admin'), proposalController_1.getVotingResults);
router.post('/:id/finalize', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)('admin'), proposalController_1.finalizeVoting);
exports.default = router;
