import axios from 'axios';
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


type DetailedDto = Kvitter | Rekvitt;

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  private accessToken: string | null = null;
  kvitterList = signal<DetailedDto[]>([]);
  tenPublicKvitterList = signal<Kvitter[]>([]);
  trendingHashtags = signal<MiniHashtagDto[]>([]);
  authorized = signal<boolean>(false);
   selectedOption = computed(() => this.filterService.selectedOption())

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

  followUser(user?: MiniUserDto): void {
    this.request('POST', '/followUser', {
      userEmail: user?.email,
    })
      .then((response) => {
        console.log('Succesfully following user', response);
        if (this.router.url.includes('/user-info')) {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        }else if(this.router.url.includes('/search')){
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else{
          this.getKvitterList();
        }
      })
      .catch((error) => {
        console.error('Error following user:', error);
      });
  }

  unFollowUser(user?: MiniUserDto): void {
    this.request('DELETE', '/unFollowUser', {
      userEmail: user?.email,
    })
      .then((response) => {
        console.log('Succesfully unfollowed user', response);
        if (this.router.url.includes('/user-info')) {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        }else if(this.router.url.includes('/search')){
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else{
          this.getKvitterList();
        }
      })
      .catch((error) => {
        console.error('Error unfollowing user:', error);
      });
  }


  async postReply( message: string, kvitterId: string | null = null, parentReplyId: string | null = null): Promise<void> {
    const data = {
      message: message,
      kvitterId: kvitterId,
      parentReplyId: parentReplyId,
    };
    try {
      const response = await this.request('POST', 'postReply', data);
      console.log('Successfully posted reply', response);
      if (this.router.url.includes('/user-info')) {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      }else if(this.router.url.includes('/search')){
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      }  else {
        this.getKvitterList();
      }
    } catch (error) {
      console.error('Error posting reply', error);
    }
  }

  async upvoteKvitter(kvitterId: string, upvote: boolean): Promise<void>{
    const data = {
      kvitterId: kvitterId,
    };
    if (upvote) {
      try {
        const response = await this.request('POST', 'upvoteKvitter', data);
        console.log('Upvote on kvitter succesfull', response);
      } catch (error) {
        console.log('Error upvoting kvitter', error);
      }
    }else{
      try {
        const response_1 = await this.request('DELETE', 'removeUpvoteOnKvitter', data);
        console.log('Removed upvote on kvitter succesfull', response_1);
      } catch (error_1) {
        console.log('Error removing upvote on kvitter', error_1);
      }
    }
  }

  

  async postRekvitt(kvitterId: string): Promise<void> {
    const data = {
      kvitterId: kvitterId,
    };
    try {
      const response = await this.request('POST', 'postRekvitt', data);
      console.log('Successfully posted rekvitt', response);
      if (this.router.url.includes('/user-info')) {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl(currentUrl);
        });
      } else if(this.router.url.includes('/search')){
        const currentUrl = this.router.url;
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

  fetchTrendingHashtags() {
    this.request('GET', '/trendingHashtags')
      .then((response) => {
        this.trendingHashtags.set(response.data); 
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching trending hashtags:', error);
      });
  }

  getSearchResults(category: string, searched: string){
    const queryParams = category && searched ? `?category=${category}&searched=${searched}` : '';
    this.request('GET', `/search${queryParams}`)
      .then((response) => {
        this.kvitterList.set(response.data);
        console.log(this.kvitterList());
      });
  }

  getKvitterList(option?: string, userName?: string): void {
    let filterOption;
    if (option != null) {
      filterOption = option;
    }else{
      filterOption = this.filterService.selectedOption();
    }
    const filterOptionNoSpaces = filterOption.replace(/\s+/g, '');

    const queryParams = `?filterOption=${filterOptionNoSpaces}${userName ? `&userName=${userName}` : ''}`;
   
    this.request('GET', `/kvitterList${queryParams}`)
    .then((response) => {
      const detailedList: DetailedDto[] = response.data.map((item: any) => {
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
            isLiked: item.isLiked
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
    this.authorized.set(false);
    this.router.navigate(['/welcome']);
    this.titleService.setTitle(`Kvitter`);
  }

  async autoLogin(): Promise<boolean> {
    console.log('autologin triggerd');
    try {
      const response = await axios.post('/refresh-token');
      const { accessToken } = response.data;
      this.authorized.set(true);
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
      this.authorized.set(true);
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

  isKvitter(dto: DetailedDto): dto is Kvitter {
    return 'message' in dto;
  }

  isRekvitt(dto: DetailedDto): dto is Rekvitt {
    return 'originalKvitter' in dto;
  }
}