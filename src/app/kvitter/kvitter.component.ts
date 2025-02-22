import { Component, DestroyRef, inject, signal } from '@angular/core';
import { KvitterService } from './kvitter.service';
import { Kvitter } from './kvitter.model';

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css'
})
export class KvitterComponent {
 private destroyRef = inject(DestroyRef);
  private latestKvitterService = inject(KvitterService);
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
