import { Component, inject, Input, OnInit } from '@angular/core';
import { Rekvitt } from './rekvitt.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KvitterComponent } from '../kvitter/kvitter.component';
import { ButtonComponent } from '../../button/button.component';
import { FilterService } from 'src/app/services/filter.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rekvitt',
  standalone: true,
  imports: [CommonModule, KvitterComponent, ButtonComponent],
  templateUrl: './rekvitt.component.html',
  styleUrl: './rekvitt.component.css',
})
export class RekvittComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private filterService = inject(FilterService);

  @Input({ required: true }) rekvitt!: Rekvitt;
  @Input() showRemoveButton: boolean = false;
  @Input() class = '';

  isUpvoted = false;

  removeRekvitt(): void {
    const data = { rekvittId: this.rekvitt.id };

    this.authService.http.request('DELETE', 'removeRekvitt', { body: data }).subscribe({
      next: (response) => {
        console.log('Rekvitt removed successfully', response);
        const currentUrl = this.router.url;

        if (currentUrl.includes('/user-info') || currentUrl.includes('/search')) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
        } else {
          this.authService.getKvitterList();
        }
      },
      error: (err) => {
        console.error('Error removing Rekvitt', err);
      }
    });
  }

  navigateToUserInfo(username: string): void {
    this.filterService.selectedOption.set('user-info');
    this.router.navigate([`user-info/${username}`]);
  }

  ngOnInit(): void {
    const username = this.authService.getUsernameFromToken();
    if (username === this.rekvitt.user.userName) {
      this.showRemoveButton = true;
    }
  }
}
