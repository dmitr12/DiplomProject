import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import {AuthService} from "../../services/auth/auth.service";
import * as moment from "moment";
import {MusicComment} from "../../models/comments/musicComment";
import {MusicCommentResult} from "../../models/comments/musicCommentResult";
import {CommentsService} from "../../services/comments/comments.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-comment-card-child',
  templateUrl: './comment-card-child.component.html',
  styleUrls: ['./comment-card-child.component.css']
})
export class CommentCardChildComponent implements OnInit {

  @Input() data: MusicCommentInfo = null;
  currentUser = -1;
  isCommentAreaOpen = false;
  commentText = '';

  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.currentUser = Number(this.authService.getCurrentUserId());
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MMM-YYYY HH:mm');
  }

  comment() {
    if (this.commentText) {
      this.commentsService.musicCommentOn(new MusicComment(`${this.data.userLogin}, ${this.commentText}`, null,
        this.currentUser, this.data.musicId, this.data.parentIdComment)).subscribe((res: MusicCommentResult) => {
        this.commentText = '';
        this.isCommentAreaOpen = false;
      }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        } else if (error.status != 0) {
          this.matSnackBar.open(`При добавлении комментария возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      });
    }
  }

  showAnswerBox() {
    this.isCommentAreaOpen = !this.isCommentAreaOpen;
  }

  deleteComment() {
    this.commentsService.deleteMusicComment(this.data.idComment).subscribe((res: MusicCommentResult) => {
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      } else if (error.status != 0) {
        this.matSnackBar.open(`При удалении комментария возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }
}
