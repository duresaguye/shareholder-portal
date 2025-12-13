import { apiClient } from './client';

export const testApi = {
  // Create test shareholders (temporary endpoint)
  createTestShareholders: async (): Promise<{ message: string; shareholders: any[]; note: string }> => {
    return apiClient.post('/api/test/create-shareholders');
  },
};