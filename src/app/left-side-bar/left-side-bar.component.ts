import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { AxiosService } from '../services/axios.service';
import { HashtagComponent } from '../models/hashtag/hashtag.component';
import { MiniHashtagDto } from '../models/hashtag/mini-hashtag-dto.model';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, HashtagComponent],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.css',
})
export class LeftSideBarComponent implements OnInit{
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  hashtags = computed<MiniHashtagDto[]>(() => this.axiosService.trendingHashtags());

  isSidebarVisible = true;
  isSmallScreen = false;

  onCancel() {
    this.isSidebarVisible = false;
  }

  ngOnInit() {
    this.checkScreenSize();
    this.axiosService.fetchTrendingHashtags();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 1000;
    if (this.isSmallScreen) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onHome() {
    let userName = this.axiosService.getUsernameFromToken();
    this.router.navigate([`user/${userName}`]);
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onSearch(){
    this.router.navigate([`search`]);
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onLogout() {
    this.axiosService.logout();
  }
}
