import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfo} from "../../models/users/userInfo";
import {AuthService} from "../../services/auth/auth.service";
import {FollowerService} from "../../services/follower/follower.service";
import {EditFollower} from "../../models/followers/editFollower";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userInfo: UserInfo;
  public pageLoaded = false;
  private subscription: Subscription;
  public userId: number;
  public currentUserId: number;
  imgHidden = true;
  isAnotherUser: boolean;
  followerProccessing = false;
  isFollowerExists: boolean;
  isUserAuthenticated: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private followerService: FollowerService,
    public authService: AuthService
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.userId = Number(params['id']));
    this.isUserAuthenticated = this.authService.isAuth();
  }

  ngOnInit() {
    if(this.isUserAuthenticated){
      this.currentUserId = Number(this.authService.getCurrentUserId());
      this.isAnotherUser = this.userId != this.currentUserId;
      if(this.isAnotherUser && this.authService.isAuth()){
        this.followerService.isFollowerExists(this.userId).subscribe((res:any)=>{
          this.isFollowerExists = res;
        }, error => {
          if(error.status == 401){
            this.router.navigate(['auth']);
          }
          else if (error.status != 0) {
            this.matSnackBar.open(`При получении информации о подписке возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
            });
          } else {
            this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
          }
        });
      }
    }

    this.userService.getUserProfile(this.userId).pipe(finalize(()=>this.pageLoaded=true)).subscribe((res:UserInfo)=>{
      this.userInfo = res;
      this.userInfo.registrationDate = new Date(res.registrationDate);
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении профиля возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }

  editProfile() {
    this.router.navigate(['profile-editor', `${this.userId}`])
  }

  imgLoaded() {
    this.imgHidden = false;
  }

  addFollower() {
    this.followerProccessing = true;
    this.followerService.addFollower(new EditFollower(this.userId)).pipe(finalize(()=>this.followerProccessing = false)).subscribe(res=>{
      this.matSnackBar.open(`Подписка успешно оформлена`, '', {
        duration: 3000,
        panelClass: 'custom-snack-bar-success'
      });
      this.isFollowerExists = true;
    }, error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      else if (error.status == 404){
        this.matSnackBar.open(error.error.msg, '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
      }
      else if (error.status != 0) {
        this.matSnackBar.open(`При оформлении подписки возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  deleteFollower() {
    this.followerProccessing = true;
    this.followerService.deleteFollower(this.userId).pipe(finalize(()=>this.followerProccessing = false)).subscribe(res=>{
      this.matSnackBar.open(`Вы отписались от пользователя ${this.userInfo.login}`, '', {
        duration: 3000,
        panelClass: 'custom-snack-bar-success'
      });
      this.isFollowerExists = false;
    }, error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      else if (error.status == 404){
        this.matSnackBar.open('Подписка не найдена', '', {duration: 5000, panelClass: 'custom-snack-bar-error'});
      }
      else if (error.status != 0) {
        this.matSnackBar.open(`При удалении подписки возникла ошибка, статусный код ${error.status}`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }
}
