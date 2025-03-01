import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { KvitterService } from './kvitter.service';
import { Kvitter } from './kvitter.model';
import { AxiosService } from '../axios.service';

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css'
})
export class KvitterComponent implements OnInit{
 private destroyRef = inject(DestroyRef);
  private latestKvitterService = inject(KvitterService);
  // kvitters = signal<Kvitter[]>([]);
  kvitters: Kvitter[] = [];
  private axiosService = inject(AxiosService);

ngOnInit(): void {
   this.axiosService
    .request('GET', '/index')
    .then((response) => (this.kvitters = response.data));
}

  // ngOnInit() {
  //   const subscription = this.latestKvitterService.loadAllKvitters().subscribe({
  //     next: (kvitter) => {
  //       this.kvitters.set(kvitter);
  //     },
  //   });
  //   this.destroyRef.onDestroy(() => {
  //     subscription.unsubscribe();
  //   });
  // }
}
