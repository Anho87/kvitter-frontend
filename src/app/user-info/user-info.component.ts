import { Component, inject, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { AxiosService } from '../services/axios.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FilterService } from '../services/filter-service.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [KvitterListComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  userName!: string;
  private axiosService = inject(AxiosService);
    private filterService = inject(FilterService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userName = params['userName'];
    });
    this.filterService.selectedOption.set('user-info');
    this.axiosService.getKvitterList('user-info',this.userName);
  }

  onLogout(): void {
    this.axiosService.logout();
  }

  back(){
    this.location.back();
  }
}
