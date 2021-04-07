import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ForgotPassword} from "../../models/users/forgotPassword";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  emailForgotPassword(forgotPassword: ForgotPassword){
    return this.httpClient.post(`${environment.url}api/user/EmailForgotPassword`, forgotPassword)
  }

  changePassword(forgotPassword: ForgotPassword){
    return this.httpClient.post(`${environment.url}api/user/ChangePassword`, forgotPassword)
  }

  // getUserProfile(userId: number){
  //   return this.httpClient.get
  // }
}
