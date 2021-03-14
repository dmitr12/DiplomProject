import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-applayout',
  templateUrl: './applayout.component.html',
  styleUrls: ['./applayout.component.css']
})
export class ApplayoutComponent implements OnInit {

  public isMenuOpen = false;

  constructor(
    public authService: AuthService
  ) { }



  ngOnInit() {
  }

  onSidenavClick() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
