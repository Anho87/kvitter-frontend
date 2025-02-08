import { Component } from '@angular/core';
import { LatestKvitterComponent } from "./latest-kvitter/latest-kvitter.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LatestKvitterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
 
}
