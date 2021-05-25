import {Component, Input, OnInit} from '@angular/core';
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import * as moment from 'moment';
import {AuthService} from "../../services/auth/auth.service";
import {MusicComment} from "../../models/comments/musicComment";
import {MusicCommentResult} from "../../models/comments/musicCommentResult";
import {CommentsService} from "../../services/comments/comments.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRole} from "../../models/users/user";

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {

  @Input() data: MusicCommentInfo = null;
  @Input() musicId = -1;
  @Input() parentUserLogin: string = null;
  childrenArr: MusicCommentInfo[] = [];
  hiddenChild = true;
  currentUser: number;
  currnetUserRole: UserRole;
  isCommentAreaOpen = false;
  isCommentEditAreaOpen = false;
  commentText = '';
  commentEditText = '';
  isUserAuthenticated: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private commentsService: CommentsService
  ) {
    this.isUserAuthenticated = this.authService.isAuth();
  }

  ngOnInit() {
    if(this.isUserAuthenticated){
      this.currentUser = Number(this.authService.getCurrentUserId());
      this.currnetUserRole = Number(this.authService.getCurrentUserRole());
    }
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MM-YYYY HH:mm');
  }

  comment() {
    if (this.commentText.trim()) {
      this.commentsService.musicCommentOn(new MusicComment(`${this.data.userLogin}, ${this.commentText}`, null,
        this.currentUser, Number(this.musicId), this.data.idComment)).subscribe((res: MusicCommentResult) => {
        this.commentText = '';
        this.isCommentAreaOpen = false;
      }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        } else if (error.status != 0) {
          this.matSnackBar.open(`При добавлении комментария возникла ошибка`, '', {
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
        this.matSnackBar.open(`При удалении комментария возникла ошибка`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  commentEdit() {
    if(this.commentEditText.trim()) {
      const musicComment = this.data;
      if(this.parentUserLogin !== null){
        musicComment.comment = `${this.parentUserLogin}, ${this.commentEditText}`
      }
      else{
        musicComment.comment = this.commentEditText;
      }
      this.commentsService.editMusicComment(musicComment).subscribe((res: MusicCommentResult) => {
        this.commentEditText = res.musicCommentInfo.comment;
        this.isCommentEditAreaOpen = false;
      }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        } else if (error.status != 0) {
          this.matSnackBar.open(`При изменении комментария возникла ошибка`, '', {
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
    if(this.parentUserLogin !== null){
      this.commentEditText = this.data.comment.replace(`${this.parentUserLogin}, `,'');
    }
    else{
      this.commentEditText = this.data.comment;
    }
    this.isCommentAreaOpen = false
    this.isCommentEditAreaOpen = !this.isCommentEditAreaOpen;
  }

  enableDeleteComment(): boolean{
    return this.currentUser == this.data.userId || this.currnetUserRole == UserRole.Admin;
  }

  navigateProfile(userId: number) {
    this.router.navigate(['profile',`${userId}`]);
  }
}
