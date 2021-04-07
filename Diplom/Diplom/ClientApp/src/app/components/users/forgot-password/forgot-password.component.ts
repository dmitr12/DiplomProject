import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from "../../../services/loader/loader.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users/users.service";
import {UserAuthentication} from "../../../models/users/userAuthentication";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize} from "rxjs/operators";
import {ForgotPassword} from "../../../models/users/forgotPassword";
import {SignalrService} from "../../../services/signalr/signalr.service";
import {User} from "../../../models/users/user";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formChangePassword: FormGroup;

  currentMail: string;
  changePasswordSubscription: any;
  mailConfirmed = false;

  constructor(
    public loaderService: LoaderService,
    private usersService: UsersService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private signalrService: SignalrService,
  ) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
    this.formChangePassword = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    }, this.matchingPasswords);
  }

  matchingPasswords(c: AbstractControl): ValidationErrors | null {
    const password = c.get('password');
    const confirmPassword = c.get('confirmPassword');
    if (password.value !== confirmPassword.value) {
      return {custom: 'Пароли не равны'};
    }
    return null;
  }

  ngOnInit() {
    this.changePasswordSubscription = this.signalrService.changeUserPasswordSignal.subscribe((res:User)=>{
      if(res.mail === this.currentMail){
        this.mailConfirmed = true;
      }
    });
  }

  sendMail() {
    this.usersService.emailForgotPassword(new ForgotPassword(this.form.value.email, null)).subscribe((res:any) => {
      if(res && res.msg)
        this.matSnackBar.open(res['msg'], '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      else{
        this.currentMail = this.form.value.email;
        this.matSnackBar.open('Письмо для замены пароля успешно отправлено', '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      }
    }, error => {
      if (error.status == 404)
        this.matSnackBar.open('Пользователь с такой почтой не зарегистрирован', '', {duration: 3000, panelClass: 'custom-snack-bar-error'})
      else{
        if(error.status != 0){
          this.matSnackBar.open(`При отправке запроса возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.changePasswordSubscription.unsubscribe();
  }

  changePassword() {
    this.usersService.changePassword(new ForgotPassword(this.form.value.email, this.formChangePassword.value.password)).subscribe((res:any) => {
      if(res && res.msg)
        this.matSnackBar.open(res['msg'], '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      else{
        this.matSnackBar.open('Пароль успешно изменен', '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
      }
    }, error => {
      if (error.status == 404)
        this.matSnackBar.open('Пользователь с такой почтой не зарегистрирован', '', {duration: 3000, panelClass: 'custom-snack-bar-error'})
      else{
        if(error.status != 0){
          this.matSnackBar.open(`При отправке запроса возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    });
  }
}
