import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator} from '@angular/material';


import { UserService, AuthenticationService, AlertService } from '../../../_services/index';
import { User} from '../../../_models/index';
@Component({
  selector: 'app-admin-table-mod',
  templateUrl: './admin-table-mod.component.html',
  styleUrls: ['./admin-table-mod.component.css'],
  providers: [UserService]
})
export class AdminTableModComponent implements OnInit {
  viewAccepted = false;
  listMotel: any;
  displayedColumns= ['position', 'name', 'created', 'action'];
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;  // = new MatTableDataSource(ELEMENT_DATA);
  dataSourceAccepted: any; //

  user: any = {};
  password: any = {}; // object to confirm password

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private userService: UserService, private authService: AuthenticationService, private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userService.findMod().subscribe(res => {
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
  createMod() {
    if (this.password.newPassword === this.password.confirmPassword) {
      this.user.password = this.password.confirmPassword;
      this.user.role = 2;
      this.authService.register(this.user).subscribe(res => {
        this.alertService.success('Insert success!');
      }, err => {
        this.alertService.error(err);
      });
    } else {
      this.alertService.error('Password confirm incorect');
    }
  }
}
