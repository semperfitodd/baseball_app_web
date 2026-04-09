import type { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3 text-right">Correct</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right">Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {entries.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            const accuracy = entry.totalAnswered > 0
              ? Math.round((entry.totalCorrect / entry.totalAnswered) * 100)
              : 0;

            return (
              <tr
                key={entry.userId}
                className={isCurrentUser ? "bg-navy-50 font-medium" : ""}
              >
                <td className="px-4 py-3 text-sm">
                  {index < 3 ? (
                    <span className="text-lg">{["🥇", "🥈", "🥉"][index]}</span>
                  ) : (
                    <span className="text-gray-500">{index + 1}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {entry.displayName}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-navy-500">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {entry.totalCorrect}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {entry.totalAnswered}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-navy-700">
                  {accuracy}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
