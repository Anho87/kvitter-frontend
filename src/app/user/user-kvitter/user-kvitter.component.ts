import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserKvitterService } from './user-kvitter.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-kvitter',
  standalone: true,
  imports: [],
  templateUrl: './user-kvitter.component.html',
  styleUrl: './user-kvitter.component.css',
})
export class UserKvitterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private userKvitterService = inject(UserKvitterService);
  email: 'mario.bros@nintendo.com' = "mario.bros@nintendo.com";
  user: User | undefined;

  ngOnInit() {
    const subscription = this.userKvitterService
      .loadUserWithEmail(this.email)
      .subscribe({
        next: (recievedUser) => {
          this.user = recievedUser;
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
