import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UserInfo} from "../../../models/users/userInfo";
import {AuthService} from "../../../services/auth/auth.service";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup} from "@angular/forms";
import {MusicStarRating} from "../../../models/musics/musicStarRating";
import {MusicService} from "../../../services/music/music.service";

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit {

  @ViewChild('inputFile', {static: false})
  inputFile: ElementRef;

  loadedPage = false;
  userInfo: UserInfo;
  avatarFile = null;

  public profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private musicService: MusicService
  ) { }

  ngOnInit() {
    this.authService.getUserInfo().pipe(finalize(()=>this.loadedPage = true)).subscribe((res:UserInfo)=>{
      this.userInfo = res;
      this.profileForm = new FormGroup({
        name: new FormControl(res.name),
        surname: new FormControl(res.surname),
        city: new FormControl(res.city),
        country: new FormControl(res.country),
        avatar: new FormControl(null)
      })
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении профиля возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

  editProfile() {

  }

  changeAvatarFile(event: Event) {
    this.avatarFile = this.musicService.getFileNameByPath(this.profileForm.value.avatar)
  }

  chooseAvatar() {
    this.inputFile.nativeElement.click();
  }
}
