import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MotelService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private motelService: MotelService) { }
  encapsulation: ViewEncapsulation.None;
  query: any;
  hasRs: Boolean =  false; // flag to show resuls
  title: String = 'Resutls';
  motels: Observable<Motel[]>;
  ngOnInit() {
  }
  onSearchClick() {
    this.hasRs = true;
    this.motels = this.motelService.fullSearch(this.query);
  }
} 
