import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfo} from "../../models/users/userInfo";
import {AuthService} from "../../services/auth/auth.service";

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.subscription = activatedRoute.params.subscribe(params => this.userId = params['id']);
  }

  ngOnInit() {
    this.currentUserId = Number(this.authService.getCurrentUserId());
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
}
