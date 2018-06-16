import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator} from '@angular/material';

import { MotelService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
@Component({
  selector: 'app-admin-table-motel',
  templateUrl: './admin-table-motel.component.html',
  styleUrls: ['./admin-table-motel.component.css']
})
export class AdminTableMotelComponent implements OnInit {
  viewAccepted = false;
  listMotel: any;
  displayedColumns= ['position', 'created', 'address', 'action'];
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;  // = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private motelService: MotelService) { }

  ngOnInit() {
    this.motelService.findByStatus(0).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
    }, err => {
      console.log(err);
    });

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  handleAccepted() {
    this.viewAccepted = !this.viewAccepted;
  }
}
