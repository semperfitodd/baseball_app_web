import { StatsOverview } from "@/components/stats/StatsOverview";
import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/auth-context";
import { useStats } from "@/hooks/use-stats";
import { getErrorMessage } from "@/utils/error-message";

export function Profile() {
  const { user } = useAuth();
  const { data: stats, isLoading, error } = useStats();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-700">Profile</h1>

      <Card className="flex items-center gap-4">
        {user.picture ? (
          <img src={user.picture} alt="" className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-xl font-bold text-navy-700">
            {user.givenName?.[0] ?? user.name?.[0] ?? "?"}
          </div>
        )}
        <div>
          <p className="text-lg font-bold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </Card>

      {isLoading && <LoadingSpinner message="Loading stats..." />}
      {error && <ErrorMessage message={getErrorMessage(error)} />}
      {stats && <StatsOverview stats={stats} />}
    </div>
  );
}
