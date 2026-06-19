import apiClient from '../../../lib/apiClient';

export const checkAdminAccess = async (): Promise<{ isAdmin: boolean }> => {
  const response = await apiClient.get('/api/competitions/admin/check');
  return response.data;
};
