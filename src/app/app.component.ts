import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AxiosService } from './services/axios.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  private axiosService = inject(AxiosService);
  ngOnInit(): void {
    this.axiosService.autoLogin().then(loggedIn => {
      if (loggedIn) {
        console.log('User successfully auto-logged in.');
      } else {
        console.log('User not logged in.');
      }
    });
  }
 
}
