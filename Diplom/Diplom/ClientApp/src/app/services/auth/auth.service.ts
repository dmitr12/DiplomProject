import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserAuthentication} from "../../models/users/userAuthentication";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {tap} from "rxjs/operators";
import {TokenMessage} from "../../models/tokens/token";
import {UserRegistration} from "../../models/users/userRegistration";

export const ACCESS_TOKEN="access_token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService) { }

  login(userAuth: UserAuthentication): Observable<TokenMessage> {
    return this.httpClient.post<TokenMessage>(`${environment.url}api/user/login`, userAuth).pipe(tap(
      token => {
        localStorage.setItem(ACCESS_TOKEN, token.token);
      }
    ));
  }

  register(userRegistration: UserRegistration){
    return this.httpClient.post(`${environment.url}api/user/register`, userRegistration);
  }

  isAuth(): any {
    let token = localStorage.getItem(ACCESS_TOKEN);
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    // this.router.navigate(['auth']);
  }
}
