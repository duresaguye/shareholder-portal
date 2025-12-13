import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalsApi } from '../api/proposals';
import { CreateNewShareholderProposalRequest, CreateShareTransferProposalRequest, CreateGeneralProposalRequest, CastVoteRequest } from '../types/api';

// Query Keys
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: string) => [...proposalKeys.lists(), { filters }] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
  votingResults: (id: string) => [...proposalKeys.detail(id), 'voting-results'] as const,
};

// Queries
export const useProposals = () => {
  return useQuery({
    queryKey: proposalKeys.list('all'),
    queryFn: () => proposalsApi.getAllProposals(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProposal = (id: string) => {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: () => proposalsApi.getProposalById(id),
    enabled: !!id,
  });
};

export const useVotingResults = (proposalId: string) => {
  return useQuery({
    queryKey: proposalKeys.votingResults(proposalId),
    queryFn: () => proposalsApi.getVotingResults(proposalId),
    enabled: !!proposalId,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};

// Mutations
export const useCreateNewShareholderProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewShareholderProposalRequest) =>
      proposalsApi.createNewShareholderProposal(data),
    onSuccess: () => {
      // Invalidate proposals list
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};

export const useCreateShareTransferProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShareTransferProposalRequest) =>
      proposalsApi.createShareTransferProposal(data),
    onSuccess: () => {
      // Invalidate proposals list
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};

export const useCreateGeneralProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGeneralProposalRequest) =>
      proposalsApi.createGeneralProposal(data),
    onSuccess: () => {
      // Invalidate proposals list
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};

export const useCastVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, vote }: { proposalId: string; vote: CastVoteRequest }) =>
      proposalsApi.castVote(proposalId, vote),
    onSuccess: (_, { proposalId }) => {
      // Invalidate proposal details and voting results
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.votingResults(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      
      // If voting closed and approved, invalidate shareholder data too
      queryClient.invalidateQueries({ queryKey: ['shareholders'] });
    },
  });
};

export const useFinalizeVoting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => proposalsApi.finalizeVoting(proposalId),
    onSuccess: (_, proposalId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.votingResults(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['shareholders'] });
    },
  });
};