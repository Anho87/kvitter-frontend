import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { KvitterService } from './kvitter.service';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  private kvitterService = inject(KvitterService);


  async postReply(
      message: string,
      kvitterId: string | null = null,
      parentReplyId: string | null = null
    ): Promise<void> {
      const data = { message, kvitterId, parentReplyId };
    
      try {
        const response = await lastValueFrom(
          this.http.post('/postReply', data)
        );
        console.log('Successfully posted reply', response);
    
        const currentUrl = this.router.url;
    
        if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.kvitterService.getKvitterList();
        }
      } catch (error) {
        console.error('Error posting reply', error);
      }
    }

    async removeReply(id: string){
      const data = { id: id };

      this.http.request('DELETE', '/removeReply', { body: data }).subscribe({
        next: (response) => {
          console.log('Reply removed successfully', response);
          const currentUrl = this.router.url;
  
          if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(currentUrl);
            });
          } else {
            this.kvitterService.getKvitterList();
          }
        },
        error: (err) => {
          console.error('Error removing reply', err);
        }
      });
    }
}
