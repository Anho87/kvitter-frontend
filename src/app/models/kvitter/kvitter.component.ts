import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashtagComponent } from '../hashtag/hashtag.component';
import { ButtonComponent } from '../../button/button.component';
import { AxiosService } from '../../services/axios.service';
import { Kvitter } from './kvitter.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReplyComponent } from '../reply/reply.component';
import { FilterService } from 'src/app/services/filter-service.service';

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [
    CommonModule,
    HashtagComponent,
    HashtagComponent,
    ButtonComponent,
    FormsModule,
    ReplyComponent,
  ],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css',
})
export class KvitterComponent implements OnInit, OnChanges {
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  private filterService = inject(FilterService);
  @Output() userClicked = new EventEmitter<string>();
  @Input({ required: true }) kvitter!: Kvitter;
  @Input({ required: true }) showPrivateMark!: boolean;
  @Input() showReplies: boolean = true;
  @Input() showRemoveButton: boolean = false;
  @Input() showFollowButton: boolean = true;
  @Input() showUnFollowButton: boolean = true;
  @Input() showReplyButton: boolean = true;
  @Input() showRekvittButton: boolean = true;
  @Input() isRetweet: boolean = false;
  @Input() showUpvoteButton: boolean = true;
  @Input() class = '';
  @Input() showButtonBar: boolean = true;
  @Input() showHashtags: boolean = false;
  showReplyBarContent: boolean = false;
  reply: string = '';
  isUpvoted = false;
  likeCount: number = 0;

  showReplyBar() {
    this.showReplyBarContent = this.showReplyBarContent === true ? false : true;
  }

  upvote() {
    if (this.isUpvoted) {
      this.likeCount--;
    }else{
      this.likeCount++;
    }
    this.isUpvoted = !this.isUpvoted;
    this.axiosService.upvoteKvitter(this.kvitter.id, this.isUpvoted);
    this.axiosService.updateKvitterUpvoteStatus(
      this.kvitter.id,
      this.isUpvoted
    );
  }

  rekvitt() {
    const kvitterId: string = this.kvitter.id;
    this.axiosService
      .postRekvitt(kvitterId)
      .then(() => {
        this.reply = '';
        this.showReplyBarContent = false;
        this.showReplyBarContent = false;
      })
      .catch((error) => {
        console.error('Failed to send reply:', error);
      });
  }

  sendReply() {
    const message: string = this.reply;
    const kvitterId: string = this.kvitter.id;
    const parentReplyId: string = '';

    this.axiosService
      .postReply(message, kvitterId, parentReplyId)
      .then(() => {
        this.reply = '';
        this.showReplyBarContent = false;
        this.showReplyBarContent = false;
      })
      .catch((error) => {
        console.error('Failed to send reply:', error);
      });
  }

  navigateToUserInfo() {
    this.filterService.selectedOption.set('user-info');
    this.router.navigate([`user-info/${this.kvitter.user.userName}`]);
  }

  removeKvitter() {
    let data = {
      id: this.kvitter.id,
    };
    this.axiosService
      .request('DELETE', '/removeKvitter', data)
      .then((response) => {
        console.log('Kvitter removed successfully', response);
        if (this.router.url.includes('/user-info')) {
          const currentUrl = this.router.url;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl(currentUrl);
            });
        } else if(this.router.url.includes('/search')){
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.axiosService.getKvitterList();
        }
      })
      .catch((error) => {
        console.error('Error removing kvitter', error);
      });
  }

  followUser() {
    this.axiosService.followUser(this.kvitter.user);
  }

  unFollowUser() {
    this.axiosService.unFollowUser(this.kvitter.user);
  }

  ngOnInit(): void {
    this.likeCount = this.kvitter.likes.length;
    this.checkScreenSize();
    if (
      this.axiosService.getUsernameFromToken() === this.kvitter.user.userName
    ) {
      this.showFollowButton = false;
      this.showUnFollowButton = false;
      this.showReplyButton = false;
      this.showRekvittButton = false;
      this.showUpvoteButton = false;
      if (this.isRetweet === false) {
        this.showRemoveButton = true;
      }
    }
    if (this.kvitter.isPrivate) {
      this.showRekvittButton = false;
    }
    if (!this.kvitter.isActive) {
      this.showButtonBar = false;
      this.showUpvoteButton = false;
    }
  
  }

    @HostListener('window:resize')
    checkScreenSize() {
      this.showHashtags = window.innerWidth >= 400;
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.axiosService.getUsernameFromToken() !== this.kvitter.user.userName
    ) {
      if (this.kvitter.isFollowing) {
        this.showUnFollowButton = true;
        this.showFollowButton = false;
      } else {
        this.showUnFollowButton = false;
        this.showFollowButton = true;
      }
      if (this.kvitter.isLiked) {
        this.isUpvoted = true;
      } else {
        this.isUpvoted = false;
      }
    }
  }
}
