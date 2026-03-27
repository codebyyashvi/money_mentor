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
    const isFormData = body instanceof FormData;
    
    const headers = {
      ...options.headers,
    };

    // Let browser set multipart boundary automatically for FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

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
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/';
      }

      // Parse response with JSON-first, text fallback.
      let data = null;
      let textData = null;
      try {
        data = await response.json();
      } catch {
        try {
          textData = await response.text();
        } catch {
          textData = null;
        }
      }

      if (!response.ok) {
        let detail = data?.detail;
        if (Array.isArray(detail)) {
          detail = detail
            .map((item) => item?.msg || JSON.stringify(item))
            .join('; ');
        } else if (detail && typeof detail === 'object') {
          detail = JSON.stringify(detail);
        }

        const fallbackMessage =
          detail ||
          data?.message ||
          data?.error ||
          textData ||
          response.statusText ||
          `HTTP ${response.status}`;

        const error = new Error(fallbackMessage);
        error.status = response.status;
        error.data = data || textData;
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
