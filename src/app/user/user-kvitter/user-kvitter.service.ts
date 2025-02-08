import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UserKvitterService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  loadUserWithEmail(email: string) {
    return this.httpClient.get<User>('http://localhost:8080/user?email=' + email);
  }
}
