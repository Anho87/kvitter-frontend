import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { AddKvitterComponent } from '../add-kvitter/add-kvitter.component';
import { ButtonComponent } from '../button/button.component';
import { AxiosService } from '../services/axios.service';
import { KvitterListComponent } from "../kvitter-list/kvitter-list.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logged-in',
  standalone: true,
  imports: [AddKvitterComponent, ButtonComponent, KvitterListComponent, CommonModule],
  templateUrl: './logged-in-content.component.html',
  styleUrl: './logged-in-content.component.css'
})
export class LoggedInContentComponent{
  private axiosService = inject(AxiosService);
 
  onLogout() {
    this.axiosService.logout();
  }
}
