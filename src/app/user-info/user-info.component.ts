import { Component, computed, inject, OnInit } from '@angular/core';
import { KvitterListComponent } from '../kvitter-list/kvitter-list.component';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../services/filter.service';
import { KvitterService } from '../services/kvitter.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user/user.model';

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
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  user = computed<User | null>(() => this.userService.user());

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userName = params['userName'];
      this.filterService.selectedOption.set('user-info');
      this.kvitterService.getKvitterList('user-info', this.userName);
      this.userService.getUserInfo(this.userName);
    });
  }

}
