import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniHashtagDto } from '../hashtag/mini-hashtag-dto.model';
import { HashtagComponent } from "../hashtag/hashtag.component";
import { ButtonComponent } from "../button/button.component";
import { AxiosService } from '../services/axios.service';

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [CommonModule, HashtagComponent, HashtagComponent, ButtonComponent],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css'
})
export class KvitterComponent implements OnInit{
  private axiosService = inject(AxiosService);
  @Input() username = '';
  @Input() message = '';
  @Input() hashtags: MiniHashtagDto[] = [];
  @Input() createdDateAndTime = '';
  @Input() id = '';
  
  showButtoncomponent: boolean = false;
  
  removeKvitter() {
    console.log(this.id);
    let data = {
      id: this.id,
    }
    this.axiosService.request('DELETE', '/removeKvitter' ,data)
    .then((response) => {
      console.log('Kvitter removed successfully', response);
      this.axiosService.updateKvitterList();
    })
    .catch((error) => {
      console.error('Error removed kvitter', error);
    });
  } 
  
  ngOnInit(): void {
    if(this.axiosService.getUsernameFromToken() === this.username){
      this.showButtoncomponent = true
    }
  }
}
