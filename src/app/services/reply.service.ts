import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KvitterService } from './kvitter.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private kvitterService = inject(KvitterService);
  private snackbarService = inject(SnackbarService);


  async postReply(
      message: string,
      kvitterId: string | null = null,
      parentReplyId: string | null = null
    ): Promise<void> {
      const data = { message, kvitterId, parentReplyId };


      this.http.post<{message: string}>('/postReply', data).subscribe({
        next: (response) => {
          this.snackbarService.show(response.message);
          const currentUrl = this.router.url;

        if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.kvitterService.getKvitterList();
        }
        },
        error: (err) => this.snackbarService.handleError(err),
      });
    }

    async removeReply(id: string){
      const data = { id: id };

      this.http.request<{message: string}>('DELETE', '/removeReply', { body: data }).subscribe({
        next: (response) => {
          this.snackbarService.show(response.message);
          const currentUrl = this.router.url;

          if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(currentUrl);
            });
          } else {
            this.kvitterService.getKvitterList();
          }
        },
        error: (err) => this.snackbarService.handleError(err),
      });
    }
}
