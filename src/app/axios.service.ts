import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  constructor() {
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Access token expired. Attempting to refresh...');
            return this.handleTokenRefresh(error);
          } else if (error.response.status === 403) {
            console.error('Refresh token is invalid or expired. Logging out user.', error);
            this.logoutUser();
            return Promise.reject(error); 
          }
        }
        return Promise.reject(error);
      }
    );
  }

  

  getAuthToken(): string | null {
    return window.localStorage.getItem('auth_token');
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
  }

  getRefreshToken(): string | null {
    return window.localStorage.getItem('refresh_token');
  }

  setRefreshToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem('refresh_token', token);
    } else {
      window.localStorage.removeItem('refresh_token');
    }
  }

  logoutUser(): void {
    console.warn("Refresh token is invalid or expired. Logging out user.");
    this.setAuthToken(null);
    this.setRefreshToken(null);
    window.location.href = "/login"; 
  }

  async handleTokenRefresh(error: any): Promise<any> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.error('No refresh token found. User must log in again.');
        this.logoutUser();
        return Promise.reject(error);
      }

      const response = await axios.post('/refresh-token', { refreshToken });
      const { accessToken } = response.data;

      this.setAuthToken(accessToken);

      error.config.headers['Authorization'] = 'Bearer ' + accessToken;
      return axios(error.config);
    } catch (refreshError) {
      console.error('Refresh token is invalid. Logging out user.', refreshError);
      this.logoutUser();
      return Promise.reject(refreshError);
    }
  }

  request(method: string, url: string, data?: any): Promise<any> {
    let headers = {};
    if (this.getAuthToken() !== null) {
      headers = { Authorization: 'Bearer ' + this.getAuthToken() };
    }

    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
    });
  }
}
