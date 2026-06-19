import apiClient from '../../../lib/apiClient';

export interface AdminParticipant {
  participantId: string;
  userId: string;
  username: string;
  email: string;
  score: number;
  cheatingAttempts: number;
  finished: boolean;
  totalTimeTaken: number;
  questionsAccepted: number;
  totalQuestions: number;
}

export const getAdminParticipants = async (competitionId: string): Promise<AdminParticipant[]> => {
  const response = await apiClient.get(`/api/competitions/${competitionId}/admin/participants`);
  return response.data.data;
};
