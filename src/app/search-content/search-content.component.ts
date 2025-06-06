import { Component, inject, Input, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from "../button/button.component";
import { SearchFormComponent } from "../search-form/search-form.component";
import { CommonModule } from '@angular/common';
import { KvitterService } from '../services/kvitter.service';

@Component({
  selector: 'app-search-content',
  standalone: true,
  imports: [KvitterListComponent, ButtonComponent, SearchFormComponent, CommonModule],
  templateUrl: './search-content.component.html',
  styleUrl: './search-content.component.css',
})
export class SearchContentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private kvitterService = inject(KvitterService);
  private router = inject(Router);

  isSearching: boolean = false;
  @Input() category: string = "";
  @Input() searched: string = "";

  onSearched(event: any): void {
    this.category = event.category;
    this.searched = event.searchWord;
    this.fetchSearchResults(this.category, this.searched);
    this.router.navigate(['/search'], {
      queryParams: { category: this.category, searched: this.searched }
    });
  }

  onIsSearching(): void {
    this.isSearching = true;
  }

  onCloseIsSearching(): void {
    this.isSearching = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const category = params['category'];
      const searched = params['searched'];
      this.category = category;
      this.searched = searched;
      if (category && searched) {
        this.fetchSearchResults(category, searched);
      }
    });
  }

  fetchSearchResults(category: string, searched: string): void {
    this.kvitterService.getSearchResults(category, searched);
  }
}
