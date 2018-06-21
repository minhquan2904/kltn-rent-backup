import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../../_services/index';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  constructor(private commentService: CommentService, private route: ActivatedRoute) { }
  @Input()motelID;
  motel_id: any;
  comments: any = [];
  ngOnInit() {
    this.motel_id = this.route.snapshot.params['id'];
    this.getCommentList();
  }
  getCommentList() {
    this.commentService.findByMotel(this.motel_id).then( res => {
      this.comments = res;
      console.log(res);
    }, err => {
    });


  }
}
