import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { LoginRegisterFormComponent } from '../login-register-form/login-register-form.component';
import { KvitterComponent } from "../models/kvitter/kvitter.component";
import { Kvitter } from '../models/kvitter/kvitter.model';
import { Router } from '@angular/router';

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
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  kvitters = computed<Kvitter[]>(() => this.axiosService.tenPublicKvitterList());
  private dataLoaded = false;
  currentKvitterIndex: number = 0;
  private intervalId: any;
  formToShow: string = 'login';

  ngOnInit(): void {
    if (!this.dataLoaded) {
      this.axiosService.welcomePageKvitter(); 
      this.dataLoaded = true;
    }
    this.startInterval();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startInterval(){
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

  onLogin(input: any) {
    const actions: { [key: string]: (input: any) => void } = {
      login: this.login.bind(this),
      register: this.register.bind(this),
    };
    actions[input.event]?.(input);
  }

  login(input: any) {
    this.axiosService
      .request('POST', '/login', {
        userName: input.userName,
        password: input.password,
      })
      .then((response) => {
        this.axiosService.setAccessToken(response.data.accessToken);
        let userName = this.axiosService.getUsernameFromToken();
        this.ngOnDestroy()
        this.router.navigate([`user/${userName}`]);
      });
  }

  register(input: any) {
    this.axiosService
      .request('POST', '/register', {
        email: input.email,
        userName: input.userName,
        password: input.password,
      })
      .then((response) => {
        this.axiosService.setAccessToken(response.data.accessToken);
        let userName = this.axiosService.getUsernameFromToken();
        this.ngOnDestroy()
        this.router.navigate([`user/${userName}`]);
      });
  }
}
