import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddplaylistformComponent} from "../../../components/playlists/addplaylistform/addplaylistform.component";
import {PlaylistInfo} from "../../../models/playlists/playlistInfo";
import {PlaylistService} from "../../../services/playlist/playlist.service";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  loadedPage = false;
  dialogSource: any;
  playlistsInfo: PlaylistInfo[];
  filteredPlaylists: PlaylistInfo[];
  filterString = '';

  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private playlistService: PlaylistService
  ) { }

  ngOnInit() {
    this.playlistService.getUserPlaylists().pipe(finalize(()=>this.loadedPage=true)).subscribe((res:PlaylistInfo[])=>{
      this.playlistsInfo = res;
      this.playlistsInfo.forEach(p=>p.createDate = new Date(p.createDate));
      this.filteredPlaylists = this.playlistsInfo;
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      } else if (error.status != 0) {
        this.matSnackBar.open(`При получении плейлистов возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

  addPlaylist() {
    const dialogConfig = new MatDialogConfig();
    this.dialogSource = this.dialog.open(AddplaylistformComponent, dialogConfig);
    this.dialogSource.afterClosed().subscribe(result => {
      if (result !== 'false'){
        this.loadedPage = false;
        this.playlistService.getPlaylistInfo(result).pipe(finalize(()=> this.loadedPage = true)).subscribe((res: PlaylistInfo)=>{
          this.playlistsInfo = this.playlistsInfo.concat(res);
          this.search(this.filterString);
        }, error => {
          if(error.status == 401){
            this.router.navigate(['auth']);
          }
          if (error.status != 0) {
            this.matSnackBar.open(`При получении плейлиста возникла ошибка, статусный код ${error.status}`, '', {
              duration: 3000,
              panelClass: 'custom-snack-bar-error'
            });
          } else {
            this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
          }
        })
      }
    });
  }

  getPlaylistEditor(playlistId: number) {
    this.router.navigate(['playlist-editor', `${playlistId}`]);
  }

  search(data: string) {
    this.loadedPage = false;
    this.filterString = data;
    this.filteredPlaylists = this.playlistsInfo.filter(p=>p.playlistName.toLowerCase().includes(data.toLowerCase()));
    this.loadedPage = true;
  }
}
