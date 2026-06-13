import apiClient from '../../../lib/apiClient';

export interface CompetitionBasicInfo {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export const getCompetitions = async (organizationId: string): Promise<CompetitionBasicInfo[]> => {
  const response = await apiClient.get<{ success: boolean; data: CompetitionBasicInfo[] }>(
    `/api/competitions/titles?organizationId=${organizationId}`
  );
  return response.data.data;
};
