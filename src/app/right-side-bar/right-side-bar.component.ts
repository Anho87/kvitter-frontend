import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { AxiosService } from '../services/axios.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-side-bar',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.css',
})
export class RightSideBarComponent implements OnInit {
  private axiosService = inject(AxiosService);
  private location = inject(Location);
  private router = inject(Router);
  @Output() loggingOut = new EventEmitter();
  isSmallScreen = false;
  showLogoutButton: boolean = true;
  showBackButton: boolean = true;

  onLogout(): void {
    this.axiosService.logout();
  }

  back() {
    this.location.back();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    const windowWidth = window.innerWidth;
    this.isSmallScreen = windowWidth <= 1000;
    if (this.isSmallScreen) {
      this.showLogoutButton = false;
      this.showBackButton = false;
    } else {
      this.showLogoutButton = true;
      this.showBackButton = true;
    }
  }
}
