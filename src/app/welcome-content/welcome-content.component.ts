import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { LoginRegisterFormComponent } from '../login-register-form/login-register-form.component';
import { KvitterComponent } from '../models/kvitter/kvitter.component';
import { Kvitter } from '../models/kvitter/kvitter.model';
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
  private kvitterService = inject(KvitterService);

  kvitters = computed<Kvitter[]>(() => this.kvitterService.tenPublicKvitterList());
  isLoadingKvitters = computed<boolean>(() => this.kvitterService.isLoadingKvitters());
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
      // console.log(this.currentKvitterIndex);
    }
  }

  get currentKvitter(): Kvitter {
    return this.kvitters()[this.currentKvitterIndex];
  }

  showForm(inFormToShow: string): void {
    this.formToShow = this.formToShow === inFormToShow ? 'welcome' : inFormToShow;
  }

}
