import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MiniUserDto } from '../models/user/mini-user-dto.model';
import { KvitterService } from './kvitter.service';
import { SnackbarService } from './snackbar.service';

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


   followUser(user?: MiniUserDto): void {
      const data = { userEmail: user?.email };
    
      this.http.post<{message: string}>('/followUser', data).subscribe({
        next: (response) => {
          this.snackbar.show(user?.userName + response.message);
    
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
 
}
