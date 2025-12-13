import { ApiClient } from "./client";
import { ReportsResponse } from "../types/api";

const client = new ApiClient();

export const reportsApi = {
  getReports: async (): Promise<ReportsResponse> => {
    return client.get<ReportsResponse>("/api/reports");
  },
};

