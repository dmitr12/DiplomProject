import {Component, Input, OnInit} from '@angular/core';
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import * as moment from 'moment';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {

  @Input() data: MusicCommentInfo = null;
  @Input() children: MusicCommentInfo[];
  hiddenChild = true;

  constructor() { }

  ngOnInit() {
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MMM-YYYY HH:mm');
  }

  showChildren() {
    this.hiddenChild = !this.hiddenChild;
  }
}
