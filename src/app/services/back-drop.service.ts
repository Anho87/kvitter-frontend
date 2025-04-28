import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackDropService {
  backDropIsActive = signal<boolean>(false);
  constructor() { 

  }
}
