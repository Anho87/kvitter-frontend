import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { KvitterComponent } from "./kvitter/kvitter.component";
import { ContentComponent } from "./content/content.component";
import { HeaderComponent } from "./header/header.component";
import { AxiosService } from './services/axios.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContentComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  private axiosService = inject(AxiosService);
  @ViewChild(ContentComponent) contentComponent!: ContentComponent;
  ngOnInit(): void {
    this.axiosService.autoLogin().then(loggedIn => {
      if (loggedIn) {
        this.contentComponent.componentToShow = "index";
        console.log('User successfully auto-logged in.');
      } else {
        console.log('User not logged in.');
      }
    });
  }
 
}
