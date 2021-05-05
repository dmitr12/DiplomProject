import {Injectable, EventEmitter} from '@angular/core';
import * as signalr from '@aspnet/signalr';
import {environment} from "../../../environments/environment";
import {RatedMusicResult} from "../../models/musics/ratedMusicResult";
import {MusicStarRating} from "../../models/musics/musicStarRating";
import {HttpClient} from "@angular/common/http";
import {MusicCommentResult} from "../../models/comments/musicCommentResult";
import {User} from "../../models/users/user";
import {NotificationResult} from "../../models/notifications/notificationResult";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  ratedMusicSignal = new EventEmitter<RatedMusicResult>();
  commentMusicSignal = new EventEmitter<MusicCommentResult>();
  changeUserPasswordSignal = new EventEmitter<User>();
  notificationSignal = new EventEmitter<NotificationResult>();
  private hubConnection: signalr.HubConnection;
  private readonly ratedMusic = 'RatedMusic';
  private readonly commentOnMusic = 'CommentOnMusic';
  private readonly changeUserPassword = "ChangeUserPassword";
  private readonly notification_event = "Notification";

  constructor(
    private http: HttpClient
  ) {
    this.buildConnection();
    this.startConnection();
  }

  rateMusic(model: MusicStarRating) {
    return this.http.post(`${environment.url}api/music/RateMusic`, model);
  }

  private buildConnection() {
    this.hubConnection = new signalr.HubConnectionBuilder()
      .withUrl(`${environment.url}${environment.hub}`).build();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection to hub started ...');
        this.registerSignalEvents();
      })
      .catch(err => {
        console.log("Error while starting connection: " + err);
        setTimeout(() => {
          this.startConnection();
        }, 3000);
      })
  }

  private registerSignalEvents() {
    this.hubConnection.on(this.ratedMusic, (data: RatedMusicResult) => {
      this.ratedMusicSignal.emit(data);
    });
    this.hubConnection.on(this.commentOnMusic, (data: MusicCommentResult) => {
      this.commentMusicSignal.emit(data);
    });
    this.hubConnection.on(this.changeUserPassword, (data: User) => {
      this.changeUserPasswordSignal.emit(data);
    });
    this.hubConnection.on(this.notification_event, (data: NotificationResult) => {
      this.notificationSignal.emit(data);
    });
  }
}
