import { Component, computed, inject } from '@angular/core';
import { WelcomeContentComponent } from '../welcome-content/welcome-content.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AxiosService } from '../axios.service';
import { WelcomeButtonsComponent } from '../welcome-buttons/welcome-buttons.component';
import { CommonModule } from '@angular/common';
import { KvitterComponent } from '../kvitter/kvitter.component';
import { AddKvitterComponent } from '../add-kvitter/add-kvitter.component';
import { RegisterFormComponent } from "../register-form/register-form.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    LoginFormComponent,
    WelcomeButtonsComponent,
    WelcomeContentComponent,
    CommonModule,
    KvitterComponent,
    AddKvitterComponent,
    RegisterFormComponent
],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  private axiosService = inject(AxiosService);

  componentToShow: string = 'welcome';

  showComponent(componentToShow: string): void {
    this.componentToShow = componentToShow;
  }

  onLogout() {
    this.axiosService.logout();
    this.componentToShow = 'welcome';
  }

  onLogin(input: any) {
    this.axiosService
      .request('POST', '/login', {
        userName: input.userName,
        password: input.password,
      })
      .then((response) => {
        this.axiosService.setAccessToken(response.data.accessToken);
        this.componentToShow = 'index';
      });
  }

  onRegister(input: any) {
    this.axiosService
      .request('POST', '/register', {
        email: input.email,
        userName: input.userName,
        password: input.password,
      })
      .then((response) => {
        this.axiosService.setAccessToken(response.data.accessToken);
        this.componentToShow = 'index';
      });
  }
}
