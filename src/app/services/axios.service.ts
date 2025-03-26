import { inject, Injectable, signal } from '@angular/core';
import { Kvitter } from '../models/kvitter/kvitter.model';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private router = inject(Router);
  private accessToken: string | null = null;
  kvitterList = signal<Kvitter[]>([]);
  tenPublicKvitterList = signal<Kvitter[]>([]);

  constructor() {
    axios.defaults.baseURL = environment.apiUrl;
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

  welcomePageKvitter(mode?: string): void {
    this.request('GET', '/welcomePageKvitterList').then((response) =>
      this.tenPublicKvitterList.set(response.data)
    );
  }

  followUser(email?: string):void{
    this.request('POST','/followUser',{
      userEmail: email
    }).then((response) => {
      console.log('Succesfully following user',response);
    }).catch((error) => {
      console.error('Error following user:', error);
    });
  }

  postReply(message: string, kvitterId: string | null = null, parentReplyId: string | null = null): Promise<void> {
    const data = {
        message: message,
        kvitterId: kvitterId,
        parentReplyId: parentReplyId,
    };

    return this.request('POST', 'postReply', data)
        .then((response) => {
            console.log('Successfully posted reply', response);
            this.getKvitterList()
        })
        .catch((error) => {
            console.error('Error posting reply', error); 
        });
}

  getKvitterList(userName?: string): void {
    const queryParams = userName ? `?userName=${userName}` : '';

    this.request('GET', `/kvitterList${queryParams}`)
      .then((response) => {
        this.kvitterList.set(response.data);
        console.log(this.kvitterList());
      })
      .catch((error) => {
        console.error('Error fetching kvitters:', error);
      });
}


  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUsernameFromToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      console.error('No access token found');
      return '';
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.iss || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
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
    this.router.navigate(['/welcome']);
  }

  async autoLogin(): Promise<boolean> {
    console.log('autologin triggerd');
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
