import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MusicService} from "../../../services/music/music.service";
import {LoaderService} from "../../../services/loader/loader.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PlaylistService} from "../../../services/playlist/playlist.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-deleteplaylist',
  templateUrl: './deleteplaylist.component.html',
  styleUrls: ['./deleteplaylist.component.css']
})
export class DeleteplaylistComponent implements OnInit {

  loaded = false;
  postingQuery = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogSource: MatDialogRef<DeleteplaylistComponent>,
    private playlistService: PlaylistService,
    public loaderService: LoaderService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    dialogSource.disableClose = true;
  }

  ngOnInit() {
  }

  delete() {
    this.postingQuery = true;
    this.playlistService.deletePlaylist(this.data).pipe(finalize(()=>{this.loaded = true; this.postingQuery = false})).subscribe(
      (res: any)=>{
        this.matSnackBar.open(`Плейлист успешно удален`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
        this.dialogSource.close();
      }, error => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        else if(error.status == 403){
          this.matSnackBar.open('Пользователь не имеет права редактировать данный плейлист', '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
        }
        else if (error.status == 404){
          this.matSnackBar.open(error.error.msg, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
        }
        else if (error.status != 0) {
          this.matSnackBar.open(`При удалении плейлиста возникла ошибка`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    )
  }
}
