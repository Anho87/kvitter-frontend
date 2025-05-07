import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MiniHashtagDto } from '../models/hashtag/mini-hashtag-dto.model';

@Injectable({
  providedIn: 'root'
})
export class HashtagService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  trendingHashtags = signal<MiniHashtagDto[]>([]);

  fetchTrendingHashtags(): void {
    this.http.get<MiniHashtagDto[]>('/trendingHashtags').subscribe({
      next: (data) => {
        this.trendingHashtags.set(data);
        // console.log(data);
      },
      error: (err) => {
        // console.error('Error fetching trending hashtags:', err);
      },
    });
  }



}
