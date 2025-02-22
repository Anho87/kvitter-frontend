import { Component, inject, OnInit } from '@angular/core';
import { AxiosService } from '../axios.service';

@Component({
  selector: 'app-auth-content',
  standalone: true,
  imports: [],
  templateUrl: './auth-content.component.html',
  styleUrl: './auth-content.component.css',
})
export class AuthContentComponent implements OnInit {
  data: string[] = [];
  private axiosService = inject(AxiosService);

  ngOnInit(): void {
    this.axiosService
      .request('GET', '/messages')
      .then((response) => (this.data = response.data));
  }
}
