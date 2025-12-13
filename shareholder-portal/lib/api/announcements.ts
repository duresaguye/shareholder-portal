import { apiClient } from "./client";

export type Announcement = {
  id: number;
  title: string;
  content: string;
  author: string;
  role: string;
  date: string;
  timeAgo: string;
  priority: "high" | "medium" | "low";
  category: string;
};

export const announcementsApi = {
  getAll: async (): Promise<Announcement[]> => {
    return apiClient.get("/api/announcements");
  },

  getById: async (id: string | number): Promise<Announcement> => {
    return apiClient.get(`/api/announcements/${id}`);
  },

  create: async (payload: Omit<Announcement, "id" | "date" | "timeAgo">): Promise<Announcement> => {
    return apiClient.post("/api/announcements", payload);
  },
};

