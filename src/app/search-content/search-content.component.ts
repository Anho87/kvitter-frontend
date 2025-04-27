import { Component } from '@angular/core';
import { KvitterListComponent } from "../kvitter-list/kvitter-list.component";

@Component({
  selector: 'app-search-content',
  standalone: true,
  imports: [KvitterListComponent],
  templateUrl: './search-content.component.html',
  styleUrl: './search-content.component.css'
})
export class SearchContentComponent {

}
