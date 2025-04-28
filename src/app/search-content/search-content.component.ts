import { Component, inject, Input, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { ActivatedRoute } from '@angular/router';
import { AxiosService } from '../services/axios.service';

@Component({
  selector: 'app-search-content',
  standalone: true,
  imports: [KvitterListComponent],
  templateUrl: './search-content.component.html',
  styleUrl: './search-content.component.css',
})
export class SearchContentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private axiosService = inject(AxiosService);
  @Input() category: string = "";
  @Input() searched: string = "";

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
