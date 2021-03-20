import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AudioService} from "../../../services/player/audio.service";
import {LoaderService} from "../../../services/loader/loader.service";

@Component({
  selector: 'app-applayout',
  templateUrl: './applayout.component.html',
  styleUrls: ['./applayout.component.css']
})
export class ApplayoutComponent implements OnInit {

  public isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    public loaderService: LoaderService,
    public audioService: AudioService
  ) { }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
  }

  onSidenavClick() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
