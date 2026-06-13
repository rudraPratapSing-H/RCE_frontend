import apiClient from '../../../lib/apiClient';

export interface LeaderboardEntry {
  username: string;
  userId: string;
  totalScore: number;
  latestSubmissionTime: string;
}

export const getCompetitionLeaderboard = async (competitionId: string): Promise<LeaderboardEntry[]> => {
  const response = await apiClient.get<{ success: boolean; data: LeaderboardEntry[] }>(
    `/api/competitions/${competitionId}/leaderboard`
  );
  return response.data.data;
};
