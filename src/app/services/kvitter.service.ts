import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { FilterService } from './filter.service';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { Router } from '@angular/router';
import { Rekvitt } from '../models/rekvitt/rekvitt.model';
import { Reply } from '../models/reply/reply.model';
import { SnackbarService } from './snackbar.service';

type DetailedDto = Kvitter | Rekvitt;

@Injectable({
  providedIn: 'root',
})
export class KvitterService {
  private http = inject(HttpClient);
  private filterService = inject(FilterService);
  private router = inject(Router);
  private snackbar = inject(SnackbarService);
  tenPublicKvitterList = signal<Kvitter[]>([]);
  kvitterList = signal<DetailedDto[]>([]);
  selectedOption = computed(() => this.filterService.selectedOption());
  isLoadingKvitters = signal<boolean>(false);

  getKvitterList(option?: string, userName?: string): void {
    this.isLoadingKvitters.set(true);
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
        this.isLoadingKvitters.set(false);
        // console.log(this.kvitterList());
      },
      error: (err) => {
        this.isLoadingKvitters.set(false);
        // console.error('Error fetching kvitters:', err);
      },
    });
  }

  postKvitter(input: any){
    const data = {
      message: input.message,
      hashtags: input.hashtags,
      isPrivate: input.isPrivate,
    };

    this.http.post<{ message: string }>('/postKvitter', data).subscribe({
      next: (response) => {
        this.snackbar.show(response.message);
        this.getKvitterList(this.selectedOption());
      },
      error: (err) => this.snackbar.handleError(err),
    });
  }

  async removeKvitter(id: string){
    const data = { id: id };

    this.http.request<{ message: string }>('DELETE', '/removeKvitter', { body: data }).subscribe({
      next: (response) => {
        this.snackbar.show(response.message);
        const currentUrl = this.router.url;

        if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.getKvitterList();
        }
      },
      error: (err) => this.snackbar.handleError(err),
    });
  }

  async upvoteKvitter(kvitterId: string, upvote: boolean): Promise<void> {
    const data = { kvitterId };

    if (upvote) {
      this.http.post<{message: string}>('/upvoteKvitter', data).subscribe({
        next: (response) => {
          this.snackbar.show(response.message)
        },
        error: (err) => this.snackbar.handleError(err),
      })
    } else {
      this.http.request<{message: string}>('DELETE', '/removeUpvoteOnKvitter', { body: data }).subscribe({
        next: (response) => {
          this.snackbar.show(response.message);
        },
        error: (err) => this.snackbar.handleError(err),
      })
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
    this.isLoadingKvitters.set(true);
    const queryParams = category && searched ? `?category=${category}&searched=${searched}` : '';

    this.http.get<DetailedDto[]>(`/search${queryParams}`).subscribe({
      next: (data) => {
        this.kvitterList.set(data);
         this.isLoadingKvitters.set(false);
        // console.log(this.kvitterList());
      },
      error: (err) => {
        this.isLoadingKvitters.set(false);
        // console.error('Error fetching search results:', err);
      },
    });
  }

  welcomePageKvitter(mode?: string): void {
    this.isLoadingKvitters.set(true);
    this.http.get<Kvitter[]>('/welcomePageKvitterList').subscribe({
      next: (data) => {
        this.tenPublicKvitterList.set(data);
        this.isLoadingKvitters.set(false);
      },
      error: (err) => {
        this.isLoadingKvitters.set(false);
        // console.error('Error fetching welcome page kvitters:', err);
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
