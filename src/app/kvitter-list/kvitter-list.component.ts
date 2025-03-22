import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { CommonModule } from '@angular/common';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { KvitterComponent } from '../models/kvitter/kvitter.component';

@Component({
  selector: 'app-kvitter-list',
  standalone: true,
  imports: [CommonModule, KvitterComponent],
  templateUrl: './kvitter-list.component.html',
  styleUrl: './kvitter-list.component.css',
})
export class KvitterListComponent implements OnInit {
  @Input()userName: string = "";
  private axiosService = inject(AxiosService);
  kvitters = computed<Kvitter[]>(() => this.axiosService.kvitterList());

  ngOnInit(): void {
    this.axiosService.getKvitterList(this.userName);
  }
}
