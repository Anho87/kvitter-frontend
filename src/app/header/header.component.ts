import { Component, inject } from '@angular/core';
import { AxiosService } from '../services/axios.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private axiosService = inject(AxiosService);
   private router = inject(Router);
  navigateToStart(){
    let userName = this.axiosService.getUsernameFromToken();
    this.router.navigate([`user/${userName}`]);
  }
}
