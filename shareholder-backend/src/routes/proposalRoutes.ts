import express from 'express';
import {
  createNewShareholderProposal,
  createShareTransferProposal,
  createGeneralProposal,
  getAllProposals,
  getProposalById,
  castVote,
  getVotingResults,
  finalizeVoting
} from '../controllers/proposalController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Proposal management routes
router.post('/new-shareholder', authenticateJWT, authorizeRoles('admin'), createNewShareholderProposal);
router.post('/share-transfer', authenticateJWT, authorizeRoles('shareholder', 'admin'), createShareTransferProposal);
router.post('/general', authenticateJWT, authorizeRoles('shareholder', 'admin'), createGeneralProposal);
router.get('/all', authenticateJWT, authorizeRoles('shareholder', 'admin'), getAllProposals);
router.get('/:id', authenticateJWT, authorizeRoles('shareholder', 'admin'), getProposalById);

// Voting routes
router.post('/:id/vote', authenticateJWT, authorizeRoles('shareholder', 'admin'), castVote);
router.get('/:id/results', authenticateJWT, authorizeRoles('shareholder', 'admin'), getVotingResults);
router.post('/:id/finalize', authenticateJWT, authorizeRoles('admin'), finalizeVoting);

export default router;