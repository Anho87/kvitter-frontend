import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hashtag',
  standalone: true,
  imports: [],
  templateUrl: './hashtag.component.html',
  styleUrl: './hashtag.component.css'
})
export class HashtagComponent {
@Input() hashtag = '';
}
