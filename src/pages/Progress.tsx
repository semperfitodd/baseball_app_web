import { useState } from "react";

import { ProgressChart } from "@/components/stats/ProgressChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useProgress } from "@/hooks/use-progress";
import { getErrorMessage } from "@/utils/error-message";

export function Progress() {
  const [cursor, setCursor] = useState<string | undefined>();
  const { data, isLoading, error } = useProgress(20, cursor);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-700">Your Progress</h1>

      {isLoading && <LoadingSpinner message="Loading history..." />}
      {error && <ErrorMessage message={getErrorMessage(error)} />}

      {data && data.items.length > 0 && (
        <>
          <Card>
            <h2 className="mb-3 text-sm font-medium text-gray-500">Recent Answers</h2>
            <ProgressChart history={data.items} />
          </Card>

          <div className="space-y-3">
            {data.items.map((item, i) => (
              <Card key={`${item.scenarioId}-${i}`} className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.scenarioId}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.answeredAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${item.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {item.correct ? "Correct" : "Incorrect"}
                </span>
              </Card>
            ))}
          </div>

          {data.nextCursor && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setCursor(data.nextCursor ?? undefined)}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {data && data.items.length === 0 && (
        <Card className="text-center">
          <p className="text-gray-500">No answers yet. Start playing to see your progress!</p>
        </Card>
      )}
    </div>
  );
}
