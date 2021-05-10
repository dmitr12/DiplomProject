import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import {AuthService} from "../../services/auth/auth.service";
import * as moment from "moment";
import {MusicComment} from "../../models/comments/musicComment";
import {MusicCommentResult} from "../../models/comments/musicCommentResult";
import {CommentsService} from "../../services/comments/comments.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRole} from "../../models/users/user";

@Component({
  selector: 'app-comment-card-child',
  templateUrl: './comment-card-child.component.html',
  styleUrls: ['./comment-card-child.component.css']
})
export class CommentCardChildComponent implements OnInit {

  @Input() data: MusicCommentInfo = null;
  currentUser = -1;
  isCommentAreaOpen = false;
  isCommentEditAreaOpen = false;
  commentText = '';
  commentEditText: string;
  currnetUserRole: UserRole;
  isUserAuthenticated: boolean;

  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.isUserAuthenticated = this.authService.isAuth();
  }

  ngOnInit() {
    this.commentEditText = this.data.comment.replace(`${this.data.userLogin}, `,'');
    if(this.isUserAuthenticated){
      this.currentUser = Number(this.authService.getCurrentUserId());
      this.currnetUserRole = Number(this.authService.getCurrentUserRole());
    }
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
    this.isCommentEditAreaOpen = false
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

  commentEdit() {
    if(this.commentEditText) {
      const musicComment = this.data;
      musicComment.comment = `${this.data.userLogin}, ${this.commentEditText}`;
      this.commentsService.editMusicComment(musicComment).subscribe((res: MusicCommentResult) => {
        this.commentEditText = res.musicCommentInfo.comment.replace(`${res.musicCommentInfo.userLogin}, `,'');
        this.isCommentEditAreaOpen = false;
      }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        } else if (error.status != 0) {
          this.matSnackBar.open(`При изменении комментария возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      });
    }
  }

  showEditBox() {
    this.commentEditText = this.data.comment.replace(`${this.data.userLogin}, `,'');
    this.isCommentAreaOpen = false
    this.isCommentEditAreaOpen = !this.isCommentEditAreaOpen;
  }

  enableDeleteComment(): boolean{
    return this.currentUser == this.data.userId || this.currnetUserRole == UserRole.Admin;
  }
}
