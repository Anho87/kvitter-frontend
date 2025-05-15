import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-right-side-bar',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.css',
})
export class RightSideBarComponent implements OnInit {
  private authService = inject(AuthService);
  private location = inject(Location);

  @Output() loggingOut = new EventEmitter();

  isSmallScreen = false;
  showLogoutButton: boolean = true;
  showBackButton: boolean = true;

  onLogout(): void {
    this.authService.logout();
  }

  back(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    const windowWidth = window.innerWidth;
    this.isSmallScreen = windowWidth <= 1000;
    this.showLogoutButton = !this.isSmallScreen;
    this.showBackButton = !this.isSmallScreen;
  }
}
