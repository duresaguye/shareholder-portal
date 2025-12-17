import { apiClient } from './client';
import { Shareholder } from '../types/api';

export const testApi = {
  // Create test shareholders (temporary endpoint)
  createTestShareholders: async (): Promise<{ message: string; shareholders: Array<{ id: string; username: string; name: string; ownership: number; totalShares: number }>; note: string }> => {
    return apiClient.post('/api/test/create-shareholders');
  },
};