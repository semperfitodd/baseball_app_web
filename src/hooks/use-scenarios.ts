import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/config/api";
import { queryKeys } from "@/hooks/queries";
import type { AnswerResult, ApiResponse, Scenario } from "@/types";

interface ScenarioApiResponse extends ApiResponse {
  scenario: Scenario;
}

interface AnswerApiResponse extends ApiResponse {
  result: AnswerResult;
}

export function useRandomScenario(
  difficulty?: string,
  category?: string,
  exclude?: string[],
) {
  const params = new URLSearchParams();
  if (difficulty) params.set("difficulty", difficulty);
  if (category) params.set("category", category);
  if (exclude?.length) params.set("exclude", exclude.join(","));
  const qs = params.toString();

  return useQuery({
    queryKey: [...queryKeys.scenario, difficulty, category, exclude],
    queryFn: () => api.get<ScenarioApiResponse>(`/api/scenarios${qs ? `?${qs}` : ""}`),
    select: (data) => data.scenario,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scenarioId,
      selectedOptionId,
    }: {
      scenarioId: string;
      selectedOptionId: string;
    }) =>
      api.post<AnswerApiResponse>(`/api/scenarios/${scenarioId}/answer`, {
        selectedOptionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
}
