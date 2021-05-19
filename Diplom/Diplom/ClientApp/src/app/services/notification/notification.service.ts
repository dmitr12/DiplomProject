import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notification} from "../../models/notifications/notification";
import {environment} from "../../../environments/environment";
import {NotificationInfo} from "../../models/notifications/notificationInfo";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  getNotificationsForCurrentUser(): Observable<NotificationInfo[]>{
    return this.http.get<NotificationInfo[]>(`${environment.url}api/Notification/GetForCurrentUser`);
  }

  checkNotification(notifications: NotificationInfo[]){
    return this.http.put(`${environment.url}api/Notification/CheckNotification`, notifications);
  }
}
