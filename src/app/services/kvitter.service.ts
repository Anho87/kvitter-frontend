import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { FilterService } from './filter.service';
import { Title } from '@angular/platform-browser';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { Router } from '@angular/router';
import { Rekvitt } from '../models/rekvitt/rekvitt.model';
import { Reply } from '../models/reply/reply.model';
import { lastValueFrom } from 'rxjs';

type DetailedDto = Kvitter | Rekvitt;

@Injectable({
  providedIn: 'root',
})
export class KvitterService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private titleService = inject(Title);
  private router = inject(Router);
  tenPublicKvitterList = signal<Kvitter[]>([]);
  kvitterList = signal<DetailedDto[]>([]);
  selectedOption = computed(() => this.filterService.selectedOption());

  getKvitterList(option?: string, userName?: string): void {
    const filterOption = option ?? this.filterService.selectedOption();
    const filterOptionNoSpaces = filterOption.replace(/\s+/g, '');

    const queryParams = `?filterOption=${filterOptionNoSpaces}${
      userName ? `&userName=${userName}` : ''
    }`;

    this.http.get<any[]>(`/kvitterList${queryParams}`).subscribe({
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

  postKvitter(input: any){
    const data = {
      message: input.message,
      hashtags: input.hashtags,
      isPrivate: input.isPrivate,
    };

    this.http.post('/postKvitter', data).subscribe({
      next: (response) => {
        console.log('Kvitter posted successfully', response);
        this.getKvitterList(this.selectedOption());
      },
      error: (err) => {
        console.error('Error posting kvitter', err);
      },
    });
  }

  async removeKvitter(id: string){
    const data = { id: id };

    this.http.request('DELETE', '/removeKvitter', { body: data }).subscribe({
      next: (response) => {
        console.log('Kvitter removed successfully', response);
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
        console.error('Error removing kvitter', err);
      }
    });
  }

  async upvoteKvitter(kvitterId: string, upvote: boolean): Promise<void> {
    const data = { kvitterId };

    if (upvote) {
      try {
        const response = await lastValueFrom(
          this.http.post('/upvoteKvitter', data)
        );
        console.log('Upvote on kvitter successful', response);
      } catch (error) {
        console.log('Error upvoting kvitter', error);
      }
    } else {
      try {
        const response = await lastValueFrom(
          this.http.request('DELETE', '/removeUpvoteOnKvitter', { body: data })
        );
        console.log('Removed upvote on kvitter successful', response);
      } catch (error) {
        console.log('Error removing upvote on kvitter', error);
      }
    }
  }

  updateKvitterUpvoteStatus(id: string, isLiked: Boolean) {
    const updatedList = this.kvitterList().map((dto) => {
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

  getSearchResults(category: string, searched: string): void {
    const queryParams = category && searched ? `?category=${category}&searched=${searched}` : '';

    this.http.get<DetailedDto[]>(`/search${queryParams}`).subscribe({
      next: (data) => {
        this.kvitterList.set(data);
        console.log(this.kvitterList());
      },
      error: (err) => {
        console.error('Error fetching search results:', err);
      },
    });
  }

  welcomePageKvitter(mode?: string): void {
    this.http.get<Kvitter[]>('/welcomePageKvitterList').subscribe({
      next: (data) => {
        this.tenPublicKvitterList.set(data);
      },
      error: (err) => {
        console.error('Error fetching welcome page kvitters:', err);
      },
    });
  }

  isKvitter(dto: DetailedDto): dto is Kvitter {
    return 'message' in dto;
  }

  isRekvitt(dto: DetailedDto): dto is Rekvitt {
    return 'originalKvitter' in dto;
  }

  private mapReply(reply: any): Reply {
    return {
      id: reply.id,
      message: reply.message,
      createdDateAndTime: reply.createdDateAndTime,
      user: reply.user,
      kvitter: reply.kvitter,
      parentReply: reply.parentReply,
      replies: reply.replies
        ? reply.replies.map((r: any) => this.mapReply(r))
        : [],
      isFollowing: reply.isFollowing,
      isActive: reply.isActive,
    };
  }

  
}
