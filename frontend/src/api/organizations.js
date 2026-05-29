import apiClient from './client';

export const createOrganizationApi = async (name, slug) => {
  const response = await apiClient.post('/organizations', { name, slug });
  return response.data;
};

export const inviteMemberApi = async (orgId, email) => {
  const response = await apiClient.post(`/organizations/${orgId}/members`, { email });
  return response.data;
};

export const getUserOrganizationsApi = async () => {
  const response = await apiClient.get('/organizations');
  return response.data;
};
