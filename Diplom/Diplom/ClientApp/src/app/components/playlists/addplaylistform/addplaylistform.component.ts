import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MusicService} from "../../../services/music/music.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../../services/loader/loader.service";
import {Router} from "@angular/router";
import {PlaylistService} from "../../../services/playlist/playlist.service";

@Component({
  selector: 'app-addplaylistform',
  templateUrl: './addplaylistform.component.html',
  styleUrls: ['./addplaylistform.component.css']
})
export class AddplaylistformComponent implements OnInit {

  postingQuery = false;

  form = new FormGroup({
    playlistName: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    playlistDescription: new FormControl(null),
    playlistImage: new FormControl(null)
  })

  formData: FormData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playlistService: PlaylistService,
    private matSnackBar: MatSnackBar,
    public loaderService: LoaderService,
    private router: Router,
    private dialogSource: MatDialogRef<AddplaylistformComponent>
  ) { }

  ngOnInit() {
    this.formData = new FormData();
  }

  changeImageFile(event: any) {
    this.formData.delete("PlaylistImage");
    this.formData.append("PlaylistImage", event.target.files[0], event.target.files[0].name);
  }

  addPlaylist() {
    let fileImageName;
    if (this.form.value.playlistImage === null)
      fileImageName = '';
    else
      fileImageName = this.playlistService.getFileNameByPath(this.form.value.playlistImage);
    if (fileImageName) {
      if (!this.playlistService.checkFileFormat(fileImageName, 'png') && !this.playlistService.checkFileFormat(fileImageName, 'jpg')) {
        this.matSnackBar.open(`Выбран неверный формат изображения`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        return;
      }
    }
    this.formData.delete("PlaylistName");
    this.formData.delete("PlaylistDescription");
    this.formData.append("PlaylistName", this.form.value.playlistName);
    this.formData.append("PlaylistDescription", this.form.value.playlistDescription);
    this.postingQuery = true;
    this.playlistService.addPlaylist(this.formData).subscribe((response: any) => {
        this.postingQuery = false;
        if(response && response.id){
          this.matSnackBar.open(`Плейлист успешно добавлен`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
          this.dialogSource.close(response.id);
        }
        else if (response && response.msg)
          this.matSnackBar.open(`${response.msg}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
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
