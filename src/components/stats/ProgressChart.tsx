import type { UserProgress } from "@/types";

interface ProgressChartProps {
  history: UserProgress[];
}

export function ProgressChart({ history }: ProgressChartProps) {
  const recent = history.slice(0, 30);

  if (recent.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">
        No answers yet. Start playing!
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {recent.map((item, i) => (
        <div
          key={`${item.scenarioId}-${i}`}
          className={`h-4 w-4 rounded-full transition-colors
            ${item.correct ? "bg-green-400" : "bg-red-400"}`}
          title={`${item.correct ? "Correct" : "Incorrect"} — ${new Date(item.answeredAt).toLocaleDateString()}`}
        />
      ))}
    </div>
  );
}
