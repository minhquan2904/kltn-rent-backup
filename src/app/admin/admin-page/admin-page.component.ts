import { Component, OnInit } from '@angular/core';

import { StatisticSerivce, AlertService, AuthenticationService} from '../../_services/index';
import { Statistic } from '../../_models/index';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  static: Statistic;
  constructor(private statisticService: StatisticSerivce,
      private alertService: AlertService,
      private authService: AuthenticationService
    ) { }
  isSuperAdmin: Boolean = false;
  ngOnInit() {
    console.log(this.authService.isSuperAdmin);
    this.isSuperAdmin = this.authService.isSuperAdmin;
    this.statisticService.getInfo().subscribe( res => {
      this.static = res.json();
    }, err => {
      this.alertService.error(err);
    });
  }

}

