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
import {Guid} from "guid-typescript";
import {MusicComment} from "../../models/comments/musicComment";
import {CommentChangedType, MusicCommentResult} from "../../models/comments/musicCommentResult";
import {AudioService} from "../../services/player/audio.service";
import {UserRole} from "../../models/users/user";
import {SearchType} from "../../models/search";

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
  firstComments: MusicCommentInfo[];
  secondComments: MusicCommentInfo[];
  isCommentAreaOpen: boolean;
  commentText: string;
  currentUserId: number;
  currentUserRole: UserRole;
  hiddenComments: boolean;
  deletingMusic: boolean;
  imageLoaded: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private signarService: SignalrService,
    private commentsService: CommentsService,
    private musicService: MusicService,
    public audioService: AudioService
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.musicId = params['id']);
    activatedRoute.params.subscribe(val=>{
      this.loadedMusicInfo = false;
      this.loadedComments = false;
      this.musicCommentsInfo = [];
      this.isRateReadOnly = false;
      this.firstComments = [];
      this.secondComments = [];
      this.isRateReadOnly = false;
      this.commentText = '';
      this.hiddenComments = true;
      this.deletingMusic = false;
      this.imageLoaded = false;

      this.musicService.getMusic(this.musicId).pipe(finalize(() => this.loadedMusicInfo = true)).subscribe((res: MusicInfo) => {
        this.musicInfo = res;
        this.musicInfo.dateOfPublication = new Date(res.dateOfPublication);
      }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        } else if (error.status != 0) {
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
        this.firstComments = this.musicCommentsInfo.filter(c => c.parentIdComment === null);
        this.secondComments = this.musicCommentsInfo.filter(c => !this.firstComments.includes(c));
      }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        } else if (error.status != 0) {
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
    this.currentUserId = Number(this.authService.getCurrentUserId());
    this.currentUserRole = Number(this.authService.getCurrentUserRole());

    this.signarService.commentMusicSignal.subscribe((signal: MusicCommentResult) => {
      if (signal.result && signal.musicCommentInfo.parentIdComment === null) {
        switch (signal.commentChangedType) {
          case CommentChangedType.added:
            this.firstComments.unshift(signal.musicCommentInfo);
            break;
          case CommentChangedType.deleted:
            const indexForDelete = this.firstComments.findIndex(item => item.idComment == signal.musicCommentInfo.idComment)
            this.firstComments.splice(indexForDelete, 1);
            break;
          case CommentChangedType.edited:
            const indexForEdit = this.firstComments.findIndex(item => item.idComment == signal.musicCommentInfo.idComment)
            this.firstComments[indexForEdit].comment = signal.musicCommentInfo.comment;
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

  play() {
    console.log(this.musicInfo)
    let date = new Date(this.musicInfo.dateOfPublication);
    console.log(date);
  }

  onRate(event: { oldValue: number; newValue: number; starRating: StarRatingComponent }) {
    this.ratingComponent.readonly = true;
    this.signarService.rateMusic(new MusicStarRating(Number(this.musicId), Number(this.authService.getCurrentUserId()), event.newValue))
      .pipe(finalize(() => this.ratingComponent.readonly = false)).subscribe((res: RatedMusicResult) => {
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      } else if (error.status != 0) {
        this.matSnackBar.open(`При оценивании музыки возникла ошибка, статусный код ${error.status}`, '', {
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

  getChildrenComments(idComment: Guid) {
    return this.secondComments.filter(c => c.parentIdComment === idComment).sort(function (a, b) {
      return new Date(a.commentDate).getTime() - new Date(b.commentDate).getTime();
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

  openCommentArea() {
    this.isCommentAreaOpen = !this.isCommentAreaOpen;
  }

  showComments() {
    if(this.firstComments.length > 0)
      this.isCommentAreaOpen = false;
    this.hiddenComments = !this.hiddenComments;
  }

  playMusic() {
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
}
