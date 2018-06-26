import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatDialog, MatHorizontalStepper, MatStep,
  MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatFormField, MatFormFieldControl} from '@angular/material';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { MotelService, AlertService, AuthenticationService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
// import { CourseDialogComponent} from '../dialog/dialog.component';
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
    console.log(dt._id);
    this.dialog.open(DialogDataComponent, {
      data: {
        _id: dt._id,
        title: dt.title,
        customer: dt.customer,
        description: dt.description,
        category: dt.category,
        price: dt.price,
        area: dt.area,
        city: dt.city,
        district: dt.district,
        street: dt.street,
        ward: dt.ward,
        add: dt.add,
        contact: dt.contact
      }
    });
  }
}

@Component({
  selector: 'app-dialog-data',
  templateUrl: 'dialog.component.html',
})
export class DialogDataComponent {
  options: FormGroup;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  constructor(
    public dialogRef: MatDialogRef<DialogDataComponent>, fb: FormBuilder, private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertService: AlertService, private motelService: MotelService
  ) {
      this.options = fb.group({
        hideRequired: false,
        floatLabel: 'auto',
      });
     }
  // stepper variable
  step1Completed = false;
  step2Completed = false;
  isLinear = true;
  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.motelService.updateMotel(this.data._id, this.data).subscribe( res => {
      this.alertService.success('Update ok');
    }, err => {
      this.alertService.error(err);
    })
  }
  complete() {
    this.stepper.next();
  }

  step_1_next() {
    const price = this.data.price;
    const contact = this.data.contact;
    if (!price || !contact) {
      this.step1Completed = false;
      this.alertService.error('please fill required inputs');
    }else {
      this.step1Completed = true;
      this.alertService.success('Everything is ok ');
      setTimeout(() => {
        this.stepper.next();
      }, 2);
    }
  }

  step_2_next() {
    const category = this.data.category;
    if (!category) {
      this.step2Completed = false;
      this.alertService.error('please fill required inputs');
    }else {
      this.step2Completed = true;
      this.alertService.success('Everything is ok ');
      setTimeout(() => {
        this.stepper.next();
      }, 2);
    }
  }
}
