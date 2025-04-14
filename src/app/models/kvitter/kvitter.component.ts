import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashtagComponent } from "../hashtag/hashtag.component";
import { ButtonComponent } from "../../button/button.component";
import { AxiosService } from '../../services/axios.service';
import { Kvitter } from './kvitter.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReplyComponent } from "../reply/reply.component";

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [CommonModule, HashtagComponent, HashtagComponent, ButtonComponent, FormsModule, ReplyComponent],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css'
})
export class KvitterComponent implements OnInit{
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  @Input({required:true}) kvitter!: Kvitter;
  @Input({required:true}) showPrivateMark!: boolean;
  @Input()showReplies: boolean = true;
  @Output() userClicked = new EventEmitter<string>();
  @Input() class = '';
  @Input() showRemoveButton: boolean = false;
  @Input() showFollowButton: boolean = true;
  @Input() showReplyButton: boolean = true;
  @Input() showRekvittButton: boolean = true;
  @Input() isRetweet: boolean = false;
  showReplyBarContent: boolean = false;
  reply: string = '';
  
 
  showReplyBar(){
    this.showReplyBarContent = this.showReplyBarContent === true ? false : true;
  }
  
  rekvitt(){
    const kvitterId: string = this.kvitter.id;  

    this.axiosService.postRekvitt(kvitterId)
    .then(() => {
      this.reply = ''; 
      this.showReplyBarContent = false;
        this.showReplyBarContent = false;
    })
    .catch((error) => {
        console.error('Failed to send reply:', error);
    });
  }

  sendReply(){
    const message: string = this.reply;
    const kvitterId: string = this.kvitter.id; 
    const parentReplyId: string = '';

    this.axiosService.postReply(message, kvitterId, parentReplyId)
        .then(() => {
          this.reply = ''; 
          this.showReplyBarContent = false;
            this.showReplyBarContent = false;
        })
        .catch((error) => {
            console.error('Failed to send reply:', error);
        });
  }

  navigateToUserInfo(){
    console.log(this.kvitter.user.userName);
    this.router.navigate([`user-info/${this.kvitter.user.userName}`]);
  }

  removeKvitter() {
    let data = {
      id: this.kvitter.id,
    }
    this.axiosService.request('DELETE', '/removeKvitter' ,data)
    .then((response) => {
      console.log('Kvitter removed successfully', response);
      this.axiosService.getKvitterList();
    })
    .catch((error) => {
      console.error('Error removed kvitter', error);
    });
  } 

  followUser(){
    this.axiosService.followUser(this.kvitter.user.email)
  }
  
  ngOnInit(): void {
    if(this.axiosService.getUsernameFromToken() === this.kvitter.user.userName){
      this.showFollowButton = false;
      this.showReplyButton = false;
      this.showRekvittButton = false;
      if (this.isRetweet === false) {
        this.showRemoveButton = true;
      }
    }
    if(this.kvitter.private === true){
      this.showRekvittButton = false;
    }
  }
}
