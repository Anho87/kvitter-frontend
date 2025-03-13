import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-buttons',
  standalone: true,
  imports: [],
  templateUrl: './welcome-buttons.component.html',
  styleUrl: './welcome-buttons.component.css',
})
export class WelcomeButtonsComponent {
  @Output() loginEvent = new EventEmitter();
  @Output() registerEvent = new EventEmitter();
}
