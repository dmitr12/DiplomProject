import { Component, OnInit } from '@angular/core';
import {PlaylistInfo} from "../../../models/playlists/playlistInfo";
import {MusicInfo} from "../../../models/musics/musicInfo";
import {finalize} from "rxjs/operators";
import {PlaylistService} from "../../../services/playlist/playlist.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MusicService} from "../../../services/music/music.service";

@Component({
  selector: 'app-playlist-info',
  templateUrl: './playlist-info.component.html',
  styleUrls: ['./playlist-info.component.css']
})
export class PlaylistInfoComponent implements OnInit {
  playlistInfoLoaded: boolean;
  musicLoaded: boolean;
  imgLoaded: boolean;
  playlistId: number;
  playlistInfo: PlaylistInfo;
  musicsPlaylist: MusicInfo[];
  subscription: Subscription;
  image: string;
  itemsPage: number;
  page: number;
  totalRecords: string;

  constructor(
    private playlistService: PlaylistService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private musicService: MusicService,
    private router: Router
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.playlistId = params['id']);

    activatedRoute.params.subscribe(val=>{
      this.playlistInfoLoaded = false;
      this.musicLoaded = false;
      this.imgLoaded = false;
      this.itemsPage = 8;
      this.page = 1;

      this.playlistService.getPlaylistInfo(this.playlistId).pipe(finalize(()=>this.playlistInfoLoaded = true)).subscribe((res:PlaylistInfo)=>{
        this.playlistInfo = res;
        this.image = this.playlistInfo.playlistImageUrl;
        this.playlistInfo.createDate = new Date(this.playlistInfo.createDate);
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении информации о плейлисте возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      });

      this.musicService.getMusicByPlaylist(this.playlistId).pipe(finalize(()=>this.musicLoaded = true)).subscribe((res: MusicInfo[])=>{
        this.musicsPlaylist = res;
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении музыки плейлиста возникла ошибка, статусный код ${error.status}`, '', {
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
  }

  posterLoaded() {
    this.imgLoaded = true;
  }

  userProfile(userId: number) {
    this.router.navigate(['profile',`${userId}`]);
  }
}
