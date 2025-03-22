import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AxiosService } from './services/axios.service';
import { Router, RouterOutlet } from '@angular/router';
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
  private router = inject(Router);
  ngOnInit(): void {
    this.axiosService.autoLogin().then(loggedIn => {
      if (loggedIn) {
        console.log('User successfully auto-logged in.');
        let userName = this.axiosService.getUsernameFromToken();
        this.router.navigate([`user/${userName}`]);
      } else {
        console.log('User not logged in.');
        this.router.navigate(['/welcome']);
      }
    });
  }
 
}
