import apiClient from './client';

export const createProjectApi = async (orgId, name, description) => {
  const response = await apiClient.post(`/organizations/${orgId}/projects`, { name, description });
  return response.data;
};

export const getOrganizationProjectsApi = async (orgId) => {
  const response = await apiClient.get(`/organizations/${orgId}/projects`);
  return response.data;
};

export const getSingleProjectApi = async (orgId, projectId) => {
  const response = await apiClient.get(`/organizations/${orgId}/projects/${projectId}`);
  return response.data;
};

export const updateProjectApi = async (orgId, projectId, name, description) => {
  const response = await apiClient.patch(`/organizations/${orgId}/projects/${projectId}`, { name, description });
  return response.data;
};

export const deleteProjectApi = async (orgId, projectId) => {
  const response = await apiClient.delete(`/organizations/${orgId}/projects/${projectId}`);
  return response.data;
};
