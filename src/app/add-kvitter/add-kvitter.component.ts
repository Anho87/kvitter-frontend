import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterService } from '../services/filter-service.service';
import { ApiService } from '../services/api-service.service';

@Component({
  selector: 'app-add-kvitter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-kvitter.component.html',
  styleUrl: './add-kvitter.component.css',
})
export class AddKvitterComponent {
  private apiService = inject(ApiService);
  private filterService = inject(FilterService);

  selectedOption = computed(() => this.filterService.selectedOption());

  @Output() close = new EventEmitter<void>();

  message: string = '';
  hashtags: string = '';
  hashtaglist: string[] = [];
  private: Boolean = false;

  onCancel(): void {
    this.close.emit();
  }

  kvitt(): void {
    this.splitHashtags();

    const data = {
      message: this.message,
      hashtags: this.hashtaglist,
      isPrivate: this.private,
    };

    this.apiService.http.post('postKvitter', data).subscribe({
      next: (response) => {
        console.log('Kvitter posted successfully', response);
        this.close.emit();
        this.apiService.getKvitterList(this.selectedOption());
      },
      error: (err) => {
        console.error('Error posting kvitter', err);
      },
    });

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
