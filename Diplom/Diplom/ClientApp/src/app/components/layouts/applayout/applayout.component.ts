import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Observable} from "rxjs";
import {finalize, map, shareReplay} from "rxjs/operators";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AudioService} from "../../../services/player/audio.service";
import {LoaderService} from "../../../services/loader/loader.service";
import {UserInfo} from "../../../models/users/userInfo";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../../../services/notification/notification.service";
import {Notification, NotificationType} from "../../../models/notifications/notification";
import {SignalrService} from "../../../services/signalr/signalr.service";
import {NotificationResult} from "../../../models/notifications/notificationResult";
import {UsersService} from "../../../services/users/users.service";
import {DeleteNotificationsResult} from "../../../models/notifications/deleteNotificationsResult";
import * as moment from "moment";
import {NotificationInfo} from "../../../models/notifications/notificationInfo";

@Component({
  selector: 'app-applayout',
  templateUrl: './applayout.component.html',
  styleUrls: ['./applayout.component.css']
})
export class ApplayoutComponent implements OnInit {

  public isMenuOpen = false;
  userInfoLoaded = false;
  notificationsLoaded = false;
  userInfo: UserInfo;
  notifications: NotificationInfo[];
  currentUserId: number;
  isUserAuthenticated: boolean;

  constructor(
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public loaderService: LoaderService,
    public audioService: AudioService,
    private notificationService: NotificationService,
    private signalrService: SignalrService,
    private userService: UsersService
  ) {
    this.isUserAuthenticated = this.authService.isAuth();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
    if(this.isUserAuthenticated){
      this.currentUserId = Number(this.authService.getCurrentUserId());
      this.authService.getUserInfo().pipe(finalize(()=>this.userInfoLoaded = true)).subscribe((res: UserInfo)=>{
        this.userInfo = res;
        this.userService.editedProfile.subscribe((newAvatar:string)=>{
          this.userInfo.avatar = newAvatar;
        })
      }, error => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        if(error.status != 0){
          this.matSnackBar.open(`При получении информации о пользователе возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      });

      this.notificationService.getNotificationsForCurrentUser().pipe(finalize(()=>this.notificationsLoaded = true)).subscribe((res: NotificationInfo[])=>{
        this.notifications = res;
        this.notifications.forEach(n=>{
          n.createDate = new Date(n.createDate);
          switch (n.notificationType) {
            case NotificationType.AddedMusic:
              n.routeString = '/musicinfo';
              break;
            case NotificationType.AddedPlaylist:
              n.routeString = '/playlist-info';
              break;
          }
        })
      });

      this.signalrService.notificationSignal.subscribe((signal: NotificationResult) => {
        if(signal.followers.includes(this.currentUserId)){
          switch (signal.notification.notificationType) {
            case NotificationType.AddedMusic:
              signal.notification.routeString = '/musicinfo';
              break;
            case NotificationType.AddedPlaylist:
              signal.notification.routeString = '/playlist-info';
              break;
          }
          this.notifications.unshift(new NotificationInfo(signal.notification.notificationId, signal.notification.userId,
            signal.notification.sourceId, signal.notification.notificationType, signal.notification.message,
            false, signal.notification.createDate, signal.notification.routeString));
        }
      })

      this.signalrService.cleanNotificationsSignal.subscribe((signal: DeleteNotificationsResult) => {
        let notificationsForDelete = this.notifications.filter(n=>signal.deletedNotifications.includes(n.notificationId));
        notificationsForDelete.forEach(n=>{
          let index = this.notifications.indexOf(n);
          this.notifications.splice(index,1);
        })
      });
    }
  }

  public get userId(): number{
    return this.userInfo.userId;
  }

  onSidenavClick() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  profile() {
    this.router.navigate(['/profile-editor', `${this.userInfo.userId}`]);
  }

  notificationClick(notification: NotificationInfo) {
    if(!notification.isChecked){
      this.notificationService.checkNotification([notification]).subscribe((res:any)=>{
        let index = this.notifications.indexOf(notification);
        this.notifications[index].isChecked = true;
      }, error => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        if(error.status != 0){
          this.matSnackBar.open(`При изменении статуса уведомления возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      })
    }
    this.router.navigate([`${notification.routeString}`, `${notification.sourceId}`]);
  }

  login() {
    this.router.navigate(['auth']);
  }

  get uncheckedNotificationsLength() : number{
    return this.notifications.filter(n=>!n.isChecked).length
  }

  getDateTimeString(commentDate: Date) {
    return (moment(commentDate)).format('DD-MM-YYYY HH:mm');
  }

  checkAllNotifications() {
    let unChecked = this.notifications.filter(n=>!n.isChecked);
    if(unChecked.length > 0){
      this.notificationService.checkNotification(unChecked).subscribe((res:any)=>{
        unChecked.forEach(n=>{
          let index = this.notifications.indexOf(n);
          this.notifications[index].isChecked = true;
        })
      }, error => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        if(error.status != 0){
          this.matSnackBar.open(`При изменении статуса уведомлений возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      })
    }
  }
}
