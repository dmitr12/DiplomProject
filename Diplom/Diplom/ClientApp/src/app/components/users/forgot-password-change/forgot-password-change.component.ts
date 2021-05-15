import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {LoaderService} from "../../../services/loader/loader.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Guid} from "guid-typescript";
import {ForgotPassword} from "../../../models/users/forgotPassword";
import {UsersService} from "../../../services/users/users.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-forgot-password-change',
  templateUrl: './forgot-password-change.component.html',
  styleUrls: ['./forgot-password-change.component.css']
})
export class ForgotPasswordChangeComponent implements OnInit {

  formChangePassword: FormGroup;
  subscription: Subscription;
  userId: number;
  verifyCode: Guid;

  constructor(
    public loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {
    this.subscription = activatedRoute.params.subscribe(params =>{
      this.userId = Number(params['userId']);
      this.verifyCode = params['verifyCode'];
    });

    this.formChangePassword = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    }, this.matchingPasswords);
  }

  ngOnInit() {
  }

  matchingPasswords(c: AbstractControl): ValidationErrors | null {
    const password = c.get('password');
    const confirmPassword = c.get('confirmPassword');
    if (password.value !== confirmPassword.value) {
      return {custom: 'Пароли не равны'};
    }
    return null;
  }

  changePassword() {
    this.userService.forgotPasswordChange(new ForgotPassword(this.userId, this.verifyCode, this.formChangePassword.value.password)).subscribe((res:any) => {
      this.router.navigate(['auth']);
      this.matSnackBar.open('Пароль успешно изменен', '', {duration: 5000, panelClass: 'custom-snack-bar-success'})
    }, error => {
      if (error.status == 404){
        this.matSnackBar.open(`${error.error.msg}`, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
      }
      else{
        if(error.status != 0){
          this.matSnackBar.open(`При изменении пароля возникла ошибка, статусный код ${error.status}`, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
        }
      }
    });
  }
}
