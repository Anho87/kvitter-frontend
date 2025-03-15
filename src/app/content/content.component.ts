import { Component, computed, inject } from '@angular/core';
import { WelcomeContentComponent } from '../welcome-content/welcome-content.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AxiosService } from '../services/axios.service';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from "../register-form/register-form.component";
import { ButtonComponent } from "../button/button.component";
import { LoggedInComponent } from "../logged-in/logged-in.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    LoginFormComponent,
    WelcomeContentComponent,
    CommonModule,
    RegisterFormComponent,
    ButtonComponent,
    LoggedInComponent
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
