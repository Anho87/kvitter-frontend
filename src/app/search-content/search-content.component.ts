import { Component, inject, Input, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosService } from '../services/axios.service';
import { ButtonComponent } from "../button/button.component";
import { SearchFormComponent } from "../search-form/search-form.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-content',
  standalone: true,
  imports: [KvitterListComponent, ButtonComponent, SearchFormComponent, CommonModule],
  templateUrl: './search-content.component.html',
  styleUrl: './search-content.component.css',
})
export class SearchContentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  isSearching: boolean = false;
  @Input() category: string = "";
  @Input() searched: string = "";

  onSearched(event: any){
    this.category = event.category;
    this.searched = event.searchWord;
    this.fetchSearchResults(this.category, this.searched);
    this.router.navigate(['/search'],{ queryParams: { category: this.category, searched: this.searched} });
  }

  onIsSearching(){
    this.isSearching = true;
  }

  onCloseIsSearching(){
    this.isSearching = false;
  }

  ngOnInit() {
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

  fetchSearchResults(category: string, searched: string) {
    this.axiosService.getSearchResults(category, searched);
  }
}
