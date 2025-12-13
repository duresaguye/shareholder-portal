import { apiClient } from './client';
import { 
  ProposalsResponse, 
  ProposalResponse, 
  VotingResultsResponse,
  CreateNewShareholderProposalRequest,
  CreateShareTransferProposalRequest,
  CreateGeneralProposalRequest,
  CastVoteRequest 
} from '../types/api';

export const proposalsApi = {
  // Create new shareholder proposal
  createNewShareholderProposal: async (data: CreateNewShareholderProposalRequest): Promise<{ message: string; proposal: any }> => {
    return apiClient.post('/api/proposals/new-shareholder', data);
  },

  // Create share transfer proposal
  createShareTransferProposal: async (data: CreateShareTransferProposalRequest): Promise<{ message: string; proposal: any; transferRequest: any }> => {
    return apiClient.post('/api/proposals/share-transfer', data);
  },

  // Create general/amendment proposal
  createGeneralProposal: async (data: CreateGeneralProposalRequest): Promise<{ message: string; proposal: any }> => {
    return apiClient.post('/api/proposals/general', data);
  },

  // Get all proposals
  getAllProposals: async (): Promise<ProposalsResponse> => {
    return apiClient.get<ProposalsResponse>('/api/proposals/all');
  },

  // Get proposal by ID
  getProposalById: async (id: string): Promise<ProposalResponse> => {
    return apiClient.get<ProposalResponse>(`/api/proposals/${id}`);
  },

  // Cast vote on proposal
  castVote: async (proposalId: string, data: CastVoteRequest): Promise<{ message: string; vote: any; votingClosed?: boolean; votingResults?: any }> => {
    return apiClient.post(`/api/proposals/${proposalId}/vote`, data);
  },

  // Get voting results
  getVotingResults: async (proposalId: string): Promise<VotingResultsResponse> => {
    return apiClient.get<VotingResultsResponse>(`/api/proposals/${proposalId}/results`);
  },

  // Finalize voting (admin only)
  finalizeVoting: async (proposalId: string): Promise<{ message: string; votingResults: any; executionResult?: any }> => {
    return apiClient.post(`/api/proposals/${proposalId}/finalize`);
  },
};