import { Component, inject, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FilterService } from '../services/filter-service.service';
import { ApiService } from '../services/api-service.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [KvitterListComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  userName!: string;

  private apiService = inject(ApiService);
  private filterService = inject(FilterService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userName = params['userName'];
      this.filterService.selectedOption.set('user-info');
      this.apiService.getKvitterList('user-info', this.userName);
    });
  }

  onLogout(): void {
    this.apiService.logout();
  }

  back(): void {
    this.location.back();
  }
}
