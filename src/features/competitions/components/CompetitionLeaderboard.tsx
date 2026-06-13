import React, { useEffect, useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import { getCompetitionLeaderboard, LeaderboardEntry } from '../api/getCompetitionLeaderboard';

interface CompetitionLeaderboardProps {
  competitionId: string;
}

export const CompetitionLeaderboard: React.FC<CompetitionLeaderboardProps> = ({ competitionId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getCompetitionLeaderboard(competitionId);
        setLeaderboard(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    // Poll every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [competitionId]);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-zinc-400">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-400">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Live Leaderboard</h1>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-gray-900 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-300">
            <tr>
              <th scope="col" className="px-6 py-4">Rank</th>
              <th scope="col" className="px-6 py-4">Participant</th>
              <th scope="col" className="px-6 py-4">Score</th>
              <th scope="col" className="px-6 py-4">Latest Submission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">No submissions yet!</td>
              </tr>
            ) : (
              leaderboard.map((entry, index) => (
                <tr key={entry.userId} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-100">
                    {entry.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-400">
                    {entry.totalScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 opacity-70" />
                      {new Date(entry.latestSubmissionTime).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
