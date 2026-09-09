/**
 * @file apiClient.js
 * @description Cliente HTTP centralizado para comunicación con Pilgrim API Gateway.
 */
import { PILGRIM_CONFIG, PILGRIM_API_URL } from '../config/pilgrim.config';

export const API_BASE_URL = PILGRIM_API_URL;

class ApiClient {
  constructor(baseURL = PILGRIM_API_URL) {
    this.baseURL = baseURL;
  }

  getHeaders(customHeaders = {}) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...PILGRIM_CONFIG.headers,
      ...customHeaders
    };
    if (token && token !== 'undefined' && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMessage = 'Error en la petición al servidor';
      if (data) {
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map(err => {
              const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : '';
              return field ? `${field}: ${err.msg}` : err.msg;
            })
            .join(', ');
        } else if (data.detail && typeof data.detail === 'object') {
          errorMessage = data.detail.message || JSON.stringify(data.detail);
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }

      throw {
        status: response.status,
        message: errorMessage,
        data
      };
    }
    return data;
  }

  async get(endpoint, params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${cleanEndpoint}${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async post(endpoint, data = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async put(endpoint, data = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async patch(endpoint, data = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async upload(endpoint, file) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default ApiClient;
