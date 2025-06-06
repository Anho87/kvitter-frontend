import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/button/button.component';
import { Reply } from './reply.model';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';
import { AuthService } from 'src/app/services/auth.service';
import { ReplyService } from 'src/app/services/reply.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css',
})
export class ReplyComponent implements OnInit, OnChanges {
  private authService = inject(AuthService);
  private filterService = inject(FilterService);
  private userService = inject(UserService);
  private replyService = inject(ReplyService);
  private router = inject(Router);

  @Input({ required: true }) reply!: Reply;
  @Input() showRemoveButton: boolean = false;
  @Input() showFollowButton: boolean = true;
  @Input() showUnFollowButton: boolean = true;
  @Input() showReplyButton: boolean = true;
  @Input() showButtonBar: boolean = true;
  @Input() class = '';

  showReplyBarContent: boolean = false;
  replyToSend: string = '';

  navigateToUserInfo(): void {
    this.filterService.selectedOption.set('user-info');
    this.router.navigate([`user-info/${this.reply.user.userName}`]);
  }

  showReplyBar(): void {
    this.showReplyBarContent = !this.showReplyBarContent;
    this.replyToSend = '';
  }

  removeReply(): void {
    this.replyService.removeReply(this.reply.id);
  }

  followUser(): void {
    this.userService.followUser(this.reply.user);
  }

  unFollowUser(): void {
    this.userService.unFollowUser(this.reply.user);
  }

  ngOnInit(): void {
    const username = this.authService.getUsernameFromToken();
    if (username === this.reply.user.userName) {
      this.showRemoveButton = true;
      this.showFollowButton = false;
      this.showUnFollowButton = false;
      this.showReplyButton = false;
    }
    if (!this.reply.isActive) {
      this.showButtonBar = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const username = this.authService.getUsernameFromToken();
    if (username === this.reply.user.userName) {
      this.showRemoveButton = true;
      this.showFollowButton = false;
      this.showUnFollowButton = false;
      this.showReplyButton = false;
    } else {
      if (this.reply.isFollowing) {
        this.showUnFollowButton = true;
        this.showFollowButton = false;
      } else {
        this.showUnFollowButton = false;
        this.showFollowButton = true;
      }
    }
  }

  sendReply(): void {
    const message = this.replyToSend;
    const kvitterId = this.reply.kvitter?.id ?? null;
    const parentReplyId = this.reply.id;

    this.replyService.postReply(message, kvitterId, parentReplyId)
      .then(() => {
        this.replyToSend = '';
        this.showReplyBarContent = false;
      })
      .catch((error) => {
        // console.error('Failed to send reply:', error);
      });
  }
}
