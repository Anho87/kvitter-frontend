import { Component, computed, inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  private snackbar = inject(SnackbarService);
  message = computed(() => this.snackbar.message());
}
