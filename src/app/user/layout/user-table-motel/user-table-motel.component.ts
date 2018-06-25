import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { MotelService, AlertService, AuthenticationService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
import { CourseDialogComponent} from '../dialog/dialog.component';
@Component({
  selector: 'app-user-table-motel',
  templateUrl: './user-table-motel.component.html',
  styleUrls: ['./user-table-motel.component.css']
})
export class UserTableMotelComponent implements OnInit {
  viewAccepted = false;
  listMotel: any;
  displayedColumns= ['position', 'created', 'address', 'point', 'expired', 'action'];
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;  // = new MatTableDataSource(ELEMENT_DATA);
  dataSourceAccepted: any; //
  data: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private authService: AuthenticationService,
    private motelService: MotelService, private alertService: AlertService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.motelService.findByUser(this.authService.userID).subscribe(res => {
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

  handleUpdateExpired(id, expired) {
    const motel = {
      expired: !expired
    };

    this.motelService.update(id, motel).subscribe(res => {
      this.alertService.success('Update ok');
    }, err => {
      this.alertService.error(err);
    });
  }
  openDialog(dt) {
    console.log(dt.title);
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = {
    //   title: data.title
    // };

    this.dialog.open(DialogDataComponent, {
      data: {
        title: dt.title
      }
    });
  }
}

@Component({
  selector: 'app-dialog-data',
  templateUrl: 'dialog.component.html',
})
export class DialogDataComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}