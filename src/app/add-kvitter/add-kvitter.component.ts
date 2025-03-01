import { Component, inject, Output } from '@angular/core';
import { AxiosService } from '../axios.service';
import { Hashtag } from '../hashtag/hashtag.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-kvitter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-kvitter.component.html',
  styleUrl: './add-kvitter.component.css',
})
export class AddKvitterComponent {
  private axiosService = inject(AxiosService);
  message: string = '';
  hashtags: Hashtag[] = [];

  kvitt(): void {
    let data = {
      message: this.message,
      hashtags: this.hashtags,
    }
    this.axiosService
    .request('POST', '/postKvitter', data) 
    .then((response) => {
      console.log('Kvitter posted successfully', response);
    })
    .catch((error) => {
      console.error('Error posting kvitter', error);
    });
  }
}
