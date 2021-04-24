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
import {FilterMusicModel} from "../../../models/musics/filterMusicModel";

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

  @ViewChild("inputSearch", {static: false})
  inputSearch: ElementRef;
  @ViewChild("searchBtn", {static: false})
  searchBtn: ElementRef;

  public playlistForm: FormGroup;

  constructor(
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.playlistId = params['id']);
  }

  ngOnInit() {
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
      })
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
    console.log(this.image)
  }

  // checkServer() {
  //   let f = new FormData();
  //   let arr = [1,2,3,4,5];
  //   f.append("PlaylistId", this.playlistForm.value.id)
  //   f.append("PlaylistName", this.playlistForm.value.name)
  //   f.append("PlaylistDescription", this.playlistForm.value.description);
  //   f.append("ImageFile", this.playlistForm.value.poster);
  //   for (var i = 0; i < this.playlistForm.value.musics.length; i++) {
  //     f.append('Musics', this.playlistForm.value.musics[i].toString());
  //   }
  //   this.playlistService.editPlaylist(f).subscribe(res=>{
  //     alert('asd');
  //   })
  // }
  searchMusic() {
    this.musicUsersFiltered = this.musicUsers.filter(m=>m.name.includes(this.inputSearch.nativeElement.value));
  }

  checkboxChanged(checked: boolean, id: number) {
    if(checked)
      this.playlistForm.value.musics = this.playlistForm.value.musics.concat(id);
    else
    {
      const index = this.playlistForm.value.musics.indexOf(id);
      this.playlistForm.value.musics.splice(index, 1);
    }
    console.log(this.playlistForm.value.musics)
  }
}
