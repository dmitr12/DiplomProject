import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notification} from "../../models/notifications/notification";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  getNotificationsForCurrentUser(): Observable<Notification[]>{
    return this.http.get<Notification[]>(`${environment.url}api/Notification/GetForCurrentUser`);
  }

  checkNotification(notifications: Notification[]){
    return this.http.put(`${environment.url}api/Notification/CheckNotification`, notifications);
  }
}
