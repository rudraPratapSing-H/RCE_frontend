import apiClient from '../../../lib/apiClient';

export interface ParticipantQuestion {
  problemTitle: string;
  status: string;
  score: number;
  timeTaken: number;
  submittedCode: string | null;
  language: string | null;
}

export interface ParticipantDetail {
  userId: string;
  username: string;
  email: string;
  questions: ParticipantQuestion[];
}

export const getParticipantDetails = async (competitionId: string, participantId: string): Promise<ParticipantDetail> => {
  const response = await apiClient.get(`/api/competitions/${competitionId}/admin/participants/${participantId}/details`);
  return response.data.data;
};
