import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shareClassesApi } from '../api/shareClasses';

// Query Keys
export const shareClassKeys = {
  all: ['shareClasses'] as const,
  lists: () => [...shareClassKeys.all, 'list'] as const,
};

// Queries
export const useShareClasses = () => {
  return useQuery({
    queryKey: shareClassKeys.lists(),
    queryFn: () => shareClassesApi.getAllShareClasses(),
    staleTime: 10 * 60 * 1000, // 10 minutes (share classes don't change often)
  });
};

// Mutations
export const useCreateShareClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      shareClassesApi.createShareClass(data),
    onSuccess: () => {
      // Invalidate share classes list
      queryClient.invalidateQueries({ queryKey: shareClassKeys.lists() });
    },
  });
};