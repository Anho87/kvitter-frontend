import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AddKvitterComponent } from '../add-kvitter/add-kvitter.component';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { FilterService } from '../services/filter-service.service';
import { ApiService } from '../services/api-service.service';

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
export class LoggedInContentComponent implements OnInit {
  private apiService = inject(ApiService);
  private filterService = inject(FilterService);
  private location = inject(Location);

  isAddingKvitter: boolean = false;
  isSmallScreen = false;
  isOpen = false;
  selectedOption: string = 'Latest';

  options = ['Latest', 'Popular', 'Following', 'My Activity'];

  ngOnInit(): void {
    this.checkScreenSize();
    this.filterService.selectedOption.set(this.selectedOption);
    this.apiService.getKvitterList();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 400;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isOpen = false;
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.filterService.selectedOption.set(option);
    this.apiService.getKvitterList();
    this.isOpen = false;
  }

  onAddingKvitter(): void {
    this.isAddingKvitter = true;
    this.isOpen = false;
  }

  onCloseAddKvitter(): void {
    this.isAddingKvitter = false;
  }

  onLogout(): void {
    this.apiService.logout();
  }

  back(): void {
    this.location.back();
  }
}
