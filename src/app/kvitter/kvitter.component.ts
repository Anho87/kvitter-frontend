import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniHashtagDto } from '../hashtag/mini-hashtag-dto.model';
import { HashtagComponent } from "../hashtag/hashtag.component";

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [CommonModule, HashtagComponent,HashtagComponent],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css'
})
export class KvitterComponent{
  @Input() username = '';
  @Input() message = '';
  @Input() hashtags: MiniHashtagDto[] = [];
  @Input() createdDateAndTime = '';
}
