import { Component, inject, Input } from '@angular/core';
import { Rekvitt } from './rekvitt.model';
import { Router } from '@angular/router';
import { HashtagComponent } from '../hashtag/hashtag.component';
import { CommonModule } from '@angular/common';
import { KvitterComponent } from "../kvitter/kvitter.component";

@Component({
  selector: 'app-rekvitt',
  standalone: true,
  imports: [HashtagComponent, CommonModule, KvitterComponent],
  templateUrl: './rekvitt.component.html',
  styleUrl: './rekvitt.component.css',
})
export class RekvittComponent {
  @Input({ required: true }) rekvitt!: Rekvitt;
  private router = inject(Router);


  navigateToUserInfo(username: string) {
    console.log(username);
    this.router.navigate([`user-info/${username}`]);
  }
}
