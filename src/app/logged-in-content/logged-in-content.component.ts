import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AddKvitterComponent } from '../add-kvitter/add-kvitter.component';
import { ButtonComponent } from '../button/button.component';
import { AxiosService } from '../services/axios.service';
import { KvitterListComponent } from "../kvitter-list/kvitter-list.component";

@Component({
  selector: 'app-logged-in',
  standalone: true,
  imports: [AddKvitterComponent, ButtonComponent, KvitterListComponent],
  templateUrl: './logged-in-content.component.html',
  styleUrl: './logged-in-content.component.css'
})
export class LoggedInContentComponent{
  private axiosService = inject(AxiosService);
  @Output() logoutEvent = new EventEmitter<string>();
  onLogout() {
    this.axiosService.logout();
    this.logoutEvent.emit('login')
  }
}
