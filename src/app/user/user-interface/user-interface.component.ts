import { Component, OnInit } from '@angular/core';
import { AuthenticationService, AlertService, LevelService } from '../../_services/index';
@Component({
  selector: 'app-user-interface',
  templateUrl: './user-interface.component.html',
  styleUrls: ['./user-interface.component.css']
})
export class UserInterfaceComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private levelService: LevelService) { }
  changePasswordFlag = false; // flag show card to change password
  color = 'primary';
  mode = 'determinate';
  value = 80; // progress spinner value
  maxExp = 60; // exp to level up
  step = 0;
  user: any = {};
  password: any = {}; // model to change password
  ngOnInit() {
    const id = JSON.parse(localStorage.getItem('currentUser'))._id;
    this.getUser(id);
    console.log(this.user);
  }
  getUser(id) {
    this.authService.findById(id)
      .subscribe( res => {
        this.user = res;
        this.maxExp = this.user.rating.level * 60 * 1.5;
        console.log(this.user.rating.exp);
        this.value = Math.trunc((this.user.rating.exp / this.maxExp) * 100);
      }, err => {
        this.alertService.error(err);
      });
  }
  update() {
    this.authService.update(JSON.parse(localStorage.getItem('currentUser'))._id, this.user)
      .subscribe(res => {
        this.alertService.success('Update success');
      }, err => {
        this.alertService.error(err);
      });
  }
  changePassword() {
    if (this.password.newPassword !== this.password.confirmPassword) {
      this.alertService.error('Password confirm incorect');
    } else {
      if (this.password.newPassword.lenght < 8 || this.password.confirmPassword.length < 8) {
        this.alertService.error('Password must have at least 8 character');
      } else {
        this.authService.changePassword(JSON.parse(localStorage.getItem('currentUser'))._id, this.password)
          .subscribe(res => {
            this.alertService.success('change success');
          }, err => {
            this.alertService.error(err);
          });
      }
    }
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
