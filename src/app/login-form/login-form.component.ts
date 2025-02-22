import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  active: string = 'login';
  userName: string = '';
  password: string = '';
  email: string = '';

  onSubmitLogin() {
    this.onSubmitLoginEvent.emit({
      userName: this.userName,
      password: this.password,
    });
  }

  onSubmitRegister() {
    this.onSubmitRegisterEvent.emit({
      email: this.email,
      userName: this.userName,
      password: this.password,
    });
  }

  onLoginTab() {
    this.active = 'login';
  }

  onRegisterTab() {
    this.active = 'register';
  }
}
