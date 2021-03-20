import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MusicService} from "../../../services/music/music.service";
import {MusicGenreInfo} from "../../../models/musics/musicGenreInfo";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxFileDropEntry} from "ngx-file-drop";
import {LoaderService} from "../../../services/loader/loader.service";

@Component({
  selector: 'app-addmusicform',
  templateUrl: './addmusicform.component.html',
  styleUrls: ['./addmusicform.component.css']
})

export class AddmusicformComponent implements OnInit {

  genres: MusicGenreInfo[] = [];
  loaded = false;
  postingQuery = false;

  form = new FormGroup({
    musicName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    musicFileName: new FormControl(null, [Validators.required]),
    musicImageName: new FormControl(null),
    musicGenreId: new FormControl(null, [Validators.required])
  })

  formData: FormData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private musicService: MusicService,
    private matSnackBar: MatSnackBar,
    public loaderService: LoaderService,
    private dialogSource: MatDialogRef<AddmusicformComponent>
  ) {
    dialogSource.disableClose = true;
  }

  ngOnInit() {
    this.formData = new FormData();
    this.musicService.getMusicGenres().pipe(finalize(() => this.loaded = true)).subscribe((res: MusicGenreInfo[]) => {
      this.genres = res;
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении жанров возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
      }
    })
  }

  changeImageFile(event: any) {
    this.formData.delete("MusicImageFile");
    this.formData.append("MusicImageFile", event.target.files[0], event.target.files[0].name);
  }

  changeMusicFile(event: any) {
    this.formData.delete("MusicFile");
    this.formData.append("MusicFile", event.target.files[0], event.target.files[0].name);
  }

  addMusic() {
    let fileImageName;
    let fileMusicName = this.musicService.getFileNameByPath(this.form.value.musicFileName);
    if (this.form.value.musicImageName === null)
      fileImageName = '';
    else
      fileImageName = this.musicService.getFileNameByPath(this.form.value.musicImageName)
    if (!this.musicService.checkFileFormat(fileMusicName, "mp3")) {
      this.matSnackBar.open(`Выбран неверный формат аудиозаписи`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
      return;
    }
    if (fileImageName) {
      if (!this.musicService.checkFileFormat(fileImageName, 'png') && !this.musicService.checkFileFormat(fileImageName, 'jpg')) {
        this.matSnackBar.open(`Выбран неверный формат изображения`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
        return;
      }
    }
    this.formData.delete("MusicGenreId");
    this.formData.delete("MusicName");
    this.formData.append("MusicGenreId", this.form.value.musicGenreId);
    this.formData.append("MusicName", this.form.value.musicName);
    this.postingQuery = true;
    this.musicService.addmusic(this.formData).subscribe((response: any) => {
      this.postingQuery = false;
        if (response && response.msg)
          this.matSnackBar.open(`${response.msg}`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
        else
          this.matSnackBar.open(`Запись успешно добавлена`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
      },
      error => {
        this.postingQuery = false;
        if(error.status != 0){
          this.matSnackBar.open(`При отправке запроса возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
        }      }
    );
  }
}

