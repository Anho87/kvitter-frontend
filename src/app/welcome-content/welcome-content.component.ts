import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { LoginRegisterFormComponent } from '../login-register-form/login-register-form.component';
import { KvitterComponent } from '../models/kvitter/kvitter.component';
import { Kvitter } from '../models/kvitter/kvitter.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { KvitterService } from '../services/kvitter.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    LoginRegisterFormComponent,
    KvitterComponent,
  ],
  templateUrl: './welcome-content.component.html',
  styleUrl: './welcome-content.component.css',
})
export class WelcomeContentComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private kvitterService = inject(KvitterService)
  private titleService = inject(Title);
  private router = inject(Router);

  kvitters = computed<Kvitter[]>(() => this.kvitterService.tenPublicKvitterList());
  private dataLoaded = false;
  currentKvitterIndex: number = 0;
  private intervalId: any;
  formToShow: string = 'login';

  ngOnInit(): void {
    if (!this.dataLoaded) {
      this.kvitterService.welcomePageKvitter();
      this.dataLoaded = true;
    }
    this.startInterval();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startInterval(): void {
    this.intervalId = setInterval(() => {
      this.cycleThroughKvitter();
    }, 5000);
  }

  cycleThroughKvitter(): void {
    if (this.kvitters().length > 0) {
      this.currentKvitterIndex = (this.currentKvitterIndex + 1) % this.kvitters().length;
      console.log(this.currentKvitterIndex);
    }
  }

  get currentKvitter(): Kvitter {
    return this.kvitters()[this.currentKvitterIndex];
  }

  showForm(inFormToShow: string): void {
    this.formToShow = this.formToShow === inFormToShow ? 'welcome' : inFormToShow;
  }

  // onLogin(input: any): void {
  //   const actions: { [key: string]: (input: any) => void } = {
  //     login: this.login.bind(this),
  //     register: this.register.bind(this),
  //   };
  //   actions[input.event]?.(input);
  // }

  // login(input: any): void {
  //   this.authService.http.post<{ accessToken: string }>(
  //     'login',
  //     {
  //       userName: input.userName,
  //       password: input.password,
  //     },
  //     { withCredentials: true }
  //   ).subscribe({
  //     next: (response) => {
  //       this.authService.setAccessToken(response.accessToken);
  //       this.authService.authorized.set(true);
  //       const userName = this.authService.getUsernameFromToken();
  //       this.titleService.setTitle(`Kvitter - ${userName}`);
  //       this.ngOnDestroy();
  //       this.router.navigate([`user/${userName}`]);
  //     },
  //     error: (err) => {
  //       console.error('Login failed:', err);
  //     }
  //   });
  // }

  // register(input: any): void {
  //   this.authService.http.post<{ accessToken: string }>(
  //     'register',
  //     {
  //       email: input.email,
  //       userName: input.userName,
  //       password: input.password,
  //     },
  //     { withCredentials: true }
  //   ).subscribe({
  //     next: (response) => {
  //       this.authService.setAccessToken(response.accessToken);
  //       this.authService.authorized.set(true);
  //       const userName = this.authService.getUsernameFromToken();
  //       this.titleService.setTitle(`Kvitter - ${userName}`);
  //       this.ngOnDestroy();
  //       this.router.navigate([`user/${userName}`]);
  //     },
  //     error: (err) => {
  //       console.error('Registration failed:', err);
  //     }
  //   });
  // }
}
