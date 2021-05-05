import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {Observable} from "rxjs";
import {finalize, map, shareReplay} from "rxjs/operators";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AudioService} from "../../../services/player/audio.service";
import {LoaderService} from "../../../services/loader/loader.service";
import {UserInfo} from "../../../models/users/userInfo";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../../../services/notification/notification.service";
import {Notification} from "../../../models/notifications/notification";
import {SignalrService} from "../../../services/signalr/signalr.service";
import {NotificationResult} from "../../../models/notifications/notificationResult";
import {NotificationType} from "../../../models/notifications/notification";

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
  notifications: Notification[];
  currentUserId: number;

  constructor(
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public loaderService: LoaderService,
    public audioService: AudioService,
    private notificationService: NotificationService,
    private signalrService: SignalrService
  ) { }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
    this.currentUserId = Number(this.authService.getCurrentUserId());
    this.authService.getUserInfo().pipe(finalize(()=>this.userInfoLoaded = true)).subscribe((res: UserInfo)=>{
      this.userInfo = res;
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

    this.notificationService.getNotificationsForCurrentUser().pipe(finalize(()=>this.notificationsLoaded = true)).subscribe((res: Notification[])=>{
      this.notifications = res;
      this.notifications.forEach(n=>{
        switch (n.notificationType) {
          case NotificationType.AddedMusic:
            n.routeString = '/musicinfo';
            break;
        }
      })
    });

    this.signalrService.notificationSignal.subscribe((signal: NotificationResult) => {
      if(signal.followers.includes(this.currentUserId))
        alert(`it's for me`)
    })
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
    this.router.navigate(['/profile', `${this.userInfo.userId}`]);
  }

  notificationClick(notification: Notification) {
    this.router.navigate([`${notification.routeString}`, `${notification.sourceId}`]);
  }

  checkNotification(event: MouseEvent, notification: Notification) {
    event.stopPropagation();
    const index =  this.notifications.indexOf(notification);
    this.notifications.splice(index, 1);
  }
}
