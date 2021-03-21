import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MusicService} from "../../../services/music/music.service";
import {finalize} from "rxjs/operators";
import {Music} from "../../../models/musics/music";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../../services/loader/loader.service";

@Component({
  selector: 'app-deletemusicform',
  templateUrl: './deletemusicform.component.html',
  styleUrls: ['./deletemusicform.component.css']
})
export class DeletemusicformComponent implements OnInit {

  loaded = false;
  postingQuery = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogSource: MatDialogRef<DeletemusicformComponent>,
    private musicService: MusicService,
    public loaderService: LoaderService,
    private matSnackBar: MatSnackBar
  ) {
    dialogSource.disableClose = true;
  }

  ngOnInit() {
  }

  delete() {
    this.postingQuery = true;
    this.musicService.deleteMusic(this.data).pipe(finalize(()=>{this.loaded = true; this.postingQuery = false})).subscribe(
      (res: any)=>{
        this.matSnackBar.open(`Запись успешно удалена`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При удалении музыки возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    )
  }
}
