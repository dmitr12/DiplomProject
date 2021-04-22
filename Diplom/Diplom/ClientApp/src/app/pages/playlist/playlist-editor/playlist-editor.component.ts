import { Component, OnInit } from '@angular/core';
import {PlaylistInfo} from "../../../models/playlists/playlistInfo";
import {PlaylistService} from "../../../services/playlist/playlist.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  styleUrls: ['./playlist-editor.component.css']
})
export class PlaylistEditorComponent implements OnInit {

  pageLoaded = false;
  playlistInfo: PlaylistInfo;
  subscription: Subscription;
  playlistId: number;

  constructor(
    private playlistService: PlaylistService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.playlistId = params['id']);
  }

  ngOnInit() {
    this.playlistService.getPlaylistInfo(this.playlistId).pipe(finalize(()=>this.pageLoaded = true)).subscribe((res:PlaylistInfo)=>{
      this.playlistInfo = res;
      this.playlistInfo.createDate = new Date(this.playlistInfo.createDate);
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      }
      else if (error.status != 0) {
        this.matSnackBar.open(`При получении информации о плейлисте возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

}
