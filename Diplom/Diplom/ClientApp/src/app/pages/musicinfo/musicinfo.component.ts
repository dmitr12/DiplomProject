import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MusicInfo} from "../../models/musics/musicInfo";
import {MusicService} from "../../services/music/music.service";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StarRatingComponent} from "ng-starrating";
import {MusicStarRating} from "../../models/musics/musicStarRating";
import {AuthService} from "../../services/auth/auth.service";
import {RatedMusicResult} from "../../models/musics/ratedMusicResult";
import {SignalrService} from "../../services/signalr/signalr.service";
import {CommentsService} from "../../services/comments/comments.service";
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import {MusicComment} from "../../models/comments/musicComment";
import {CommentChangedType, MusicCommentResult} from "../../models/comments/musicCommentResult";
import {AudioService} from "../../services/player/audio.service";
import {UserRole} from "../../models/users/user";
import {SearchType} from "../../models/search";
import {Guid} from "guid-typescript";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddcomplaintformComponent} from "../../components/complaints/addcomplaintform/addcomplaintform.component";
import {ComplaintService} from "../../services/complaints/complaint.service";

@Component({
  selector: 'app-musicinfo',
  templateUrl: './musicinfo.component.html',
  styleUrls: ['./musicinfo.component.css']
})
export class MusicinfoComponent implements OnInit, OnDestroy {

  @ViewChild("ratingComponent", {static: false}) ratingComponent: StarRatingComponent;

