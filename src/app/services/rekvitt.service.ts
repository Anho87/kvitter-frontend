import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { KvitterService } from './kvitter.service';

@Injectable({
  providedIn: 'root'
})
export class RekvittService {
    private http = inject(HttpClient);
    private filterService = inject(FilterService);
    private titleService = inject(Title);
    private router = inject(Router);
    private kvitterService = inject(KvitterService);

  async postRekvitt(kvitterId: string): Promise<void> {
    const data = { kvitterId };
  
    try {
      const response = await lastValueFrom(
        this.http.post('/postRekvitt', data)
      );
      console.log('Successfully posted rekvitt', response);
  
      const currentUrl = this.router.url;
  
      if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      } else {
        this.kvitterService.getKvitterList();
      }
    } catch (error) {
      console.error('Error posting rekvitt', error);
    }
  }

  async removeRekvitt(id: string){
    const data = { rekvittId: id };

    this.http.request('DELETE', '/removeRekvitt', { body: data }).subscribe({
      next: (response) => {
        console.log('Rekvitt removed successfully', response);
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
        console.error('Error removing Rekvitt', err);
      }
    });
  }
}
