import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { appConfig } from '../app.config';
import { AlertService, MotelService, ApiService } from '../_services/index';
import { MatHorizontalStepper, MatStep } from '@angular/material';


const URL = appConfig.apiUrl + '/uploadImg';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  // session expired
  expired: Boolean = false;
  // set up file uploader
  public motel: any = {};
  options: FormGroup;
  constructor(public dialog: MatDialog, fb: FormBuilder, private _formBuilder: FormBuilder,
    public motelService: MotelService, public alertService: AlertService,
    public router: Router, public apiService: ApiService) {this.options = fb.group({
    hideRequired: false,
    floatLabel: 'auto',
  });
}

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  // stepper variable
  step1Completed = false;
  step2Completed = false;
  isLinear = true;
  img: Array<any> = [];

  ngOnInit() {
    this.apiService.resetImg();
    this.apiService.sessionExpired = false;
    this.alertService.numOfImage = 0;
    }
  onSubmit() {
    // get location from session
    if (this.apiService.sessionExpired) {
      this.resetImg();
    } else {
      if (this.motel.city === undefined || this.motel.district === undefined || this.motel.ward === undefined
        || this.motel.street === undefined
       ) {
        this.alertService.error('Please fill all off address input!');
      } else {
        this.apiService.stopRecord = true;
        this.motel.lat = localStorage.getItem('lat');
        this.motel.lng = localStorage.getItem('lng');
        this.motel.customer = JSON.parse(localStorage.getItem('currentUser'))._id;
        this.motel.img = this.img;
        this.motel.status = 0;
        this.motel.created_at = new Date();
        // remove session location
        localStorage.removeItem('lat');
        localStorage.removeItem('lng');
        this.motelService.create(this.motel).then(data => {
            this.apiService.listImg = []; // reset img session
            localStorage.setItem('sessionImg', '{}');
            this.apiService.resetImg(); // reset variable session
            const id = JSON.parse(data._body);
            this.router.navigate(['/item', id]);
            this.alertService.success(data.toString());
          },
          (err) => {this.alertService.error(err); });
      }
      }
  }
  openDialog(): void {
    this.expired = false;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {img: this.img}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  passData(model: any) {
    // console.log(model);
    model.forEach(element => {
      if (element.types[0] === 'administrative_area_level_1') {
        this.motel.city = element.long_name;
      }
      if (element.types[0] === 'administrative_area_level_2') {
        this.motel.district = element.long_name;
      }
      if (element.types[0] === 'sublocality_level_1') {
        this.motel.ward = element.long_name;
      }
      if (element.types[0] === 'route') {
        this.motel.street = element.long_name;
      }
      if (element.types[0] === 'street_number') {
        this.motel.add = element.long_name;
      }
    });

    console.log(this.motel);
  }
  deleteImg(fileName, index) {
    this.apiService.deleteImg(fileName).subscribe( (res) => {
      this.alertService.success('OK!');
      this.img.splice(index, 1);
      this.alertService.numOfImage -= 1;
    }, (err) => {
      this.alertService.error('Failed');
    });
  }
  complete() {
    this.stepper.next();
  }

  step_1_next() {
    const price = this.motel.price;
    const contact = this.motel.contact;
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
  resetImg() {
      this.expired = true;
      this.img = [];
      this.alertService.numOfImage = 0;
      this.apiService.resetImg();
      this.expired = true;
  }
  step_2_next() {
    console.log(this.apiService.sessionExpired);
    if (this.apiService.sessionExpired) {
      this.resetImg();
    } else {
      const category = this.motel.category;
      if (!category) {
        this.step2Completed = false;
        this.alertService.error('please fill required inputs');
      }else {
        const area = this.motel.area;
        if (!area) {
          this.step2Completed = false;
          this.alertService.error('please fill required inputs');
        } else {
          this.step2Completed = true;
          this.alertService.success('Everything is ok ');
          setTimeout(() => {
            this.stepper.next();
          }, 2);
        }
      }
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./dialog-overview-example-dialog.css'],
})
export class DialogOverviewExampleDialog {
  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: Boolean = false;
  public hasAnotherDropZoneOver: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    alertService: AlertService, apiService: ApiService) {
      this.uploader.onCompleteItem = (item: FileItem, response: string, status: number) => {
        console.log(status);
        if (status === 200) {
          this.data.img.push(response);
          alertService.numOfImage += 1;
          alertService.typeUpload = true;
          alertService.success('insert success');
          // timer zone
          apiService.listImg.push(response);
          console.log(localStorage.getItem('sessionImg'));
          let ssImg = JSON.parse(localStorage.getItem('sessionImg'));
          ssImg[response] = response;
          localStorage.setItem('sessionImg', JSON.stringify(ssImg));
          
          if (apiService.starRecord === false) {
            apiService.starRecord = true;
            apiService.startRecord();
          }
          this.dialogRef.close();
        } else {
          let rs = JSON.parse(response);
          console.log(rs);
          if(rs.code === 'LIMIT_FILE_SIZE') {
            alertService.error('File must be less than 1MB');
          } else {
            alertService.error('Please use file with format .jpg or .png');
          }
        }
      };
      this.uploader.onErrorItem = (item: FileItem, response: string, status: number) => {
        alertService.error(response);
        console.log(response);
      };
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}
