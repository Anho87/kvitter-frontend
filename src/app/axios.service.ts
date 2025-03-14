import { Injectable } from '@angular/core';
import axios from 'axios';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private accessToken: string | null = null;

  constructor() {
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    axios.defaults.withCredentials = true;

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Access token expired. Attempting to refresh...');
            return this.handleTokenRefresh(error);
          } else if (error.response.status === 403) {
            console.error(
              'Refresh token is invalid or expired. Logging out user.',
              error
            );
            this.logoutUser();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  logoutUser(): void {
    console.warn('User logged out');
    this.clearAccessToken();
  }

  async autoLogin(): Promise<boolean> {
    try {
      const response = await axios.post('/refresh-token');
      const { accessToken } = response.data;
      this.setAccessToken(accessToken);
      return true;
    } catch (error) {
      console.warn('Auto-login failed:', error);
      this.logoutUser();
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await axios.post(
        'logout',
        {},
        { withCredentials: true }
      );
      this.logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async handleTokenRefresh(error: any): Promise<any> {
    try {
      const response = await axios.post(
        '/refresh-token',
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;

      this.setAccessToken(accessToken);

      error.config.headers['Authorization'] = 'Bearer ' + accessToken;
      return axios(error.config);
    } catch (refreshError) {
      console.error(
        'Refresh token is invalid. Logging out user.',
        refreshError
      );
      this.logoutUser();
      return Promise.reject(refreshError);
    }
  }

  request(method: string, url: string, data?: any): Promise<any> {
    let headers = {};
    if (this.getAccessToken() !== null) {
      headers = { Authorization: 'Bearer ' + this.getAccessToken() };
    }

    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
    });
  }
}
