import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/api";
import { queryKeys } from "@/hooks/queries";
import type { ApiResponse, LeaderboardEntry, UserStats } from "@/types";

interface StatsApiResponse extends ApiResponse {
  stats: UserStats;
}

interface LeaderboardApiResponse extends ApiResponse {
  leaderboard: LeaderboardEntry[];
}

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => api.get<StatsApiResponse>("/api/stats"),
    select: (data) => data.stats,
  });
}

export function useLeaderboard(limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.leaderboard, limit],
    queryFn: () =>
      api.get<LeaderboardApiResponse>(`/api/leaderboard?limit=${limit}`),
    select: (data) => data.leaderboard,
  });
}
