import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ForgotPassword} from "../../models/users/forgotPassword";
import {Observable} from "rxjs";
import {UserInfo} from "../../models/users/userInfo";
import {NotificationResult} from "../../models/notifications/notificationResult";
import {FilterUserModel} from "../../models/users/filterUserModel";
import {ChangeUserPassword} from "../../models/users/changeUserPassword";
import {ConfirmEmail} from "../../models/users/confirmEmail";
import {EmailForgotPassword} from "../../models/users/emailForgotPassword";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  editedProfile = new EventEmitter<string>();

  constructor(
    private httpClient: HttpClient
  ) { }

  emailForgotPassword(emailForgotPassword: EmailForgotPassword){
    return this.httpClient.post(`${environment.url}api/user/EmailForgotPassword`, emailForgotPassword);
  }

  forgotPasswordChange(forgotPassword: ForgotPassword){
    return this.httpClient.put(`${environment.url}api/user/ForgotPasswordChange`, forgotPassword)
  }

  getUserProfile(userId: number): Observable<UserInfo>{
    return this.httpClient.get<UserInfo>(`${environment.url}api/user/UserProfile/${userId}`);
  }

  editProfile(formData: FormData){
    return this.httpClient.put(`${environment.url}api/user/EditUserProfile`, formData);
  }

  getFiltered(model: FilterUserModel):Observable<UserInfo[]>{
    let httpParams = new HttpParams().set('login', model.login);
    return this.httpClient.get<UserInfo[]>(`${environment.url}api/user/FilterUsers`,{params: httpParams})
  }

  changeUserPassword(model: ChangeUserPassword){
    return this.httpClient.put(`${environment.url}api/user/ChangeUserPassword`, model);
  }

  confirmEmail(confirmEmail: ConfirmEmail){
    return this.httpClient.put(`${environment.url}api/user/ConfirmEmail`, confirmEmail);
  }
}
