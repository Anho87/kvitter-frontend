import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { KvitterService } from './kvitter.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class RekvittService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  private kvitterService = inject(KvitterService);
  private snackbar = inject(SnackbarService);

  async postRekvitt(kvitterId: string): Promise<void> {
    const data = { kvitterId };

    this.http.post<{ message: string }>('/postRekvitt', data).subscribe({
      next: (response) => {
        this.snackbar.show(response.message);

        const currentUrl = this.router.url;

        if (
          currentUrl.includes('/user-info') ||
          currentUrl.includes('/search')
        ) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl(currentUrl);
            });
        } else {
          this.kvitterService.getKvitterList();
        }
      },
      error: (err) => this.snackbar.handleError(err),
    });
  }

  async removeRekvitt(id: string) {
    const data = { rekvittId: id };

    this.http.request<{ message: string }>('DELETE', '/removeRekvitt', { body: data }).subscribe({
      next: (response) => {
        this.snackbar.show(response.message);
        const currentUrl = this.router.url;

        if (
          currentUrl.includes('/user-info') ||
          currentUrl.includes('/search')
        ) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
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
