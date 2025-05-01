import { Component, inject, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FilterService } from '../services/filter.service';
import { AuthService } from '../services/auth.service';
import { KvitterService } from '../services/kvitter.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [KvitterListComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  userName!: string;

  private kvitterService = inject(KvitterService);
  private filterService = inject(FilterService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userName = params['userName'];
      this.filterService.selectedOption.set('user-info');
      this.kvitterService.getKvitterList('user-info', this.userName);
    });
  }

}
