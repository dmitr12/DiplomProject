import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlaylistInfo} from "../../../models/playlists/playlistInfo";
import {PlaylistService} from "../../../services/playlist/playlist.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MusicService} from "../../../services/music/music.service";
import {MusicInfo} from "../../../models/musics/musicInfo";
import {AudioService} from "../../../services/player/audio.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DeleteplaylistComponent} from "../../../components/playlists/deleteplaylist/deleteplaylist.component";

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  styleUrls: ['./playlist-editor.component.css']
})
export class PlaylistEditorComponent implements OnInit {

  playlistInfoLoaded = false;
  playlistInfo: PlaylistInfo;
  subscription: Subscription;
  playlistId: number;
  imgLoaded = false;
  image: string;
  musicUsers: MusicInfo[] = [];
  musicUsersFiltered: MusicInfo[] =[];
  musicLoaded = false;
  page: number = 1;
  itemsPage = 8;
  totalRecords: string;
  formData: FormData;
  dialogSource: any;

  @ViewChild("inputSearch", {static: false})
  inputSearch: ElementRef;
  @ViewChild("searchBtn", {static: false})
  searchBtn: ElementRef;

  public playlistForm: FormGroup;
  isEditing = false;

  constructor(
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private audioService: AudioService,
    private dialog: MatDialog,
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.playlistId = params['id']);
  }

  ngOnInit() {
    this.formData = new FormData();
    this.playlistService.getPlaylistInfo(this.playlistId).pipe(finalize(()=>this.playlistInfoLoaded = true)).subscribe((res:PlaylistInfo)=>{
      this.playlistInfo = res;
      this.image = this.playlistInfo.playlistImageUrl;
      this.playlistInfo.createDate = new Date(this.playlistInfo.createDate);
      this.playlistForm = new FormGroup({
        id: new FormControl(this.playlistId),
        name: new FormControl(res.playlistName, [Validators.required, Validators.maxLength(200)]),
        description: new FormControl(res.playlistDescription),
        poster: new FormControl(null),
        musics: new FormControl(res.musics)
      });
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
    });

    this.musicService.getMusicsByUserId().pipe(finalize(()=>this.musicLoaded = true)).subscribe((res: MusicInfo[])=>{
      this.musicUsers = res;
      this.musicUsersFiltered = this.musicUsers;
    }, error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      if (error.status != 0) {
        this.matSnackBar.open(`При получении музыки пользователя возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  posterLoaded() {
    this.imgLoaded = true;
  }

  changePoster(event: any) {
    this.image = window.URL.createObjectURL(event.target.files[0]);
    this.formData.delete("ImageFile");
    this.formData.append("ImageFile", event.target.files[0], event.target.files[0].name);
  }

  edit(){
    let fileImageName;
    if (this.playlistForm.value.poster === null)
      fileImageName = '';
    else
      fileImageName = this.playlistService.getFileNameByPath(this.playlistForm.value.poster);
    if (fileImageName) {
      if (!this.playlistService.checkFileFormat(fileImageName, 'png') && !this.playlistService.checkFileFormat(fileImageName, 'jpg')) {
        this.matSnackBar.open(`Выбран неверный формат изображения`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        return;
      }
    }
    this.formData.delete("PlaylistId");
    this.formData.delete("PlaylistName");
    this.formData.delete("PlaylistDescription");
    this.formData.delete("Musics");
    this.formData.append("PlaylistId", this.playlistId.toString());
    this.formData.append("PlaylistName", this.playlistForm.value.name);
    if(this.playlistForm.value.description === null)
      this.formData.append("PlaylistDescription", '');
    else
      this.formData.append("PlaylistDescription", this.playlistForm.value.description);
    for (var i = 0; i < this.playlistForm.value.musics.length; i++) {
      this.formData.append('Musics', this.playlistForm.value.musics[i].toString());
    }
    this.isEditing = true;
    this.playlistService.editPlaylist(this.formData).pipe(finalize(() => {this.isEditing = false; this.formData.delete("ImageFile");})).subscribe((response:any) => {
        if (response && response.msg)
          this.matSnackBar.open(`${response.msg}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        else
          this.matSnackBar.open(`Плейлист успешно обновлен`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      },
      (error:any) => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        else if(error.status == 403){
          this.matSnackBar.open('Пользователь не имеет права редактировать данный плейлист', '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
        }
        else if (error.status == 404){
          this.matSnackBar.open(error.error.msg, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
        }
        else if(error.status != 0){
          this.matSnackBar.open(`При обновлении плейлиста возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      })
  }

  searchMusic() {
    this.musicUsersFiltered = this.musicUsers.filter(m=>m.name.toLowerCase().includes(this.inputSearch.nativeElement.value.toLowerCase()));
  }

  checkboxChanged(checked: boolean, id: number) {
    if(checked)
      this.playlistForm.get('musics').setValue(this.playlistForm.value.musics.concat(id));
    else
    {
      const index =  this.playlistForm.value.musics.indexOf(id);
      this.playlistForm.value.musics.splice(index, 1);
    }
  }

  getMusicInfo(musicId: number) {
    return this.musicUsers.find(m=>m.id == musicId);
  }

  playMusic(m: MusicInfo) {
    this.audioService.openFile(m.id, m.musicFileName, m.name);
  }

  getNameErrorMessage() {
    if(this.playlistForm.get('name').hasError('required'))
      return 'Поле необходимо заполнить'
    return this.playlistForm.get('name').hasError('maxlength') ?
      `Максимум ${this.playlistForm.get('name').errors['maxlength']['requiredLength']} символов` : '';
  }

  delete() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.playlistId;
    this.dialogSource = this.dialog.open(DeleteplaylistComponent, dialogConfig);
    this.dialogSource.afterClosed().subscribe(result=>{
      if (result !== 'false'){
        this.router.navigate(['playlist']);
      }
    });
  }
}
