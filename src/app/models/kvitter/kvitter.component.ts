import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniHashtagDto } from '../hashtag/mini-hashtag-dto.model';
import { HashtagComponent } from "../hashtag/hashtag.component";
import { ButtonComponent } from "../../button/button.component";
import { AxiosService } from '../../services/axios.service';
import { Kvitter } from './kvitter.model';

@Component({
  selector: 'app-kvitter',
  standalone: true,
  imports: [CommonModule, HashtagComponent, HashtagComponent, ButtonComponent],
  templateUrl: './kvitter.component.html',
  styleUrl: './kvitter.component.css'
})
export class KvitterComponent implements OnInit{
  private axiosService = inject(AxiosService);
  @Input({required:true}) kvitter!: Kvitter;
  @Input({required:true}) showPrivateMark!: boolean;
  @Input() class = '';
  
  showButtoncomponent: boolean = false;
  
  removeKvitter() {
    let data = {
      id: this.kvitter.id,
    }
    this.axiosService.request('DELETE', '/removeKvitter' ,data)
    .then((response) => {
      console.log('Kvitter removed successfully', response);
      this.axiosService.getKvitterList();
    })
    .catch((error) => {
      console.error('Error removed kvitter', error);
    });
  } 
  
  ngOnInit(): void {
    if(this.axiosService.getUsernameFromToken() === this.kvitter.user.userName){
      this.showButtoncomponent = true
    }
  }
}
