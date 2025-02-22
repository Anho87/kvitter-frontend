import { Component } from '@angular/core';
import { KvitterComponent } from "./kvitter/kvitter.component";
import { ContentComponent } from "./content/content.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContentComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
 
}
