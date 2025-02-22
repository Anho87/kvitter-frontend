import { Component, computed, inject } from '@angular/core';
import { WelcomeContentComponent } from '../welcome-content/welcome-content.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AxiosService } from '../axios.service';
import { ButtonsComponent } from "../buttons/buttons.component";
import { AuthContentComponent } from "../auth-content/auth-content.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [LoginFormComponent, ButtonsComponent, WelcomeContentComponent, AuthContentComponent, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  private axiosService = inject(AxiosService);

  componentToShow: string = 'welcome';

  showComponent(componentToShow: string): void{
    this.componentToShow = componentToShow;
  }

  onLogin(input: any) {
    this.axiosService.request('POST', '/login', {
      userName: input.userName,
      password: input.password,
    });
  }

  onRegister(input: any) {
    this.axiosService.request('POST', '/register', {
      email: input.email,
      userName: input.userName,
      password: input.password,
    });
  }
}
