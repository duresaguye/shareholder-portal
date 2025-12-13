import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testApi } from '../api/test';

export const useCreateTestShareholders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => testApi.createTestShareholders(),
    onSuccess: () => {
      // Invalidate all shareholder queries to show new test data
      queryClient.invalidateQueries({ queryKey: ['shareholders'] });
    },
  });
};