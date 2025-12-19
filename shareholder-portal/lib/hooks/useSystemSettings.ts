import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { systemSettingsApi, UpdateSystemSettingsRequest } from "../api/systemSettings";

export const systemSettingsKeys = {
  all: ["systemSettings"] as const,
  current: () => [...systemSettingsKeys.all, "current"] as const,
};

export const useSystemSettings = () => {
  return useQuery({
    queryKey: systemSettingsKeys.current(),
    queryFn: () => systemSettingsApi.getSystemSettings(),
    staleTime: 30 * 1000, // 30 seconds (since distributed shares can change frequently)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // Refetch every 30 seconds to update distributed/available shares when new shares are issued
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSystemSettingsRequest) =>
      systemSettingsApi.updateSystemSettings(data),
    onSuccess: () => {
      // Invalidate and refetch system settings
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.current() });
    },
  });
};

