import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterService } from '../services/filter-service.service';

@Component({
  selector: 'app-add-kvitter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-kvitter.component.html',
  styleUrl: './add-kvitter.component.css',
})
export class AddKvitterComponent {
  private axiosService = inject(AxiosService);
  private filterService = inject(FilterService);
  selectedOption = computed(() => this.filterService.selectedOption());
  @Output() close = new EventEmitter<void>();
  message: string = '';
  hashtags: string = '';
  hashtaglist: string[] = [];
  private: Boolean = false;

  onCancel() {
    this.close.emit();
  }

  kvitt(): void {
    this.splitHashtags();
    console.log(this.private);
    let data = {
      message: this.message,
      hashtags: this.hashtaglist,
      isPrivate: this.private,
    };
    this.axiosService
      .request('POST', '/postKvitter', data)
      .then((response) => {
        console.log('Kvitter posted successfully', response);
        this.close.emit();
        this.axiosService.getKvitterList(this.selectedOption());
      })
      .catch((error) => {
        console.error('Error posting kvitter', error);
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
