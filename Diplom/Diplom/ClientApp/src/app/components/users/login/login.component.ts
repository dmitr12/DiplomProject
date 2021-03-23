import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserAuthentication} from "../../../models/users/userAuthentication";
import {LoaderService} from "../../../services/loader/loader.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(private authService: AuthService,
              public loaderService: LoaderService,
              private router: Router,
              private matSnackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(new UserAuthentication(this.form.value.login, this.form.value.password)).subscribe(res => {
      this.router.navigate(['']);
    }, error => {
      if (error.status == 401)
        this.matSnackBar.open('Неверный логин или пароль', '', {duration: 3000, panelClass: 'custom-snack-bar-error'})
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
