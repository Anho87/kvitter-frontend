import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/button/button.component';
import { AxiosService } from 'src/app/services/axios.service';
import { Reply } from './reply.model';
import { MiniReplyDto } from './mini-reply-dto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css',
})
export class ReplyComponent {
  @Input({ required: true }) reply!: Reply;
  @Input() showRemoveButton: boolean = false;
  @Input() showFollowButton: boolean = true;
  @Input() showReplyButton: boolean = true;
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  showReplyBarContent: boolean = false;
  replyToSend: string = '';

  navigateToUserInfo() {
    console.log(this.reply.user.userName);
    this.router.navigate([`user-info/${this.reply.user.userName}`]);
  }

  showReplyBar() {
    this.showReplyBarContent = this.showReplyBarContent === true ? false : true;
    this.replyToSend = '';
  }

  removeReply() {
    let data = {
      id: this.reply.id,
    };
    this.axiosService
      .request('DELETE', '/removeReply', data)
      .then((response) => {
        console.log('Reply removed successfully', response);
        this.axiosService.getKvitterList();
      })
      .catch((error) => {
        console.error('Error removing reply', error);
      });
  }

  followUser() {
    this.axiosService.followUser(this.reply.user.email);
  }



  ngOnInit(): void {
    if (this.axiosService.getUsernameFromToken() === this.reply.user.userName) {
      this.showRemoveButton = true;
      this.showFollowButton = false;
      this.showReplyButton = false;
    }
  }

  sendReply() {
    const message: string = this.replyToSend;
    const kvitterId: string | null = this.reply.kvitter?.id ?? null;
    const parentReplyId: string | null = this.reply.id;

    this.axiosService
      .postReply(message, kvitterId, parentReplyId)
      .then(() => {
        this.replyToSend = '';
        this.showReplyBarContent = false;
        this.showReplyBarContent = false;
      })
      .catch((error) => {
        console.error('Failed to send reply:', error);
      });
  }
}
