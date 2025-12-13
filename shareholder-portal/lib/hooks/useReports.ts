import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api/reports";

export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
};

export const useReports = () => {
  return useQuery({
    queryKey: reportKeys.lists(),
    queryFn: () => reportsApi.getReports(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

