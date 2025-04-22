import { Component, inject, Input, OnInit } from '@angular/core';
import { Rekvitt } from './rekvitt.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KvitterComponent } from "../kvitter/kvitter.component";
import { ButtonComponent } from "../../button/button.component";
import { AxiosService } from 'src/app/services/axios.service';

@Component({
  selector: 'app-rekvitt',
  standalone: true,
  imports: [CommonModule, KvitterComponent, ButtonComponent],
  templateUrl: './rekvitt.component.html',
  styleUrl: './rekvitt.component.css',
})
export class RekvittComponent implements OnInit{
  private axiosService = inject(AxiosService);
  private router = inject(Router);
  @Input({ required: true }) rekvitt!: Rekvitt;
  @Input() showRemoveButton: boolean = false;
  isUpvoted = false;

  removeKvitter() {
    let data = {
      rekvittId: this.rekvitt.id,
    };
    this.axiosService
      .request('DELETE', '/removeRekvitt', data)
      .then((response) => {
        console.log('Rekvitt removed successfully', response);
        this.axiosService.getKvitterList();
      })
      .catch((error) => {
        console.error('Error removing Rekvitt', error);
      });
    }

  navigateToUserInfo(username: string) {
    console.log(username);
    this.router.navigate([`user-info/${username}`]);
  }

  ngOnInit(): void {
    if ( this.axiosService.getUsernameFromToken() === this.rekvitt.user.userName){
      this.showRemoveButton = true;
    }
  }

}
