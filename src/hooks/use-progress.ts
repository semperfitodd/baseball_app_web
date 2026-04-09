import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/api";
import { queryKeys } from "@/hooks/queries";
import type { ApiResponse, UserProgress } from "@/types";

interface ProgressApiResponse extends ApiResponse {
  progress: UserProgress[];
  nextCursor: string | null;
}

export function useProgress(limit = 20, cursor?: string) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);

  return useQuery({
    queryKey: [...queryKeys.progress, limit, cursor],
    queryFn: () => api.get<ProgressApiResponse>(`/api/progress?${params}`),
    select: (data) => ({
      items: data.progress,
      nextCursor: data.nextCursor,
    }),
  });
}
