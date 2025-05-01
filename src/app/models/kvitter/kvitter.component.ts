import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashtagComponent } from '../hashtag/hashtag.component';
import { ButtonComponent } from '../../button/button.component';
import { Kvitter } from './kvitter.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReplyComponent } from '../reply/reply.component';
import { FilterService } from 'src/app/services/filter.service';
import { AuthService } from 'src/app/services/auth.service';
import { KvitterService } from 'src/app/services/kvitter.service';
import { UserService } from 'src/app/services/user.service';
import { ReplyService } from 'src/app/services/reply.service';
import { RekvittService } from 'src/app/services/rekvitt.service';

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [
    CommonModule,
    HashtagComponent,
    ButtonComponent,
    FormsModule,
    ReplyComponent,
  ],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css',
})
export class KvitterComponent implements OnInit, OnChanges {
  private authService = inject(AuthService);
  private kvitterService = inject(KvitterService);
  private userService = inject(UserService);
  private replyService = inject(ReplyService);
  private rekvittService = inject(RekvittService);
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

  showReplyBar(): void {
    this.showReplyBarContent = !this.showReplyBarContent;
  }

  upvote(): void {
    this.isUpvoted = !this.isUpvoted;
    this.likeCount += this.isUpvoted ? 1 : -1;

    this.kvitterService.upvoteKvitter(this.kvitter.id, this.isUpvoted);
    this.kvitterService.updateKvitterUpvoteStatus(this.kvitter.id, this.isUpvoted);
  }

  rekvitt(): void {
    const kvitterId = this.kvitter.id;
    this.rekvittService.postRekvitt(kvitterId)
      .then(() => {
        this.reply = '';
        this.showReplyBarContent = false;
      })
      .catch((error) => {
        console.error('Failed to rekvitt:', error);
      });
  }

  sendReply(): void {
    const message = this.reply;
    const kvitterId = this.kvitter.id;
    const parentReplyId = '';

    this.replyService.postReply(message, kvitterId, parentReplyId)
      .then(() => {
        this.reply = '';
        this.showReplyBarContent = false;
      })
      .catch((error) => {
        console.error('Failed to send reply:', error);
      });
  }

  navigateToUserInfo(): void {
    this.filterService.selectedOption.set('user-info');
    this.router.navigate([`user-info/${this.kvitter.user.userName}`]);
  }

  removeKvitter(): void {
    this.kvitterService.removeKvitter(this.kvitter.id);
  }

  followUser(): void {
    this.userService.followUser(this.kvitter.user);
  }

  unFollowUser(): void {
    this.userService.unFollowUser(this.kvitter.user);
  }

  ngOnInit(): void {
    this.likeCount = this.kvitter.likes.length;
    this.checkScreenSize();

    const username = this.authService.getUsernameFromToken();

    if (username === this.kvitter.user.userName) {
      this.showFollowButton = false;
      this.showUnFollowButton = false;
      this.showReplyButton = false;
      this.showRekvittButton = false;
      this.showUpvoteButton = false;
      if (!this.isRetweet) {
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
  checkScreenSize(): void {
    this.showHashtags = window.innerWidth >= 400;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.authService.getUsernameFromToken() !== this.kvitter.user.userName
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
