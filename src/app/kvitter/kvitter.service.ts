import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Kvitter } from '../kvitter/kvitter.model';

@Injectable({
  providedIn: 'root',
})
export class KvitterService {
  private backendURL = 'http://localhost:8080/';
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  loadAllKvitters() {
    return this.httpClient.get<Kvitter[]>(this.backendURL + 'index');
  }
}