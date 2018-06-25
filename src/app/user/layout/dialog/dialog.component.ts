import {Component, Inject, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
// import {Course} from '../model/course';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';

import { Motel } from '../../../_models/index';
import * as moment from 'moment';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    providers: [{
        provide: MatDialogRef,
        useValue: {}
      }, {
        provide: MAT_DIALOG_DATA,
        useValue: {
            data: this.data
        } // Add any data you wish to test if it is passed/used correctly
      }]
})
export class CourseDialogComponent implements OnInit {

    form: FormGroup;
    description: string;

    // @Input('motel') motel: Motel;
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
        console.log(this.data);
    }


    save() {
        // this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

}