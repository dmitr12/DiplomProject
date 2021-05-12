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
import {UserRole} from "../../models/users/user";

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
  currentUser: number;
  currnetUserRole: UserRole;
  isCommentAreaOpen = false;
  isCommentEditAreaOpen = false;
  commentText = '';
  commentEditText: string;
  isUserAuthenticated: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private commentsService: CommentsService,
    private signalrService: SignalrService
  ) {
    this.isUserAuthenticated = this.authService.isAuth();
  }

  ngOnInit() {
    this.commentEditText = this.data.comment;
    if(this.isUserAuthenticated){
      this.currentUser = Number(this.authService.getCurrentUserId());
      this.currnetUserRole = Number(this.authService.getCurrentUserRole());
    }
    this.childrenArr = this.children;
    this.signalrService.commentMusicSignal.subscribe((signal: MusicCommentResult) => {
      if (signal.result && signal.musicCommentInfo.parentIdComment === this.data.idComment) {
        switch (signal.commentChangedType) {
          case CommentChangedType.added:
            this.childrenArr = this.childrenArr.concat(signal.musicCommentInfo);
            break;
          case CommentChangedType.deleted:
            const indexForDelete = this.childrenArr.findIndex(item => item.idComment == signal.musicCommentInfo.idComment)
            this.childrenArr.splice(indexForDelete, 1);
            break;
          case CommentChangedType.edited:
            const indexForEdit = this.childrenArr.findIndex(item => item.idComment == signal.musicCommentInfo.idComment)
            this.childrenArr[indexForEdit].comment = signal.musicCommentInfo.comment;
            break;
        }
      }
    });
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MM-YYYY HH:mm');
  }

  showChildren() {
    if(this.childrenArr.length>0){
      this.isCommentAreaOpen = false;
      this.isCommentEditAreaOpen = false;
    }
    this.hiddenChild = !this.hiddenChild;
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
    if(this.commentEditText.trim()) {
      const musicComment = this.data;
      musicComment.comment = this.commentEditText;
      this.commentsService.editMusicComment(musicComment).subscribe((res: MusicCommentResult) => {
        this.commentEditText = res.musicCommentInfo.comment;
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
    this.commentEditText = this.data.comment;
    this.isCommentAreaOpen = false
    this.isCommentEditAreaOpen = !this.isCommentEditAreaOpen;
  }

  enableDeleteComment(): boolean{
    return this.currentUser == this.data.userId || this.currnetUserRole == UserRole.Admin;
  }
}
