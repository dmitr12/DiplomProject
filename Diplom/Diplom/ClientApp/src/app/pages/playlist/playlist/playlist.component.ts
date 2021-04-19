import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddmusicformComponent} from "../../../components/musics/addmusicform/addmusicform.component";
import {finalize} from "rxjs/operators";
import {MusicInfo} from "../../../models/musics/musicInfo";
import {AddplaylistformComponent} from "../../../components/playlists/addplaylistform/addplaylistform.component";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  dialogSource: any;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  addPlaylis() {
    const dialogConfig = new MatDialogConfig();
    this.dialogSource = this.dialog.open(AddplaylistformComponent, dialogConfig);
    // this.dialogSource.afterClosed().subscribe(result => {
    //   if (result !== 'false'){
    //     this.musicService.getMusic(result).pipe(finalize(()=> this.loaded = true)).subscribe((res:MusicInfo)=>{
    //       this.loaded = false;
    //       this.musics = this.musics.concat(res);
    //     }, error => {
    //       if(error.status == 401){
    //         this.router.navigate(['auth']);
    //       }
    //       if (error.status != 0) {
    //         this.matSnackBar.open(`При получении музыки возникла ошибка, статусный код ${error.status}`, '', {
    //           duration: 3000,
    //           panelClass: 'custom-snack-bar-error'
    //         });
    //       } else {
    //         this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
    //       }
    //     })
    //   }
    // });
  }
}
