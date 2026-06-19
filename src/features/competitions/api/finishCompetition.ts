import apiClient from '../../../lib/apiClient';

export interface FinishCompetitionResponse {
  success: boolean;
  message: string;
}

export const finishCompetition = async (competitionId: string): Promise<FinishCompetitionResponse> => {
  const response = await apiClient.post<FinishCompetitionResponse>(
    `/api/competitions/${competitionId}/finish`
  );
  return response.data;
};
