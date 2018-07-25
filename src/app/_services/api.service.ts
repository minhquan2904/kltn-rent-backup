import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  // timer
  countDown;
  count = 300;
  listImg: Array<any> = [];
  starRecord: Boolean = false;
  stopRecord: Boolean = false;
  public sessionExpired: Boolean = false;
  constructor(public http: Http) { }
  deleteImg(fileName) {
    return this.http.delete('/uploadImg/' + fileName);
  }
  startRecord() {
    this.sessionExpired = false;
    timer(0, 1000).pipe(
      map(i => this.count - i),
      take(this.count + 1)) // timer(firstValueDelay, intervalBetweenValues)
    .subscribe(i => {
      if (i === 0 && !this.stopRecord) {
        this.resetImg();
      }
    });
  }

  resetImg() {
    let session = JSON.parse(localStorage.getItem('sessionImg'));
    Object.keys(session).forEach( item => {
      console.log(session[item]);
      this.deleteImg(session[item]).subscribe( res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    });
    this.count = 300;
    this.starRecord = false;
    this.sessionExpired = true;
    this.stopRecord = false;
    const sessionImg = {};
    localStorage.setItem('sessionImg', JSON.stringify(sessionImg));
    console.log(this.sessionExpired);
  }
}