  musicInfo: MusicInfo;
  musicCommentsInfo: MusicCommentInfo[];
  loadedMusicInfo: boolean;
  loadedComments = false;
  public musicId: number;
  private subscription: Subscription;
  isRateReadOnly;
  isCommentAreaOpen: boolean;
  commentText: string;
  currentUserId: number;
  currentUserRole: UserRole;
  hiddenComments: boolean;
  deletingMusic: boolean;
  imageLoaded: boolean;
  isUserAuthenticated: boolean;
  notFound: boolean;
  notFoundMessage = 'Информация о музыке не найдена. Возможно ресурс был удален';
  dialogSource: any;
  isCurrentUserComplained: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private signarService: SignalrService,
    private commentsService: CommentsService,
    private musicService: MusicService,
    public audioService: AudioService,
    private dialog: MatDialog,
    private complaintService: ComplaintService
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.musicId = params['id']);

    activatedRoute.params.subscribe(val=>{
      this.isUserAuthenticated = this.authService.isAuth();
      this.loadedMusicInfo = false;
      this.loadedComments = false;
      this.musicCommentsInfo = [];
      this.isRateReadOnly = false;
      this.isRateReadOnly = false;
      this.commentText = '';
      this.hiddenComments = true;
      this.deletingMusic = false;
      this.imageLoaded = false;
      this.notFound = false;

      this.musicService.getMusic(this.musicId).pipe(finalize(() => this.loadedMusicInfo = true)).subscribe((res: MusicInfo) => {
        if(res === null){
          this.notFound = true;
        }
        else{
          this.musicInfo = res;
          this.musicInfo.dateOfPublication = new Date(res.dateOfPublication);
        }
      }, error => {
          if (error.status != 0) {
          this.matSnackBar.open(`При получении информации о музыки возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      });

      this.commentsService.getCommentsForMusic(this.musicId).pipe(finalize(() => this.loadedComments = true)).subscribe((res: MusicCommentInfo[]) => {
        this.musicCommentsInfo = res;
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении комментариев возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      });
    })
  }

  ngOnInit() {
    if(this.isUserAuthenticated){
      this.currentUserId = Number(this.authService.getCurrentUserId());
      this.currentUserRole = Number(this.authService.getCurrentUserRole());
      this.complaintService.isUserComplained(this.currentUserId, Number(this.musicId)).subscribe((res:boolean)=>{
        this.isCurrentUserComplained = res;
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении информации о жалобах возникла ошибка`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      })
    }

    this.signarService.commentMusicSignal.subscribe((signal: MusicCommentResult) => {
      if (signal.result) {
        switch (signal.commentChangedType) {
          case CommentChangedType.added:
            this.musicCommentsInfo.push(signal.musicCommentInfo)
            break;
          case CommentChangedType.deleted:
            this.deleteSubComments(signal.musicCommentInfo.idComment);
            break;
          case CommentChangedType.edited:
            const indexForEdit = this.musicCommentsInfo.findIndex(item => item.idComment == signal.musicCommentInfo.idComment)
            this.musicCommentsInfo[indexForEdit].comment = signal.musicCommentInfo.comment;
            break;
        }
      }
    });

    this.signarService.ratedMusicSignal.subscribe((signal: RatedMusicResult) => {
      if (signal.ratedMusic) {
        this.musicInfo.rating = signal.rating;
        this.musicInfo.countRatings = signal.countRatings;
      }
    });
  }

  ngOnDestroy(): void {
  }

  onRate(event: { oldValue: number; newValue: number; starRating: StarRatingComponent }) {
    this.ratingComponent.readonly = true;
    this.signarService.rateMusic(new MusicStarRating(Number(this.authService.getCurrentUserId()), Number(this.musicId), event.newValue))
      .pipe(finalize(() => this.ratingComponent.readonly = false)).subscribe((res: RatedMusicResult) => {
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      } else if (error.status != 0) {
        this.matSnackBar.open(`При оценивании музыки возникла ошибка`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

  clickGenre(genreId: number) {
    this.router.navigate(['search'], {
      queryParams: {
        'genreId': this.musicInfo.genreId,
        'searchType': SearchType.Music
      }
    });
  }

  comment() {
    if (this.commentText.trim()) {
      this.commentsService.musicCommentOn(new MusicComment(this.commentText, null,
        this.currentUserId, Number(this.musicId), null)).subscribe((res: MusicCommentResult) => {
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

  openCommentArea() {
    this.isCommentAreaOpen = !this.isCommentAreaOpen;
  }

  showComments() {
    if(this.musicCommentsInfo.length > 0)
      this.isCommentAreaOpen = false;
    this.hiddenComments = !this.hiddenComments;
  }

  playMusic() {
    this.audioService.clearMusic();
    this.audioService.openFile(this.musicInfo.id, this.musicInfo.musicFileName, this.musicInfo.name)
  }

  enableDeleteMusic(): boolean{
    return this.currentUserId == this.musicInfo.userId || this.currentUserRole == UserRole.Admin;
  }

  deleteMusic() {
    this.deletingMusic = true;
    if(this.audioService.idMusic == this.musicInfo.id)
      this.audioService.clearMusic()
    this.musicService.deleteMusic(this.musicInfo.id).pipe(finalize(()=>{this.deletingMusic = false;})).subscribe(
      (res: any)=>{
        this.router.navigate(['search'])
        this.matSnackBar.open(`Запись успешно удалена`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      }, error => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        if (error.status != 0) {
          this.matSnackBar.open(`При удалении музыки возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    )
  }

  imgLoaded() {
    this.imageLoaded = true;
  }

  like() {
    this.deletingMusic = true;
    this.musicService.likeMusic(new MusicStarRating(this.currentUserId, this.musicInfo.id, 0, true)).pipe(finalize(()=>this.deletingMusic = false)).subscribe((res:any)=>{
      this.musicInfo.currentUserLiked = true;
    },  error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      if (error.status != 0) {
        this.matSnackBar.open(`При добавлении музыки в избранные возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  unlike() {
    this.deletingMusic = true;
    this.musicService.likeMusic(new MusicStarRating(this.currentUserId, this.musicInfo.id, 0, false)).pipe(finalize(()=>this.deletingMusic = false)).subscribe((res:any)=>{
      this.musicInfo.currentUserLiked = false;
    },  error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      if (error.status != 0) {
        this.matSnackBar.open(`При удалении музыки из избранных возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  getParentUserLogin(comment: MusicCommentInfo) {
    if(comment.parentIdComment !== null){
      const cmnt = this.musicCommentsInfo.find(c=>c.idComment == comment.parentIdComment);
      if(cmnt !== undefined){
        return cmnt.userLogin;
      }
    }
    return null;
  }

  private deleteSubComments(idComment: Guid) {
    const indexForDelete = this.musicCommentsInfo.findIndex(item => item.idComment == idComment);
    this.musicCommentsInfo.splice(indexForDelete, 1);
    const subComments = this.musicCommentsInfo.filter(c=>c.parentIdComment === idComment)
    for(let i=0; i<subComments.length; i++){
      this.deleteSubComments(subComments[i].idComment);
    }
  }

  addComplaint() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.musicId;
    this.dialogSource = this.dialog.open(AddcomplaintformComponent, dialogConfig);
    this.dialogSource.afterClosed().subscribe(result=>{
      if(result === true){
        this.isCurrentUserComplained = true;
      }
    });
  }

  navigateProfile(userId: number) {
    this.router.navigate(['/profile',`${userId}`]);
  }
}
