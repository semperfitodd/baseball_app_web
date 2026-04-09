import { Card } from "@/components/ui/Card";
import type { UserStats } from "@/types";

interface StatsOverviewProps {
  stats: UserStats;
}

const statItems = [
  { key: "totalAnswered", label: "Total Answered", format: (v: number) => String(v) },
  { key: "accuracy", label: "Accuracy", format: (v: number) => `${Math.round(v)}%` },
  { key: "streak", label: "Current Streak", format: (v: number) => String(v) },
  { key: "bestStreak", label: "Best Streak", format: (v: number) => String(v) },
] as const;

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.key} className="text-center">
          <p className="text-2xl font-bold text-navy-700">
            {item.format(stats[item.key])}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
