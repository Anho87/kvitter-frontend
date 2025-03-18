import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-register-form.component.html',
  styleUrl: './login-register-form.component.css',
})
export class LoginRegisterFormComponent {
  @Input() formToShow: string = '';
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() navigateToRegisterEvent = new EventEmitter();

  userName: string = '';
  password: string = '';
  email: string = '';
  reEnterPassword: string = '';
  isMismatch: boolean = false;

  checkPasswords() {
    this.isMismatch = this.password !== this.reEnterPassword;
  }

  onSubmitRegister() {
    if (this.isMismatch) return;

    this.onSubmitLoginEvent.emit({
      event: this.formToShow,
      email: this.email,
      userName: this.userName,
      password: this.password,
    });

    this.userName = '';
    this.email = '';
    this.password = '';
    this.reEnterPassword = '';
    this.isMismatch = false;
  }

  onSubmitLogin() {
    this.onSubmitLoginEvent.emit({
      event: this.formToShow,
      userName: this.userName,
      password: this.password,
    });

    this.userName = '';
    this.email = '';
    this.password = '';
    this.reEnterPassword = '';
    this.isMismatch = false;
  }

  navigateToRegister() {
    this.formToShow = this.formToShow === 'register' ? 'login' : 'register';
    this.navigateToRegisterEvent.emit(this.formToShow);
  }
}
