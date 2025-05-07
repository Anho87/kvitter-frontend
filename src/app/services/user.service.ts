import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MiniUserDto } from '../models/user/mini-user-dto.model';
import { KvitterService } from './kvitter.service';
import { SnackbarService } from './snackbar.service';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  private kvitterService = inject(KvitterService);
  private snackbar = inject(SnackbarService);

  user = signal<User | null>(null);
  userFollowingList = signal<MiniUserDto[]>([]);

   followUser(user?: MiniUserDto): void {
      const data = { userEmail: user?.email };
    
      this.http.post<{message: string}>('/followUser', data).subscribe({
        next: (response) => {
          this.snackbar.show(user?.userName + response.message);
          if (user) {
            this.userFollowingList.update((currentList: MiniUserDto[]) => {
              return [...currentList, user];
            });
          }
          const currentUrl = this.router.url;
    
          if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(currentUrl);
            });
          } else {
            this.kvitterService.getKvitterList();
          }
        },
        error: (err) => this.snackbar.handleError(err),
      });
    }

    unFollowUser(user?: MiniUserDto): void {
      const data = { userEmail: user?.email };
    
      this.http.request<{message: string}>('DELETE', '/unFollowUser', { body: data }).subscribe({
        next: (response) => {
          this.snackbar.show(user?.userName + response.message);
          if (user) {
            this.userFollowingList.update((currentList: MiniUserDto[]) => {
              return currentList.filter((currentUser) => currentUser.email !== user.email);
            });
          }
          const currentUrl = this.router.url;
    
          if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(currentUrl);
            });
          } else {
            this.kvitterService.getKvitterList();
          }
        },
        error: (err) => this.snackbar.handleError(err),
      });
    }

    fetchFollowing(){
      this.http.get<MiniUserDto[]>('/getUserFollowing').subscribe({
        next: (data) => {
          this.userFollowingList.set(data);
          // console.log(this.userFollowingList());
        },
        error: (err) => {
          // console.log('Error fetching user following list', err);
        },
      });
    }

    getUserInfo(userName: string){
      const queryParams = userName ? `?userName=${userName}` : '';

      this.http.get<User>(`/getUserInfo${queryParams}`).subscribe({
        next: (data) => {
          this.user.set(data);
        },
        error: (err) => {
          // console.log('Error fetching user:', err);
        }
      });
    }
}
