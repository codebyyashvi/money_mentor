// All API endpoints grouped by feature
import apiClient from './client';

export const authAPI = {
  register: (email, password, name) =>
    apiClient.post('/auth/register', { email, password, name }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  getMe: () =>
    apiClient.get('/auth/me'),
};

export const profileAPI = {
  create: (profileData) =>
    apiClient.post('/profile', profileData),
  
  get: () =>
    apiClient.get('/profile'),
  
  update: (profileData) =>
    apiClient.put('/profile', profileData),
};

export const fireAPI = {
  calculate: (fireData) =>
    apiClient.post('/calculate/fire', fireData),
};

export const moneyScoreAPI = {
  calculate: (scoreData) =>
    apiClient.post('/calculate/money-score', scoreData),
  
  getHistory: () =>
    apiClient.get('/money-score/history'),
};

export const taxAPI = {
  calculate: (taxData) =>
    apiClient.post('/calculate/tax', taxData),
};

export const portfolioAPI = {
  xray: (portfolioData) =>
    apiClient.post('/portfolio/xray', portfolioData),
};

export const lifeEventAPI = {
  getAdvice: (eventData) =>
    apiClient.post('/life-event/advice', eventData),
};

export const coupleAPI = {
  optimize: (coupleData) =>
    apiClient.post('/couple-planner/optimize', coupleData),
};

export const healthAPI = {
  check: () =>
    apiClient.get('/health'),
};
