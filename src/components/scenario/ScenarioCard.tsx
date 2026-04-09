import type { ReactNode } from "react";

import { CategoryBadge } from "@/components/scenario/CategoryBadge";
import { DifficultyBadge } from "@/components/scenario/DifficultyBadge";
import { Card } from "@/components/ui/Card";
import type { Scenario } from "@/types";

interface ScenarioCardProps {
  scenario: Scenario;
  children: ReactNode;
}

export function ScenarioCard({ scenario, children }: ScenarioCardProps) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={scenario.difficulty} />
        <CategoryBadge category={scenario.category} />
      </div>

      <h2 className="mb-2 text-lg font-bold text-navy-700">{scenario.title}</h2>

      <div className="mb-4 rounded-lg bg-gray-50 p-4">
        <p className="mb-2 text-sm text-gray-700">{scenario.situation}</p>
        <p className="text-sm font-medium text-navy-600">
          {scenario.playerName} — {scenario.playerPosition}
        </p>
      </div>

      <div className="space-y-3">{children}</div>
    </Card>
  );
}
