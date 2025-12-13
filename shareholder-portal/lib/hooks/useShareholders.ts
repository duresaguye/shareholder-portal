import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { shareholdersApi } from '../api/shareholders';
import { Shareholder } from '../types/api';

// Query Keys
export const shareholderKeys = {
  all: ['shareholders'] as const,
  lists: () => [...shareholderKeys.all, 'list'] as const,
  list: (filters: string) => [...shareholderKeys.lists(), { filters }] as const,
  details: () => [...shareholderKeys.all, 'detail'] as const,
  detail: (id: string) => [...shareholderKeys.details(), id] as const,
  pending: () => [...shareholderKeys.all, 'pending'] as const,
  users: () => [...shareholderKeys.all, 'users'] as const,
  current: () => [...shareholderKeys.all, 'current'] as const,
};

// Queries
export const useShareholders = () => {
  return useQuery({
    queryKey: shareholderKeys.list('shareholders'),
    queryFn: () => shareholdersApi.getAllShareholders(),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // Background refetch every 30 seconds - won't cause UI flicker
    refetchInterval: 30000,
    refetchIntervalInBackground: true, // Continue refetching even when tab is in background
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: shareholderKeys.users(),
    queryFn: () => shareholdersApi.getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePendingShareholders = () => {
  return useQuery({
    queryKey: shareholderKeys.pending(),
    queryFn: () => shareholdersApi.getPendingShareholders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useShareholder = (id: string) => {
  return useQuery({
    queryKey: shareholderKeys.detail(id),
    queryFn: () => shareholdersApi.getShareholderById(id),
    enabled: !!id,
  });
};

export const useCurrentUser = (
  options?: Partial<UseQueryOptions<{ shareholder: Shareholder }, Error>>
) => {
  return useQuery({
    queryKey: shareholderKeys.current(),
    queryFn: () => shareholdersApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
};

// Mutations
export const useUpdateShareholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shareholder> }) =>
      shareholdersApi.updateShareholder(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: shareholderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: shareholderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shareholderKeys.users() });
    },
  });
};

export const useUpdateShareholderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'approved' | 'rejected' }) =>
      shareholdersApi.updateShareholderStatus(id, status),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: shareholderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: shareholderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shareholderKeys.pending() });
      queryClient.invalidateQueries({ queryKey: shareholderKeys.users() });
    },
  });
};

export const useDeleteShareholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shareholdersApi.deleteShareholder(id),
    onSuccess: () => {
      // Invalidate all shareholder queries
      queryClient.invalidateQueries({ queryKey: shareholderKeys.all });
    },
  });
};