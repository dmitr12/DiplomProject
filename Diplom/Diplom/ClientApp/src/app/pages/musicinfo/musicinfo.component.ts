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

@Component({
  selector: 'app-musicinfo',
  templateUrl: './musicinfo.component.html',
  styleUrls: ['./musicinfo.component.css']
})
export class MusicinfoComponent implements OnInit {

  @ViewChild("ratingComponent", {static: false}) ratingComponent: StarRatingComponent;

  musicInfo: MusicInfo;
  loadedPage = false;
  private musicId: number;
  private subscription: Subscription;
  isRateReadOnly = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private signarService: SignalrService,
    private musicService: MusicService
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.musicId = params['id']);
  }

  ngOnInit() {
    this.musicService.getMusic(this.musicId).pipe(finalize(() => this.loadedPage = true)).subscribe((res: MusicInfo) => {
      this.musicInfo = res;
      this.musicInfo.dateOfPublication = new Date(res.dateOfPublication);
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      }
      else if (error.status != 0) {
        this.matSnackBar.open(`При получении информации о музыки возникла ошибка, статусный код ${error.status}`, '', {
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
      }
      else if (error.status != 0) {
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
    this.router.navigate(['search'], {queryParams:{
      'genreId': this.musicInfo.genreId
      }});
  }
}
