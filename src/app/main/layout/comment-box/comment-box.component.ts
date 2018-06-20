import { Component, OnInit, Input } from '@angular/core';
import { CommentService, AlertService } from '../../../_services/index';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit {

  constructor( private commentService: CommentService, private alertService: AlertService) { }
  comment: any = {};
  options: FormGroup;
  @Input()motelID;
  ngOnInit() {
  }
  onSubmit() {
    if (this.comment.content && localStorage.getItem('currentUser')) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const name = user.firstname + ' ' +  user.lastname;
      this.comment.customer_name = name;
      this.comment.customer_id = user._id;
      this.comment.created_at = new Date();
      this.comment.motel_id = this.motelID;
      this.commentService.comment(this.comment).subscribe(res => {
        this.alertService.success('Thanks for your contribution, it will be checked before show in this location');
      }, err => {
        this.alertService.error(err);
      });
    } else {
      this.alertService.error('Please log in!');
    }
  }

}
