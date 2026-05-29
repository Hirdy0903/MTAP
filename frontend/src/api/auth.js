import apiClient from './client';

export const loginApi = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const signupApi = async (name, email, password) => {
  const response = await apiClient.post('/auth/signup', { name, email, password });
  return response.data;
};

export const getMeApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
