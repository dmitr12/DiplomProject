import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {UserRegistration} from "../../../models/users/userRegistration";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(100), this.validName]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    passwords: new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    })
  }, this.matchingPasswords);

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  matchingPasswords(c: AbstractControl): ValidationErrors | null {
    const password = c.get('passwords.password');
    const confirmPassword = c.get('passwords.confirmPassword');
    if (password.value !== confirmPassword.value) {
      return {custom: 'Пароли не равны'};
    }
    return null;
  }

  validName(c: FormControl): ValidationErrors | null {
    if (c.value.toString().includes('@')) {
      return {custom: 'Недопустимый символ @'};
    }
    return null;
  }

  register() {
    this.authService.register(new UserRegistration(this.formRegister.value.email, this.formRegister.value.userName,
      this.formRegister.value.passwords.password)).subscribe((res: any) => {
      if (res && res.msg) {
        alert(res.msg);
      } else {
        this.router.navigate(['']);
      }
    }, error => {
      alert('При отправке запроса возникла ошибка, статусный код ' + error.status);
    });
  }
}
