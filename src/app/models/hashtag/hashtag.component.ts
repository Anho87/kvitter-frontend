import { Component, Input } from '@angular/core';
import { MiniHashtagDto } from './mini-hashtag-dto.model';

@Component({
  selector: 'app-hashtag',
  standalone: true,
  imports: [],
  templateUrl: './hashtag.component.html',
  styleUrl: './hashtag.component.css'
})
export class HashtagComponent {
  @Input({required:true}) hashtag!: MiniHashtagDto;
}
