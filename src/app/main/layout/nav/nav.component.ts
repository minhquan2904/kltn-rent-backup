import { Component, OnInit, Input, Inject, HostListener } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import { WINDOW } from '../../../_services/index';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input() colorStyle: String;
  data: any = {};
  loginStatus: Boolean;
  isTopOfPage: Boolean =  true;
  constructor(public translate: TranslateService, @Inject(WINDOW) private window: Window) { }

  ngOnInit() {
    console.log(this.colorStyle);
    this.loginStatus = localStorage.getItem('currentUser') ? true : false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number = window.pageYOffset || 0;
    if (number === 0) {
      this.isTopOfPage = true;
    } else {
      this.isTopOfPage = false;
    }
    console.log(number);
  }
}
