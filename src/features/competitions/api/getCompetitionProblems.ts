import apiClient from '../../../lib/apiClient';

export interface CompetitionProblemBasic {
  id: string;
  title: string;
  score: number;
}

export interface CompetitionDetails {
  description?: string;
  startTime: string;
  endTime: string;
  problems: CompetitionProblemBasic[];
}

export const getCompetitionProblems = async (competitionId: string): Promise<CompetitionDetails> => {
  const response = await apiClient.get<{ success: boolean; data: CompetitionDetails }>(
    `/api/competitions/${competitionId}/problems/titles`
  );
  return response.data.data;
};
