import { Component, inject, Output } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-kvitter',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './add-kvitter.component.html',
  styleUrl: './add-kvitter.component.css',
})
export class AddKvitterComponent {
  private axiosService = inject(AxiosService);
  message: string = '';
  hashtags: string = '';
  hashtaglist: string[] = [];
  private: boolean = false;

  kvitt(): void {
    this.splitHashtags();
    let data = {
      message: this.message,
      hashtags: this.hashtaglist,
      private: this.private,
    }
    this.axiosService
    .request('POST', '/postKvitter', data) 
    .then((response) => {
      console.log('Kvitter posted successfully', response);
      this.axiosService.getKvitterList();
    })
    .catch((error) => {
      console.error('Error posting kvitter', error);
    });
    this.message = '';
    this.hashtags = '';
    this.private = false;
  }

  splitHashtags(): void {
    this.hashtaglist = this.hashtags.split(/\s+/).map(hashtag => hashtag.trim()).filter(hashtag => hashtag.length > 0);
  }
}


