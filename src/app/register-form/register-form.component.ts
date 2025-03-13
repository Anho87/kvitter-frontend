import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
@Output() onSubmitRegisterEvent = new EventEmitter();

  userName: string = '';
  password: string = '';
  email: string = '';

  onSubmitRegister() {
    this.onSubmitRegisterEvent.emit({
      email: this.email,
      userName: this.userName,
      password: this.password,
    });
  }
}
