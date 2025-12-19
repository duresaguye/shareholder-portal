import { apiClient } from './client';

export interface SystemSettings {
  id: string;
  authorizedShares: number;
  updatedAt: string;
  updatedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  } | null;
  totalDistributedShares?: number;
  availableShares?: number;
}

export interface SystemSettingsResponse {
  settings: SystemSettings;
}

export interface UpdateSystemSettingsRequest {
  authorizedShares: number;
}

export interface UpdateSystemSettingsResponse {
  message: string;
  settings: SystemSettings;
}

export const systemSettingsApi = {
  // Get system settings
  getSystemSettings: async (): Promise<SystemSettingsResponse> => {
    return apiClient.get<SystemSettingsResponse>('/api/system-settings');
  },

  // Update system settings (admin only)
  updateSystemSettings: async (
    data: UpdateSystemSettingsRequest
  ): Promise<UpdateSystemSettingsResponse> => {
    return apiClient.put<UpdateSystemSettingsResponse>('/api/system-settings', data);
  },
};

