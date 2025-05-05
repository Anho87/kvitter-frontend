import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterService } from '../services/filter.service';
import { AuthService } from '../services/auth.service';
import { KvitterService } from '../services/kvitter.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-add-kvitter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-kvitter.component.html',
  styleUrl: './add-kvitter.component.css',
})
export class AddKvitterComponent {
  private authService = inject(AuthService);
  private kvitterService = inject(KvitterService);
  private filterService = inject(FilterService);
  private snackbar= inject(SnackbarService);

  selectedOption = computed(() => this.filterService.selectedOption());

  @Output() close = new EventEmitter<void>();

  message: string = '';
  hashtags: string = '';
  hashtaglist: string[] = [];
  private: Boolean = false;

  onCancel(): void {
    this.close.emit();
  }

  kvitt(form: NgForm): void {
    if (form.invalid) {
      this.snackbar.show('Message can\'t be empty.');
      return;
    }
    this.splitHashtags();

    const data = {
      message: this.message,
      hashtags: this.hashtaglist,
      isPrivate: this.private,
    };
   
    this.kvitterService.postKvitter(data);

    this.close.emit();
    this.message = '';
    this.hashtags = '';
    this.private = false;
  }

  splitHashtags(): void {
    this.hashtaglist = this.hashtags
      .split(/\s+/)
      .map((hashtag) => hashtag.trim())
      .filter((hashtag) => hashtag.length > 0);
  }
}
