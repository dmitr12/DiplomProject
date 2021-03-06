import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserAuthentication} from "../../models/users/userAuthentication";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {tap} from "rxjs/operators";
import {Token, TokenMessage} from "../../models/tokens/token";
import {UserRegistration} from "../../models/users/userRegistration";
import jwt_decode from 'jwt-decode';
import {UserInfo} from "../../models/users/userInfo";

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

  isAuth(): boolean {
    let token = localStorage.getItem(ACCESS_TOKEN);
    if(!token)
      return false;
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.router.navigate(['auth']);
  }

  getCurrentUserName() {
    return jwt_decode<Token>(localStorage.getItem(ACCESS_TOKEN)!).unique_name;
  }

  getCurrentUserId() {
    return jwt_decode<Token>(localStorage.getItem(ACCESS_TOKEN)!).sub;
  }

  getCurrentUserRole() {
    return jwt_decode<Token>(localStorage.getItem(ACCESS_TOKEN)!).role;
  }

  getUserInfo(): Observable<UserInfo>{
    return this.httpClient.get<UserInfo>(`${environment.url}api/user/userinfo`)
  }
}
