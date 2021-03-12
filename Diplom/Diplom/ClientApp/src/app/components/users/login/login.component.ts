import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserAuthentication} from "../../../models/users/userAuthentication";

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
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(new UserAuthentication(this.form.value.login, this.form.value.password)).subscribe(res => {
      this.router.navigate(['']);
    }, error => {
      if (error.status == 401)
        alert("Неверный логин или пароль");
      else
        alert("Возникла ошибка, статусный код "+error.status)
    });
  }
}
