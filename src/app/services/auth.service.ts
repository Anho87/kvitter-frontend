import { computed, inject, Injectable, signal } from '@angular/core';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { jwtDecode } from 'jwt-decode';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Rekvitt } from '../models/rekvitt/rekvitt.model';
import { Reply } from '../models/reply/reply.model';
import { MiniUserDto } from '../models/user/mini-user-dto.model';
import { MiniHashtagDto } from '../models/hashtag/mini-hashtag-dto.model';
import { FilterService } from './filter.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, switchMap } from 'rxjs';

type DetailedDto = Kvitter | Rekvitt;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  private accessToken: string | null = null;
  authorized = signal<boolean>(false);

  async logout(): Promise<void> {
    try {
      await lastValueFrom(
        this.http.post('/logout', {}, { withCredentials: true })
      );
      this.logoutUser();
    } catch (error) {
      // console.error('Error logging out:', error);
    }
  }

  async autoLogin(): Promise<boolean> {
    // console.log('autologin triggered');
    try {
      const response = await lastValueFrom(
        this.http.post<{ accessToken: string }>('/refresh-token', {})
      );
      this.authorized.set(true);
      this.setAccessToken(response.accessToken);
      return true;
    } catch (error) {
      // console.warn('Auto-login failed:', error);
      this.logoutUser();
      return false;
    }
  }

  login(input:any){
    this.http.post<{ accessToken: string }>(
      '/login',
      {
        userName: input.userName,
        password: input.password,
      },
      { withCredentials: true }
    ).subscribe({
      next: (response) => {
        this.setAccessToken(response.accessToken);
        this.authorized.set(true);
        const userName = this.getUsernameFromToken();
        this.titleService.setTitle(`Kvitter - ${userName}`);
        this.router.navigate([`user/${userName}`]);
      },
      error: (err) => {
        // console.error('Login failed:', err);
      }
    });
  }

  register(input: any){
    this.http.post<{ accessToken: string }>(
      '/register',
      {
        email: input.email,
        userName: input.userName,
        password: input.password,
      },
      { withCredentials: true }
    ).subscribe({
      next: (response) => {
        this.setAccessToken(response.accessToken);
        this.authorized.set(true);
        const userName = this.getUsernameFromToken();
        this.titleService.setTitle(`Kvitter - ${userName}`);
        this.router.navigate([`user/${userName}`]);
      },
      error: (err) => {
        // console.error('Registration failed:', err);
      }
    });
  }

  refreshAccessToken(): Observable<string> {
    return this.http
      .post<{ accessToken: string }>(
        '/refresh-token',
        {},
        { withCredentials: true }
      )
      .pipe(
        switchMap((res) => {
          this.setAccessToken(res.accessToken);
          this.authorized.set(true);
          return [res.accessToken];
        })
      );
  }

  getUsernameFromToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      // console.error('No access token found');
      return '';
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.iss || '';
    } catch (error) {
      // console.error('Error decoding token:', error);
      return '';
    }
  }

  logoutUser(): void {
    // console.warn('User logged out');
    this.clearAccessToken();
    this.authorized.set(false);
    this.router.navigate(['/welcome']);
    this.titleService.setTitle(`Kvitter`);
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
}
