import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AxiosService } from '../services/axios.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
})
export class SearchFormComponent {
   private axiosService = inject(AxiosService);
  @Output() close = new EventEmitter<void>();
  @Output() onSearched = new EventEmitter<{ category: string; searchWord: string }>();
  category: string = "";
  searchWord: string = "";

  search(){
    this.onSearched.emit({category: this.category, searchWord: this.searchWord});
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }
}
