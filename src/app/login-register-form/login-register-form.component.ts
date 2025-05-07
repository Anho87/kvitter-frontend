import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-register-form.component.html',
  styleUrl: './login-register-form.component.css',
})
export class LoginRegisterFormComponent {
  private authService = inject(AuthService);
  @Input() formToShow: string = '';
  // @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() navigateToRegisterEvent = new EventEmitter();

  userName: string = 'mario';
  password: string = 'itsame123';
  email: string = '';
  reEnterPassword: string = '';
  isMismatch: boolean = false;

  checkPasswords() {
    this.isMismatch = this.password !== this.reEnterPassword;
  }

  onSubmitRegister() {
    if (this.isMismatch) return;

    this.authService.register({
      email: this.email,
      userName: this.userName,
      password: this.password,
    })

    this.userName = '';
    this.email = '';
    this.password = '';
    this.reEnterPassword = '';
    this.isMismatch = false;
  }

  onSubmitLogin() {

    this.authService.login({
      userName: this.userName,
      password: this.password,
    })

    this.userName = '';
    this.email = '';
    this.password = '';
    this.reEnterPassword = '';
    this.isMismatch = false;
  }

  navigateToRegister() {
    this.formToShow = this.formToShow === 'register' ? 'login' : 'register';
    if (this.formToShow === 'register') {
      this.userName = '';
      this.password = '';
    }
    else{
      this.userName = 'mario';
      this.password = 'itsame123';
    }
    this.navigateToRegisterEvent.emit(this.formToShow);
  }
}
