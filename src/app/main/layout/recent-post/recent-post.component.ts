import { Component, OnInit, Input } from '@angular/core';
import { Observable} from 'rxjs/Observable';
// import {TranslateService} from '@ngx-translate/core';

import { Motel } from '../../../_models/index';
@Component({
  selector: 'app-recent-post',
  templateUrl: './recent-post.component.html',
  styleUrls: ['./recent-post.component.css']
})
export class RecentPostComponent implements OnInit {

  public latitude: number;
  public longitude: number;

  @Input('motels') motels: Observable<Motel[]>;
  // list motel
  data: any = {};
  // map : MapComponent;
  currentUser: any = {};
  moderator: boolean;
  // public translate: TranslateService
  constructor() { }

  ngOnInit() {
  }
}
