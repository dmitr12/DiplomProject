import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserInfo} from "../../../models/users/userInfo";
import {AuthService} from "../../../services/auth/auth.service";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup} from "@angular/forms";
import {MusicService} from "../../../services/music/music.service";
import {UsersService} from "../../../services/users/users.service";
import {Router} from "@angular/router";

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
  formData: FormData;
  editing = false;

  public profileForm: FormGroup;
  imgHidden = true;

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private musicService: MusicService,
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formData = new FormData();
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
    let fileImageName;
    if (this.profileForm.value.avatar === null)
      fileImageName = '';
    else
      fileImageName = this.musicService.getFileNameByPath(this.profileForm.value.avatar);
    if (fileImageName) {
      if (!this.musicService.checkFileFormat(fileImageName, 'png') && !this.musicService.checkFileFormat(fileImageName, 'jpg')) {
        this.matSnackBar.open(`Выбран неверный формат изображения`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        return;
      }
    }
    this.formData.delete("Name");
    this.formData.delete("Surname");
    this.formData.delete("Country");
    this.formData.delete("City");
    this.formData.append("Name", this.profileForm.value.name);
    this.formData.append("Surname", this.profileForm.value.surname);
    this.formData.append("Country", this.profileForm.value.country);
    this.formData.append("City", this.profileForm.value.city);
    this.editing = true;
    this.userService.editProfile(this.formData).pipe(finalize(()=>{this.editing = false; this.formData.delete("Avatar")})).subscribe((response:any)=>{
      if(response && response.avatar){
        this.userService.editedProfile.emit(response.avatar);
        this.matSnackBar.open(`Профиль успешно изменен`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      }
    }, error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      else if (error.status == 404){
        this.matSnackBar.open(error.error.msg, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
      }
      else if(error.status != 0){
        this.matSnackBar.open(`При отправке запроса возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
      else{
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

  changeAvatarFile(event: any) {
    this.avatarFile = this.musicService.getFileNameByPath(this.profileForm.value.avatar);
    this.formData.delete("Avatar");
    this.formData.append("Avatar", event.target.files[0], event.target.files[0].name);
  }

  chooseAvatar() {
    this.inputFile.nativeElement.click();
  }

  imgLoaded() {
    this.imgHidden = false;
  }
}
