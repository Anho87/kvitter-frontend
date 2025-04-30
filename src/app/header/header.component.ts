import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  navigateToStart(): void {
    const userName = this.apiService.getUsernameFromToken();
    this.router.navigate([`user/${userName}`]);
  }
}
