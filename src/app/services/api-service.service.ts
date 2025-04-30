import { computed, inject, Injectable, signal } from '@angular/core';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { jwtDecode } from 'jwt-decode';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Rekvitt } from '../models/rekvitt/rekvitt.model';
import { Reply } from '../models/reply/reply.model';
import { MiniUserDto } from '../models/user/mini-user-dto.model';
import { MiniHashtagDto } from '../models/hashtag/mini-hashtag-dto.model';
import { FilterService } from './filter-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, switchMap } from 'rxjs';

type DetailedDto = Kvitter | Rekvitt;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  private accessToken: string | null = null;
  kvitterList = signal<DetailedDto[]>([]);
  tenPublicKvitterList = signal<Kvitter[]>([]);
  trendingHashtags = signal<MiniHashtagDto[]>([]);
  authorized = signal<boolean>(false);
  selectedOption = computed(() => this.filterService.selectedOption());
 

  welcomePageKvitter(mode?: string): void {
    this.http.get<Kvitter[]>('welcomePageKvitterList').subscribe({
      next: (data) => {
        this.tenPublicKvitterList.set(data);
      },
      error: (err) => {
        console.error('Error fetching welcome page kvitters:', err);
      }
    });
  }
  

  followUser(user?: MiniUserDto): void {
    const data = { userEmail: user?.email };
  
    this.http.post('followUser', data).subscribe({
      next: (response) => {
        console.log('Successfully following user', response);
  
        const currentUrl = this.router.url;
  
        if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.getKvitterList();
        }
      },
      error: (err) => {
        console.error('Error following user:', err);
      }
    });
  }
  

  unFollowUser(user?: MiniUserDto): void {
    const data = { userEmail: user?.email };
  
    this.http.request('DELETE', 'unFollowUser', { body: data }).subscribe({
      next: (response) => {
        console.log('Successfully unfollowed user', response);
  
        const currentUrl = this.router.url;
  
        if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.getKvitterList();
        }
      },
      error: (err) => {
        console.error('Error unfollowing user:', err);
      }
    });
  }
  

  async postReply(
    message: string,
    kvitterId: string | null = null,
    parentReplyId: string | null = null
  ): Promise<void> {
    const data = { message, kvitterId, parentReplyId };
  
    try {
      const response = await lastValueFrom(
        this.http.post('postReply', data)
      );
      console.log('Successfully posted reply', response);
  
      const currentUrl = this.router.url;
  
      if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      } else {
        this.getKvitterList();
      }
    } catch (error) {
      console.error('Error posting reply', error);
    }
  }
  

  async upvoteKvitter(kvitterId: string, upvote: boolean): Promise<void> {
    const data = { kvitterId };
  
    if (upvote) {
      try {
        const response = await lastValueFrom(
          this.http.post('upvoteKvitter', data)
        );
        console.log('Upvote on kvitter successful', response);
      } catch (error) {
        console.log('Error upvoting kvitter', error);
      }
    } else {
      try {
        const response = await lastValueFrom(
          this.http.request('DELETE', 'removeUpvoteOnKvitter', { body: data })
        );
        console.log('Removed upvote on kvitter successful', response);
      } catch (error) {
        console.log('Error removing upvote on kvitter', error);
      }
    }
  }
  

  async postRekvitt(kvitterId: string): Promise<void> {
    const data = { kvitterId };
  
    try {
      const response = await lastValueFrom(
        this.http.post('postRekvitt', data)
      );
      console.log('Successfully posted rekvitt', response);
  
      const currentUrl = this.router.url;
  
      if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      } else {
        this.getKvitterList();
      }
    } catch (error) {
      console.error('Error posting rekvitt', error);
    }
  }
  

  getSearchResults(category: string, searched: string): void {
    const queryParams = category && searched ? `?category=${category}&searched=${searched}` : '';
  
    this.http.get<DetailedDto[]>(`search${queryParams}`).subscribe({
      next: (data) => {
        this.kvitterList.set(data);
        console.log(this.kvitterList());
      },
      error: (err) => {
        console.error('Error fetching search results:', err);
      },
    });
  }
  

  getKvitterList(option?: string, userName?: string): void {
    const filterOption = option ?? this.filterService.selectedOption();
    const filterOptionNoSpaces = filterOption.replace(/\s+/g, '');
  
    const queryParams = `?filterOption=${filterOptionNoSpaces}${userName ? `&userName=${userName}` : ''}`;
  
    this.http.get<any[]>(`kvitterList${queryParams}`).subscribe({
      next: (data) => {
        const detailedList: DetailedDto[] = data.map((item) => {
          if ('message' in item) {
            return {
              id: item.id,
              message: item.message,
              user: item.user,
              createdDateAndTime: item.createdDateAndTime,
              hashtags: item.hashtags,
              isPrivate: item.isPrivate,
              isActive: item.isActive,
              likes: item.likes,
              replies: item.replies.map((reply: any) => this.mapReply(reply)),
              rekvitts: item.rekvitts,
              isFollowing: item.isFollowing,
              isLiked: item.isLiked,
            } as Kvitter;
          } else {
            return {
              id: item.id,
              user: item.user,
              originalKvitter: item.originalKvitter,
              createdDateAndTime: item.createdDateAndTime,
            } as Rekvitt;
          }
        });
  
        this.kvitterList.set(detailedList);
        console.log(this.kvitterList());
      },
      error: (err) => {
        console.error('Error fetching kvitters:', err);
      },
    });
  }
  

  async logout(): Promise<void> {
    try {
      await lastValueFrom(
        this.http.post('logout', {}, { withCredentials: true })
      );
      this.logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async autoLogin(): Promise<boolean> {
    console.log('autologin triggered');
    try {
      const response = await lastValueFrom(
        this.http.post<{ accessToken: string }>('refresh-token', {})
      );
      this.authorized.set(true);
      this.setAccessToken(response.accessToken);
      return true;
    } catch (error) {
      console.warn('Auto-login failed:', error);
      this.logoutUser();
      return false;
    }
  }

  fetchTrendingHashtags(): void {
    this.http.get<MiniHashtagDto[]>('trendingHashtags').subscribe({
      next: (data) => {
        this.trendingHashtags.set(data);
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching trending hashtags:', err);
      }
    });
  }
  

  refreshAccessToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(
      'refresh-token',
      {},
      { withCredentials: true }
    ).pipe(
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

  logoutUser(): void {
    console.warn('User logged out');
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

  updateKvitterUpvoteStatus(id: string, isLiked: Boolean) {
    const updatedList = this.kvitterList().map(dto => {
      if (this.isKvitter(dto) && dto.id === id) {
        return { ...dto, isLiked };
      }
  
      if (this.isRekvitt(dto) && dto.originalKvitter.id === id) {
        return {
          ...dto,
          originalKvitter: {
            ...dto.originalKvitter,
            isLiked,
          },
        };
      }
  
      return dto;
    });
  
    this.kvitterList.set(updatedList);
  }

  private mapReply(reply: any): Reply {
    return {
      id: reply.id,
      message: reply.message,
      createdDateAndTime: reply.createdDateAndTime,
      user: reply.user,
      kvitter: reply.kvitter,
      parentReply: reply.parentReply,
      replies: reply.replies ? reply.replies.map((r: any) => this.mapReply(r)) : [],
      isFollowing: reply.isFollowing,
      isActive: reply.isActive
    };
  }

  isKvitter(dto: DetailedDto): dto is Kvitter {
    return 'message' in dto;
  }

  isRekvitt(dto: DetailedDto): dto is Rekvitt {
    return 'originalKvitter' in dto;
  }
}
