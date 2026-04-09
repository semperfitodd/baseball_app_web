import { Link } from "react-router-dom";

import { StatsOverview } from "@/components/stats/StatsOverview";
import { StreakDisplay } from "@/components/stats/StreakDisplay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/auth-context";
import { useStats } from "@/hooks/use-stats";
import { getErrorMessage } from "@/utils/error-message";

export function Home() {
  const { user } = useAuth();
  const { data: stats, isLoading, error } = useStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-700">
          Welcome back{user?.givenName ? `, ${user.givenName}` : ""}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">Ready to test your baseball knowledge?</p>
      </div>

      {isLoading && <LoadingSpinner message="Loading stats..." />}
      {error && <ErrorMessage message={getErrorMessage(error)} />}

      {stats && (
        <>
          <StatsOverview stats={stats} />

          <Card className="flex items-center justify-between">
            <StreakDisplay streak={stats.streak} bestStreak={stats.bestStreak} />
            <Link to="/play">
              <Button size="lg">Play Now</Button>
            </Link>
          </Card>
        </>
      )}

      {!stats && !isLoading && !error && (
        <Card className="text-center">
          <p className="mb-4 text-gray-500">No stats yet. Start your first game!</p>
          <Link to="/play">
            <Button size="lg">Start Playing</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
