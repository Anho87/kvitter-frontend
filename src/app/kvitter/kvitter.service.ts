import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Kvitter } from '../kvitter/kvitter.model';
import { AxiosService } from '../axios.service';

@Injectable({
  providedIn: 'root',
})
export class KvitterService {
  private axiosService = inject(AxiosService);
  private backendURL = 'http://localhost:8080/';
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  loadAllKvitters() {
    // return this.axiosService
    // .request('GET', '/index')
    // .then((response) => (this.data = response.data));
    return this.httpClient.get<Kvitter[]>(this.backendURL + 'index');
  }
}