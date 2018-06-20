import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator} from '@angular/material';

import { CommentService, AlertService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
@Component({
  selector: 'app-admin-table-comment',
  templateUrl: './admin-table-comment.component.html',
  styleUrls: ['./admin-table-comment.component.css']
})
export class AdminTableCommentComponent implements OnInit {
  viewAccepted = false;
  listMotel: any;
  displayedColumns= ['position', 'created', 'address', 'action'];
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;  // = new MatTableDataSource(ELEMENT_DATA);
  dataSourceAccepted: any; //

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private commentService: CommentService, private alertService: AlertService) { }

  ngOnInit() {
    this.commentService.findByStatus(0).subscribe(res => {
      console.log(res);
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
    this.commentService.findByStatus(1).subscribe(res => {
      this.dataSourceAccepted = new MatTableDataSource(res);
      this.dataSourceAccepted.paginator = this.paginator2;
    }, err => {
      this.alertService.error(err);
    });

  }
  handleUpdateStatus(_id, customer, status, position, type) {
    console.log(position);
    let comment: any = {
      customer_id: customer,
      status: status
    };
    console.log(_id + " " + JSON.stringify(comment));
    this.commentService.update(_id, comment).subscribe( res => {
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
