import { Component, inject, Input } from '@angular/core';
import { Rekvitt } from './rekvitt.model';
import { Router } from '@angular/router';
import { HashtagComponent } from '../hashtag/hashtag.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rekvitt',
  standalone: true,
  imports: [HashtagComponent, CommonModule],
  templateUrl: './rekvitt.component.html',
  styleUrl: './rekvitt.component.css',
})
export class RekvittComponent {
  @Input({ required: true }) rekvitt!: Rekvitt;
  private router = inject(Router);

  navigateToUserInfo(username: string) {
    // console.log(this.rekvitt.user.userName);
    // this.router.navigate([`user-info/${this.rekvitt.user.userName}`]);
    console.log(username);
    this.router.navigate([`user-info/${username}`]);
  }
}
