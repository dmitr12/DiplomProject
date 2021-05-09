import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {LoaderService} from "../../../services/loader/loader.service";
import {UsersService} from "../../../services/users/users.service";
import {ChangeUserPassword} from "../../../models/users/changeUserPassword";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form = new FormGroup({
    oldPassword: new FormControl(null, [Validators.required]),
    passwords: new FormGroup({
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    })
  }, this.matchingPasswords)

  postingQuery = false;

  constructor(
    public loaderService: LoaderService,
    private userService: UsersService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private dialogSource: MatDialogRef<ChangePasswordComponent>
  ) {
    dialogSource.disableClose = true;
  }

  ngOnInit() {
  }

  matchingPasswords(c: AbstractControl): ValidationErrors | null {
    const password = c.get('passwords.newPassword');
    const confirmPassword = c.get('passwords.confirmPassword');
    if (password.value !== confirmPassword.value) {
      return {custom: 'Пароли не равны'};
    }
    return null;
  }

  changePassword() {
    this.postingQuery = true;
    this.userService.changeUserPassword(new ChangeUserPassword(this.form.value.oldPassword, this.form.value.passwords.newPassword)).pipe(finalize(()=>this.postingQuery = false)).subscribe((res:any)=>{
      this.matSnackBar.open(`Пароль успешно изменен`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      this.dialogSource.close();
    }, error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      else if(error.status == 403){
        this.matSnackBar.open(`Неверный старый пароль`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
      else if(error.status == 404){
        this.matSnackBar.open(`Пользователь не найден`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
      else if(error.status != 0){
        this.matSnackBar.open(`При отправке запроса возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
      else{
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }
}
