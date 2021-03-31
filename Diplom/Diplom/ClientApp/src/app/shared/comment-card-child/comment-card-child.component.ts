import {Component, Input, OnInit} from '@angular/core';
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import {AuthService} from "../../services/auth/auth.service";
import * as moment from "moment";

@Component({
  selector: 'app-comment-card-child',
  templateUrl: './comment-card-child.component.html',
  styleUrls: ['./comment-card-child.component.css']
})
export class CommentCardChildComponent implements OnInit {

  @Input() data: MusicCommentInfo = null;
  currentUser = -1;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = Number(this.authService.getCurrentUserId());
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MMM-YYYY HH:mm');
  }
}
