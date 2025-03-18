import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { LoggedInComponent } from '../logged-in/logged-in.component';
import { LoginRegisterFormComponent } from '../login-register-form/login-register-form.component';
import { KvitterComponent } from "../models/kvitter/kvitter.component";
import { Kvitter } from '../models/kvitter/kvitter.model';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    LoggedInComponent,
    LoginRegisterFormComponent,
    KvitterComponent,
],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit, OnDestroy {
  private axiosService = inject(AxiosService);
  kvitters = computed<Kvitter[]>(() => this.axiosService.tenMostPopularAndPublicKvitterList());
  private dataLoaded = false;
  currentKvitterIndex: number = 0;
  private intervalId: any;
  componentToShow: string = 'login';

  ngOnInit(): void {
    if (!this.dataLoaded) {
      this.axiosService.updateTenMostPopularAndPublicKvitterList(); 
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
    }, 1000);
  }

  onLogOut(componentToShow: string){
    this.componentToShow = componentToShow;
    this.startInterval();
  }

  cycleThroughKvitter(): void {
    if (this.kvitters().length > 0) {
      this.currentKvitterIndex = (this.currentKvitterIndex + 1) % this.kvitters().length;
      // console.log(this.currentKvitterIndex);
    }
  }

  get currentKvitter(): Kvitter {
    return this.kvitters()[this.currentKvitterIndex];
  }

  showComponent(componentToShow: string): void {
    this.componentToShow = this.componentToShow === componentToShow ? 'welcome' : componentToShow;
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
        this.ngOnDestroy()
        this.componentToShow = 'index';
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
        this.ngOnDestroy()
        this.componentToShow = 'index';
      });
  }
}
