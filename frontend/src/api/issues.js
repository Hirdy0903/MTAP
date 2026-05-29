import apiClient from './client';

export const createIssueApi = async (orgId, projectId, data) => {
  const response = await apiClient.post(`/organizations/${orgId}/projects/${projectId}/issues`, data);
  return response.data;
};

export const getProjectIssuesApi = async (orgId, projectId) => {
  const response = await apiClient.get(`/organizations/${orgId}/projects/${projectId}/issues`);
  return response.data;
};

export const updateIssueApi = async (orgId, projectId, issueId, data) => {
  const response = await apiClient.patch(`/organizations/${orgId}/projects/${projectId}/issues/${issueId}`, data);
  return response.data;
};

export const deleteIssueApi = async (orgId, projectId, issueId) => {
  const response = await apiClient.delete(`/organizations/${orgId}/projects/${projectId}/issues/${issueId}`);
  return response.data;
};
