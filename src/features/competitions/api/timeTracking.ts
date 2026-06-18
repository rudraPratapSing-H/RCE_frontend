import apiClient from '../../../lib/apiClient';

export const startProblemTimer = async (competitionId: string, problemId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/competitions/${competitionId}/problems/${problemId}/time/start`);
  } catch (error) {
    console.error('Failed to start problem timer:', error);
  }
};

export const pauseProblemTimer = async (competitionId: string, problemId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/competitions/${competitionId}/problems/${problemId}/time/pause`);
  } catch (error) {
    console.error('Failed to pause problem timer:', error);
  }
};
