import { Component, OnInit } from '@angular/core';
import {MusicService} from "../../services/music/music.service";
import {MusicInfo} from "../../models/musics/musicInfo";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {PlaylistInfo} from "../../models/playlists/playlistInfo";
import {PlaylistService} from "../../services/playlist/playlist.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  musics: MusicInfo[] = [];
  playlists: PlaylistInfo[] = [];
  totalRecords: string | number;
  new_musics_page = 1;
  new_playlists_page = 1

  newMusicsLoaded = false;
  newPlaylistsLoaded = false;

  constructor(
    private musicService: MusicService,
    private playlistService: PlaylistService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.musicService.getNewMusics().pipe(finalize(()=>this.newMusicsLoaded = true)).subscribe((res:MusicInfo[])=>{
      this.musics = res;
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении новых песен возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });

    this.playlistService.getNewPlaylists().pipe(finalize(()=>this.newPlaylistsLoaded = true)).subscribe((res:PlaylistInfo[])=>{
      this.playlists = res;
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении новых плейлистов возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

  navigateMusicInfo(id: number) {
    this.router.navigate(['musicinfo',`${id}`]);
  }

  navigatePlaylistInfo(playlistId: number) {
    this.router.navigate(['playlist-info',`${playlistId}`]);
  }
}
