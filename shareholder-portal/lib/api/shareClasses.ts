import { apiClient } from './client';
import { ShareClassesResponse, ShareClass } from '../types/api';

export const shareClassesApi = {
  // Get all share classes
  getAllShareClasses: async (): Promise<ShareClassesResponse> => {
    return apiClient.get<ShareClassesResponse>('/api/share-classes/all');
  },

  // Create new share class (admin only)
  createShareClass: async (data: { name: string; description?: string }): Promise<{ message: string; shareClass: ShareClass }> => {
    return apiClient.post('/api/share-classes/create', data);
  },
};