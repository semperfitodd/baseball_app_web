import { useCallback, useState } from "react";

import { ExplanationPanel } from "@/components/scenario/ExplanationPanel";
import { OptionButton } from "@/components/scenario/OptionButton";
import { ScenarioCard } from "@/components/scenario/ScenarioCard";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRandomScenario, useSubmitAnswer } from "@/hooks/use-scenarios";
import type { AnswerResult, Scenario } from "@/types";
import { getErrorMessage } from "@/utils/error-message";

type GameState = "answering" | "revealed";

const difficulties = [
  { value: "", label: "All Levels" },
  { value: "rookie", label: "Rookie" },
  { value: "veteran", label: "Veteran" },
  { value: "allstar", label: "All-Star" },
] as const;

const categories = [
  { value: "", label: "All Categories" },
  { value: "batting", label: "Batting" },
  { value: "baserunning", label: "Baserunning" },
  { value: "fielding", label: "Fielding" },
  { value: "pitching", label: "Pitching" },
  { value: "situational", label: "Situational" },
] as const;

export function Play() {
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [excludeIds, setExcludeIds] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("answering");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const {
    data: scenario,
    isLoading,
    error,
    refetch,
  } = useRandomScenario(
    difficulty || undefined,
    category || undefined,
    excludeIds.length > 0 ? excludeIds : undefined,
  );

  const submitAnswer = useSubmitAnswer();

  const handleOptionSelect = useCallback(
    async (optionId: string, currentScenario: Scenario) => {
      if (gameState !== "answering") return;
      setSelectedOptionId(optionId);

      try {
        const response = await submitAnswer.mutateAsync({
          scenarioId: currentScenario.scenarioId,
          selectedOptionId: optionId,
        });
        setResult(response.result);
        setGameState("revealed");
        setExcludeIds((prev) => [...prev, currentScenario.scenarioId]);
      } catch {
        setSelectedOptionId(null);
      }
    },
    [gameState, submitAnswer],
  );

  const handleNext = useCallback(() => {
    setSelectedOptionId(null);
    setResult(null);
    setGameState("answering");
    setFetchKey((k) => k + 1);
    refetch();
  }, [refetch]);

  function getOptionState(
    optionId: string,
    answerResult: AnswerResult | null,
    selected: string | null,
    state: GameState,
  ): "default" | "selected" | "correct" | "incorrect" {
    if (state === "answering") {
      return optionId === selected ? "selected" : "default";
    }
    if (!answerResult) return "default";
    if (optionId === answerResult.correctOptionId) return "correct";
    if (optionId === selected) return "incorrect";
    return "default";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setExcludeIds([]);
            setFetchKey((k) => k + 1);
          }}
          className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy-500 focus:ring-1 focus:ring-navy-500 focus:outline-none"
        >
          {difficulties.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setExcludeIds([]);
            setFetchKey((k) => k + 1);
          }}
          className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy-500 focus:ring-1 focus:ring-navy-500 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingSpinner message="Loading scenario..." />}
      {error && <ErrorMessage message={getErrorMessage(error)} />}
      {submitAnswer.error && <ErrorMessage message={getErrorMessage(submitAnswer.error)} />}

      {scenario && (
        <div key={`${scenario.scenarioId}-${fetchKey}`} className="space-y-4">
          <ScenarioCard scenario={scenario}>
            {scenario.options.map((option) => (
              <OptionButton
                key={option.id}
                label={option.text}
                selected={selectedOptionId === option.id}
                state={getOptionState(option.id, result, selectedOptionId, gameState)}
                disabled={gameState === "revealed" || submitAnswer.isPending}
                onClick={() => handleOptionSelect(option.id, scenario)}
              />
            ))}
          </ScenarioCard>

          {gameState === "revealed" && result && (
            <ExplanationPanel
              correct={result.correct}
              explanation={result.explanation}
              streak={result.streak}
              onNext={handleNext}
            />
          )}
        </div>
      )}
    </div>
  );
}
