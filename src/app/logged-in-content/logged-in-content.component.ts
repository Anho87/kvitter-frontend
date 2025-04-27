import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AddKvitterComponent } from '../add-kvitter/add-kvitter.component';
import { AxiosService } from '../services/axios.service';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-logged-in',
  standalone: true,
  imports: [
    AddKvitterComponent,
    KvitterListComponent,
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './logged-in-content.component.html',
  styleUrl: './logged-in-content.component.css',
})
export class LoggedInContentComponent implements OnInit{
  private axiosService = inject(AxiosService);
  private location = inject(Location);
  isAddingKvitter: boolean = false;
  isSmallScreen = false;


  isOpen = false;
  selectedOption: string = 'Popular';

  options = ['Popular', 'Following'];

  ngOnInit() {
    this.checkScreenSize();
  }
  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 400;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isOpen = false;
  }

  onAddingKvitter() {
    this.isAddingKvitter = true;
  }
  onCloseAddKvitter() {
    this.isAddingKvitter = false;
  }

  onLogout() {
    this.axiosService.logout();
  }

  back() {
    this.location.back();
  }
}
