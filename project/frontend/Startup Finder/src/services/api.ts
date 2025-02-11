import axios from 'axios';
import { auth } from '../firebase';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  console.log('Generated token:', token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Generated token:', config);
  }
  return config;
});

export const searchMentors = async (query: string) => {
  console.log("request sent")
  const response = await api.post('/search', { query });
  return response.data.matches;
};

export const getAIResponse = async (query: string) => {
  const response = await api.post('/ai-response', { query });
  return response.data.response;
};