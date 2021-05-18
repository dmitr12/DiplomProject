import {Component, OnInit} from '@angular/core';
import {LoaderService} from "../../../services/loader/loader.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users/users.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EmailForgotPassword} from "../../../models/users/emailForgotPassword";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(
    public loaderService: LoaderService,
    private usersService: UsersService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
  }

  sendMail() {
    this.usersService.emailForgotPassword(new EmailForgotPassword(this.form.value.email)).subscribe((res:any) => {
      if(res && res.msg)
        this.matSnackBar.open(res['msg'], '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
      else{
        this.matSnackBar.open('Письмо для замены пароля успешно отправлено', '', {duration: 5000, panelClass: 'custom-snack-bar-success'});
        this.router.navigate(['auth']);
      }
    }, error => {
      if (error.status == 404)
        this.matSnackBar.open('Пользователь с указанной почтой не зарегистрирован', '', {duration: 5000, panelClass: 'custom-snack-bar-error'})
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
