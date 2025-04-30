import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject, computed } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { HashtagComponent } from '../models/hashtag/hashtag.component';
import { MiniHashtagDto } from '../models/hashtag/mini-hashtag-dto.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, HashtagComponent],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.css',
})
export class LeftSideBarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  hashtags = computed<MiniHashtagDto[]>(() => this.authService.trendingHashtags());

  isSidebarVisible = true;
  isSmallScreen = false;

  onCancel(): void {
    this.isSidebarVisible = false;
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.authService.fetchTrendingHashtags();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 1000;
    this.isSidebarVisible = !this.isSmallScreen;
  }

  hashTagClicked(): void {
    this.isSidebarVisible = false;
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onHome(): void {
    const userName = this.authService.getUsernameFromToken();
    this.router.navigate([`user/${userName}`]);
    this.isSidebarVisible = false;
  }

  onSearch(): void {
    this.router.navigate(['/search']);
    this.isSidebarVisible = false;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
