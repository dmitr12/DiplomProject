import {Component, Input, OnInit} from '@angular/core';
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import * as moment from 'moment';
import {AuthService} from "../../services/auth/auth.service";
import {MusicComment} from "../../models/comments/musicComment";
import {CommentChangedType, MusicCommentResult} from "../../models/comments/musicCommentResult";
import {CommentsService} from "../../services/comments/comments.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SignalrService} from "../../services/signalr/signalr.service";

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {

  @Input() data: MusicCommentInfo = null;
  @Input() children: MusicCommentInfo[] = [];
  @Input() musicId = -1;
  childrenArr: MusicCommentInfo[] = [];
  hiddenChild = true;
  currentUser = -1;
  isCommentAreaOpen = false;
  commentText = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private commentsService: CommentsService,
    private signalrService: SignalrService
  ) {

  }

  ngOnInit() {
    this.currentUser = Number(this.authService.getCurrentUserId());
    this.childrenArr = this.children;
    this.signalrService.commentMusicSignal.subscribe((signal: MusicCommentResult) => {
      if (signal.result && signal.musicCommentInfo.parentIdComment === this.data.idComment) {
        switch (signal.commentChangedType) {
          case CommentChangedType.added:
            this.childrenArr = this.childrenArr.concat(signal.musicCommentInfo);
            break;
          case CommentChangedType.deleted:
            const index = this.childrenArr.findIndex(item => item.idComment == signal.musicCommentInfo.idComment)
            this.childrenArr.splice(index, 1);
            break;
        }
      }
    });
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MMM-YYYY HH:mm');
  }

  showChildren() {
    this.hiddenChild = !this.hiddenChild;
  }

  comment() {
    if (this.commentText) {
      this.commentsService.musicCommentOn(new MusicComment(`${this.data.userLogin}, ${this.commentText}`, null,
        this.currentUser, Number(this.musicId), this.data.idComment)).subscribe((res: MusicCommentResult) => {
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

  check() {
    console.log(this.childrenArr)
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
