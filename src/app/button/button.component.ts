import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() hoverText = '';
  @Input() buttonClass = 'styled-btn';
  @Output() buttonEvent = new EventEmitter();
  @Input() tooltipPosition: 'above' | 'below' = 'above';
}
