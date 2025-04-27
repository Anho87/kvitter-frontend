import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { AxiosService } from './services/axios.service';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { RightSideBarComponent } from "./right-side-bar/right-side-bar.component";
import { CommonModule } from '@angular/common';
import { LeftSideBarComponent } from "./left-side-bar/left-side-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RightSideBarComponent, CommonModule, LeftSideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  authorized = computed(() => this.axiosService.authorized());

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
