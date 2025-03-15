import { Component, inject, OnInit } from '@angular/core';
import { AxiosService } from '../axios.service';
import { CommonModule } from '@angular/common';
import { Kvitter } from '../kvitter/kvitter.model';
import { KvitterComponent } from "../kvitter/kvitter.component";

@Component({
  selector: 'app-kvitter-list',
  standalone: true,
  imports: [CommonModule, KvitterComponent],
  templateUrl: './kvitter-list.component.html',
  styleUrl: './kvitter-list.component.css'
})
export class KvitterListComponent implements OnInit{
  kvitters: Kvitter[] = [];
  private axiosService = inject(AxiosService);

ngOnInit(): void {
   this.axiosService
    .request('GET', '/index')
    .then((response) => (this.kvitters = response.data));
}
}
