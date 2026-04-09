import { LeaderboardTable } from "@/components/stats/LeaderboardTable";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/auth-context";
import { useLeaderboard } from "@/hooks/use-stats";
import { getErrorMessage } from "@/utils/error-message";

export function Leaderboard() {
  const { user } = useAuth();
  const { data: entries, isLoading, error } = useLeaderboard();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-700">Leaderboard</h1>

      {isLoading && <LoadingSpinner message="Loading leaderboard..." />}
      {error && <ErrorMessage message={getErrorMessage(error)} />}

      {entries && entries.length > 0 && (
        <LeaderboardTable entries={entries} currentUserId={user?.sub} />
      )}

      {entries && entries.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          No leaderboard data yet. Be the first to play!
        </p>
      )}
    </div>
  );
}
