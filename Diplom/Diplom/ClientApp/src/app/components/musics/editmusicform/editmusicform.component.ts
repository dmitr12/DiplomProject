import {Component, Inject, OnInit} from '@angular/core';
import {MusicGenreInfo} from "../../../models/musics/musicGenreInfo";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MusicService} from "../../../services/music/music.service";
import {LoaderService} from "../../../services/loader/loader.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize} from "rxjs/operators";
import {MusicInfo} from "../../../models/musics/musicInfo";
import {Router} from "@angular/router";

@Component({
  selector: 'app-editmusicform',
  templateUrl: './editmusicform.component.html',
  styleUrls: ['./editmusicform.component.css']
})
export class EditmusicformComponent implements OnInit {

  genres: MusicGenreInfo[] = [];
  loaded = false;
  postingQuery = false;

  form: any;
  formData: FormData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MusicInfo,
    private dialogSource: MatDialogRef<EditmusicformComponent>,
    private musicService: MusicService,
    public loaderService: LoaderService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    dialogSource.disableClose = true;
    this.form = new FormGroup({
      musicName: new FormControl(data.name, [Validators.required, Validators.maxLength(100)]),
      musicFileName: new FormControl(null),
      musicImageName: new FormControl(null),
      musicGenreId: new FormControl(data.genreId, [Validators.required])
    })
  }
  ngOnInit() {
    this.formData = new FormData();
    this.formData.append("Id", this.data.id.toString())
    this.musicService.getMusicGenres().pipe(finalize(() => this.loaded = true)).subscribe((res: MusicGenreInfo[]) => {
      this.genres = res;
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении жанров возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
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

  editMusic() {
    let fileImageName;
    let fileMusicName;
    if (this.form.value.musicImageName == null)
      fileImageName = '';
    else
      fileImageName = this.musicService.getFileNameByPath(this.form.value.musicImageName)
    if (this.form.value.musicFileName == null)
      fileMusicName = '';
    else
      fileMusicName = this.musicService.getFileNameByPath(this.form.value.musicFileName)
    if (fileMusicName) {
      if (!this.musicService.checkFileFormat(fileMusicName, "mp3")) {
        this.matSnackBar.open(`Выбран неверный формат аудиозаписи`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        return;
      }
    }
    if (fileImageName) {
      if (!this.musicService.checkFileFormat(fileImageName, 'png') && !this.musicService.checkFileFormat(fileImageName, 'jpg')) {
        this.matSnackBar.open(`Выбран неверный формат изображения`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        return;
      }
    }
    this.formData.delete("MusicGenreId");
    this.formData.delete("MusicName");
    this.formData.append("MusicGenreId", this.form.value.musicGenreId);
    this.formData.append("MusicName", this.form.value.musicName);
    this.postingQuery = true;
    this.musicService.editMusic(this.formData).subscribe((response: any) => {
        this.postingQuery = false;
        if(response && response.msg){
          this.matSnackBar.open(`${response.msg}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Запись успешно обновлена`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
          this.dialogSource.close();
        }
      },
      error => {
        this.postingQuery = false;
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        if(error.status != 0){
          this.matSnackBar.open(`При отправке запроса возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    );
  }

}
