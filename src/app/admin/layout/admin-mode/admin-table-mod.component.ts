import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator} from '@angular/material';

import { MotelService, AlertService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
@Component({
  selector: 'app-admin-table-mod',
  templateUrl: './admin-table-mod.component.html',
  styleUrls: ['./admin-table-mod.component.css']
})
export class AdminTableModComponent implements OnInit {
  viewAccepted = false;
  listMotel: any;
  displayedColumns= ['position', 'created', 'address', 'action'];
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;  // = new MatTableDataSource(ELEMENT_DATA);
  dataSourceAccepted: any; //

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private motelService: MotelService, private alertService: AlertService
  ) { }

  ngOnInit() {
    this.motelService.findByStatus(0).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    }, err => {
      this.alertService.error(err);
    });

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  handleAccepted() {
    this.viewAccepted = !this.viewAccepted;
    this.motelService.findByStatus(1).subscribe(res => {
      this.dataSourceAccepted = new MatTableDataSource(res);
      this.dataSourceAccepted.paginator = this.paginator2;
    }, err => {
      this.alertService.error(err);
    });

  }
  handleUpdateStatus(_id, customer, status, position, type) {
    console.log(position);
    const motel: any = {
      customer: customer,
      status: status
    };
    // console.log(_id + " " + JSON.stringify(motel));
    this.motelService.update(_id, motel).subscribe( res => {
     this.alertService.success('update ok');
     if (type === 1 ) {
      this.dataSource.data.splice(position, 1);
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
     } else {
      this.dataSourceAccepted.data.splice(position, 1);
      this.dataSourceAccepted = new MatTableDataSource<Element>(this.dataSourceAccepted.data);
     }
    }, err => {
      this.alertService.error(err);
    });
  }

  
}
