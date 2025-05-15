import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { KvitterComponent } from '../models/kvitter/kvitter.component';
import { Rekvitt } from '../models/rekvitt/rekvitt.model';
import { RekvittComponent } from '../models/rekvitt/rekvitt.component';
import { KvitterService } from '../services/kvitter.service';

type DetailedDto = Kvitter | Rekvitt;

@Component({
  selector: 'app-kvitter-list',
  standalone: true,
  imports: [CommonModule, KvitterComponent, RekvittComponent],
  templateUrl: './kvitter-list.component.html',
  styleUrl: './kvitter-list.component.css',
})
export class KvitterListComponent implements OnChanges {
  private kvitterService = inject(KvitterService);
  @Input() userName: string = '';
  @Output() userClicked = new EventEmitter<string>();

  kvitters = computed<DetailedDto[]>(() => this.kvitterService.kvitterList());
  isLoadingKvitters = computed<boolean>(() => this.kvitterService.isLoadingKvitters());

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userName'] && !changes['userName'].firstChange) {
      this.kvitterService.getKvitterList(this.userName);
    }
  }

  isKvitter(dto: DetailedDto): dto is Kvitter {
    return 'message' in dto;
  }

  isRekvitt(dto: DetailedDto): dto is Rekvitt {
    return 'originalKvitter' in dto;
  }
}
