import { apiClient } from './client';
import { ShareholdersResponse, UsersResponse, Shareholder } from '../types/api';

export const shareholdersApi = {
  // Get all shareholders (excludes admins)
  getAllShareholders: async (): Promise<ShareholdersResponse> => {
    return apiClient.get<ShareholdersResponse>('/api/shareholders/all');
  },

  // Get all users (includes admins and shareholders)
  getAllUsers: async (): Promise<UsersResponse> => {
    return apiClient.get<UsersResponse>('/api/shareholders/users');
  },

  // Get pending shareholders
  getPendingShareholders: async (): Promise<{ pendingShareholders: Shareholder[]; count: number }> => {
    return apiClient.get('/api/shareholders/pending');
  },

  // Get single shareholder by ID
  getShareholderById: async (id: string): Promise<{ shareholder: Shareholder }> => {
    return apiClient.get(`/api/shareholders/${id}`);
  },

  // Update shareholder details
  updateShareholder: async (id: string, data: Partial<Shareholder>): Promise<{ message: string; shareholder: Shareholder }> => {
    return apiClient.put(`/api/shareholders/${id}`, data);
  },

  // Update shareholder status
  updateShareholderStatus: async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ message: string; shareholder: Shareholder }> => {
    return apiClient.patch(`/api/shareholders/${id}/status`, { status });
  },

  // Delete shareholder
  deleteShareholder: async (id: string): Promise<{ message: string; deletedId: string }> => {
    return apiClient.delete(`/api/shareholders/${id}`);
  },

  // Get current user's shareholder info
  getCurrentUser: async (): Promise<{ shareholder: Shareholder }> => {
    return apiClient.get('/api/shareholders/me');
  },
};