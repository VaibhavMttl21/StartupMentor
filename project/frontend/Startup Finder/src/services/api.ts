import axios from 'axios';
import { auth } from '../firebase';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchMentors = async (query: string) => {
  const response = await api.post('/search', { query });
  return response.data;
};

export const getAIResponse = async (query: string) => {
  const response = await api.post('/ai-response', { query });
  return response.data.response;
};