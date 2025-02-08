import { Component, DestroyRef, inject, signal } from '@angular/core';
import { LatestKvitterService } from './latest-kvitter.service';
import { Kvitter } from '../kvitter/kvitter.model';

@Component({
  selector: 'app-latest-kvitter',
  standalone: true,
  imports: [],
  templateUrl: './latest-kvitter.component.html',
  styleUrl: './latest-kvitter.component.css'
})
export class LatestKvitterComponent {
 private destroyRef = inject(DestroyRef);
  private latestKvitterService = inject(LatestKvitterService);
  kvitters = signal<Kvitter[]>([]);

  ngOnInit() {
    const subscription = this.latestKvitterService.loadAllKvitters().subscribe({
      next: (kvitter) => {
        this.kvitters.set(kvitter);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
