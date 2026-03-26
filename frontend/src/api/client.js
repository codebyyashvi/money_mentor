// API Client with token management
import API_BASE_URL, { API_CONFIG } from './config';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Make HTTP requests with token
  async request(endpoint, method = 'GET', body = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists (except for login/register endpoints)
    if (this.token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      ...options,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/';
      }

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const error = new Error(data?.detail || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  get(endpoint, options) {
    return this.request(endpoint, 'GET', null, options);
  }

  // POST request
  post(endpoint, body, options) {
    return this.request(endpoint, 'POST', body, options);
  }

  // PUT request
  put(endpoint, body, options) {
    return this.request(endpoint, 'PUT', body, options);
  }

  // DELETE request
  delete(endpoint, options) {
    return this.request(endpoint, 'DELETE', null, options);
  }
}

export const apiClient = new APIClient();
export default apiClient;
