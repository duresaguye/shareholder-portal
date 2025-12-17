import { apiClient } from './client';
import { 
  ProposalsResponse, 
  ProposalResponse, 
  VotingResultsResponse,
  CreateNewShareholderProposalRequest,
  CreateShareTransferProposalRequest,
  CreateGeneralProposalRequest,
  CastVoteRequest,
  CreateProposalResponse,
  CreateShareTransferProposalResponse,
  CastVoteResponse,
  FinalizeVotingResponse,
} from '../types/api';

export const proposalsApi = {
  // Create new shareholder proposal
  createNewShareholderProposal: async (
    data: CreateNewShareholderProposalRequest
  ): Promise<CreateProposalResponse> => {
    return apiClient.post<CreateProposalResponse>('/api/proposals/new-shareholder', data);
  },

  // Create share transfer proposal
  createShareTransferProposal: async (
    data: CreateShareTransferProposalRequest
  ): Promise<CreateShareTransferProposalResponse> => {
    return apiClient.post<CreateShareTransferProposalResponse>('/api/proposals/share-transfer', data);
  },

  // Create general/amendment proposal
  createGeneralProposal: async (
    data: CreateGeneralProposalRequest
  ): Promise<CreateProposalResponse> => {
    return apiClient.post<CreateProposalResponse>('/api/proposals/general', data);
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
  castVote: async (
    proposalId: string,
    data: CastVoteRequest
  ): Promise<CastVoteResponse> => {
    return apiClient.post<CastVoteResponse>(`/api/proposals/${proposalId}/vote`, data);
  },

  // Get voting results
  getVotingResults: async (proposalId: string): Promise<VotingResultsResponse> => {
    return apiClient.get<VotingResultsResponse>(`/api/proposals/${proposalId}/results`);
  },

  // Finalize voting (admin only)
  finalizeVoting: async (proposalId: string): Promise<FinalizeVotingResponse> => {
    return apiClient.post<FinalizeVotingResponse>(`/api/proposals/${proposalId}/finalize`);
  },
};