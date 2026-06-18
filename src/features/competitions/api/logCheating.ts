import apiClient from '../../../lib/apiClient';

export const logCheatingAttempt = async (competitionId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/competitions/${competitionId}/cheat`);
  } catch (error) {
    console.error('Failed to log cheating attempt:', error);
    // We don't necessarily want to throw and crash the UI for this, 
    // just fail silently in the background
  }
};
