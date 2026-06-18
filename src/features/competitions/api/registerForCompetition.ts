import apiClient from '../../../lib/apiClient';

export interface RegisterCompetitionResponse {
  success: boolean;
  message: string;
  participant: any;
  fullScreenMandatory: boolean;
  startTime: string;
  endTime: string;
}

export const registerForCompetition = async (competitionId: string): Promise<RegisterCompetitionResponse> => {
  const response = await apiClient.post<RegisterCompetitionResponse>(
    `/api/competitions/${competitionId}/register`
  );
  return response.data;
};
