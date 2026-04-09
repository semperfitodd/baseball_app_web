interface StreakDisplayProps {
  streak: number;
  bestStreak: number;
}

export function StreakDisplay({ streak, bestStreak }: StreakDisplayProps) {
  const active = streak > 0;

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold
        ${active ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}
      >
        <span className={`text-lg ${active ? "animate-pulse" : ""}`}>
          {active ? "🔥" : "💤"}
        </span>
        <span>{streak}</span>
      </div>
      <span className="text-xs text-gray-400">Best: {bestStreak}</span>
    </div>
  );
}
