import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ContentComponent } from "./content/content.component";
import { AxiosService } from './services/axios.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContentComponent],
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
        this.contentComponent.ngOnDestroy();
        // console.log('User successfully auto-logged in.');
      } else {
        // console.log('User not logged in.');
      }
    });
  }
 
}
