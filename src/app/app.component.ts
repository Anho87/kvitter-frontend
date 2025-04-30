import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from "./header/header.component";
import { RightSideBarComponent } from "./right-side-bar/right-side-bar.component";
import { CommonModule } from '@angular/common';
import { LeftSideBarComponent } from "./left-side-bar/left-side-bar.component";
import { ApiService } from './services/api-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RightSideBarComponent, CommonModule, LeftSideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  private titleService = inject(Title);
  private router = inject(Router);

  authorized = computed(() => this.apiService.authorized());

  ngOnInit(): void {
    this.apiService.autoLogin().then(loggedIn => {
      if (loggedIn) {
        console.log('User successfully auto-logged in.');
        const userName = this.apiService.getUsernameFromToken();
        this.titleService.setTitle(`Kvitter - ${userName}`);
        this.router.navigate([`user/${userName}`]);
      } else {
        console.log('User not logged in.');
        this.router.navigate(['/welcome']);
      }
    });
  }
}
