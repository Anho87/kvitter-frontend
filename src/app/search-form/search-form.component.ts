import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
})
export class SearchFormComponent {
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
