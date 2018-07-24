import { Component, OnInit, Input } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

import { Motel } from '../../../_models/index';
@Component({
  selector: 'app-recent-post',
  templateUrl: './recent-post.component.html',
  styleUrls: ['./recent-post.component.css']
})
export class RecentPostComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  p: Number = 1;

  @Input('motels') motels: Observable<Motel[]>;
  @Input('title') title: String;
  // list motel
  data: any = {};
  // map : MapComponent;
  currentUser: any = {};
  moderator: boolean;
  previous: String = 'Previous';
  next: String = 'Next';
  // public translate: TranslateService
  constructor(public translate: TranslateService ) {
    if (this.translate.currentLang === 'vi') {
      this.previous = 'Trước';
      this.next = 'Tiếp';
    }
   }

  ngOnInit() {
    
    // console.log(this.translate.currentLang);
  }
}
