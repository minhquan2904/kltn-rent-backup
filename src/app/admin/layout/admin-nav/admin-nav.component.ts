import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { StatisticSerivce, AlertService } from '../../../_services/index';
@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit {

  constructor(public translate: TranslateService,
     private statisticService: StatisticSerivce,
     private alertService: AlertService
    ) { }

  ngOnInit() {
  }
  udpateMonthlyRecord() {
    this.statisticService.updateMonthlyRecord().subscribe( res => {
      this.alertService.success('Update record ok');
    }, err => {
      this.alertService.error(err);
    })
  }
}
