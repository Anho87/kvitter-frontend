import { Component, computed, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { CommonModule } from '@angular/common';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { KvitterComponent } from '../models/kvitter/kvitter.component';
import { Rekvitt } from '../models/rekvitt/rekvitt.model';
import { RekvittComponent } from '../models/rekvitt/rekvitt.component';

type DetailedDto = Kvitter | Rekvitt;
@Component({
  selector: 'app-kvitter-list',
  standalone: true,
  imports: [CommonModule, KvitterComponent,RekvittComponent],
  templateUrl: './kvitter-list.component.html',
  styleUrl: './kvitter-list.component.css',
})
export class KvitterListComponent implements OnInit, OnChanges {
  @Input()userName: string = "";
  @Output() userClicked = new EventEmitter<string>();
  private axiosService = inject(AxiosService);
  kvitters = computed<DetailedDto[]>(() => this.axiosService.kvitterList());

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userName'] && !changes['userName'].firstChange) {
      this.axiosService.getKvitterList(this.userName);
    }
  }
  ngOnInit(): void {
    this.axiosService.getKvitterList(this.userName);
  }

  isKvitter(dto: DetailedDto): dto is Kvitter {
    return 'message' in dto;
  }

  isRekvitt(dto: DetailedDto): dto is Rekvitt {
    return 'originalKvitter' in dto;
  }
}


