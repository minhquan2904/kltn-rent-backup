import { Component, OnInit} from '@angular/core';
import { appConfig } from '../../../app.config'; 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MotelService, AlertService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css']
})
export class AdvanceSearchComponent implements OnInit {

  constructor(private motelService: MotelService, private alertService: AlertService) { }
  location = appConfig.vn;
  resultArray: any; // array to city list
  districtArray: any = []; // array to district
  query: any = {
    city: '',
    district: '',
    ward: '',
    street: ''
  };
  hasRs: Boolean = false;
  motels: Observable<Motel[]>; // data recceive after search
  city: any = {};
  title: String = 'Results';
  ngOnInit() {
    this.resultArray = Object.keys(this.location).map( res => {
      const city = this.location[res];
      return city;
    });
  }
  onCityChange() {
    this.query.city = this.resultArray[this.city.id].name;
    this.districtArray = Object.keys(this.resultArray[this.city.id].districts).map( res => {
      const name = this.resultArray[this.city.id].districts[res];
      return name;
    });
  }



  onAdvanceSearch() {
  //  this.query.district = this.query.district.substr(this.query.district.indexOf(' ') + 1);
  //   console.log(this.query);
    if (this.wordCount(this.query.district) > 2) {
      this.query.district = this.query.district.substr(this.query.district.indexOf(' ') + 1);
    }
    this.motels = this.motelService.search(this.query);
    this.hasRs = true;
  }

  wordCount(str) {
    return str.split(' ').length;
  }

  onMapSearchClick(data: any) {
    this.hasRs = false;
    data.distance = 5;
    this.handleSearhNearBy(data);
  }
  handleSearhNearBy(data) {
    this.motels = of(data);
    this.hasRs = true;
   }

}
