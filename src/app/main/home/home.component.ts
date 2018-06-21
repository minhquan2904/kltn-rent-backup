import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs/Observable';

import { MotelService, AlertService } from '../../_services/index';
import { Motel } from '../../_models/index';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public color: String = 'WHITE'; // color for nav character
  constructor(private motelSerivce: MotelService, private alertSerivce: AlertService) { }
  motels: Observable<Motel[]>;

  ngOnInit() {
    this.motels = this.motelSerivce.findRecent();
  }

}
