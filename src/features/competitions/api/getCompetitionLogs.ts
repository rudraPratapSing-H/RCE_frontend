import apiClient from '../../../lib/apiClient';

export interface CompetitionLogItem {
  problemId: string;
  title: string;
  status: string;
  score: number;
  maxScore: number;
}

export const getCompetitionLogs = async (competitionId: string): Promise<CompetitionLogItem[]> => {
  const response = await apiClient.get<{ success: boolean; data: CompetitionLogItem[] }>(
    `/api/competitions/${competitionId}/logs`
  );
  return response.data.data;
};
