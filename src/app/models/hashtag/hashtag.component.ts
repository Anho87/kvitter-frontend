import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MiniHashtagDto } from './mini-hashtag-dto.model';
import { AxiosService } from 'src/app/services/axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hashtag',
  standalone: true,
  imports: [],
  templateUrl: './hashtag.component.html',
  styleUrl: './hashtag.component.css'
})
export class HashtagComponent {
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  @Input({required:true}) hashtag!: MiniHashtagDto;
  @Output() clicked = new EventEmitter<void>();


  onHashtagClick() {
    this.router.navigate(['/search'],{ queryParams: { category: 'hashtag', searched: this.hashtag.hashtag } });
    this.clicked.emit();
    }
}
