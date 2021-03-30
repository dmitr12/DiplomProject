import {Component, OnInit, ViewChild} from '@angular/core';
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
import {MusicCommentResult} from "../../models/comments/musicCommentResult";
import * as moment from 'moment';

@Component({
  selector: 'app-musicinfo',
  templateUrl: './musicinfo.component.html',
  styleUrls: ['./musicinfo.component.css']
})
export class MusicinfoComponent implements OnInit {

  @ViewChild("ratingComponent", {static: false}) ratingComponent: StarRatingComponent;

  musicInfo: MusicInfo;
  musicCommentsInfo: MusicCommentInfo[] = [];
  loadedMusicInfo = false;
  loadedComments = false;
  private musicId: number;
  private subscription: Subscription;
  isRateReadOnly = false;
  firstComments: MusicCommentInfo[] = [];
  secondComments: MusicCommentInfo[] = [];
  isCommentAreaOpen = false;
  commentText = '';
  currentUserId = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private signarService: SignalrService,
    private commentsService: CommentsService,
    private musicService: MusicService
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.musicId = params['id']);
  }

  ngOnInit() {
    this.currentUserId = Number(this.authService.getCurrentUserId());
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

    this.signarService.ratedMusicSignal.subscribe((signal: RatedMusicResult) => {
      if (signal.ratedMusic) {
        this.musicInfo.rating = signal.rating;
        this.musicInfo.countRatings = signal.countRatings;
      }
    })
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
        'genreId': this.musicInfo.genreId
      }
    });
  }

  getChildrenComments(idComment: Guid) {
    return this.secondComments.filter(c => c.parentIdComment === idComment).sort(function (a, b) {
      return new Date(a.commentDate).getTime() - new Date(b.commentDate).getTime();
    });
  }

  comment() {
    if (this.commentText) {
      this.commentsService.musicCommentOn(new MusicComment(this.commentText, (moment(new Date())).format('yyyy-MM-DDTHH:mm:ss'),
        this.currentUserId, Number(this.musicId), null)).subscribe((res: MusicCommentResult) => {
          alert("Коммент добавлен");
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
}
