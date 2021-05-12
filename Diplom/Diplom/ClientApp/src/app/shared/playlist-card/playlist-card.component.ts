import {Component, Input, OnInit} from '@angular/core';
import {PlaylistInfo} from "../../models/playlists/playlistInfo";
import {Router} from "@angular/router";

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent implements OnInit {

  @Input() playlistCard: PlaylistInfo;
  @Input() enableUserLogin: boolean;
  loaded = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  imageLoaded() {
    this.loaded = true
  }

  navigateProfile() {
    this.router.navigate(['/profile',`${this.playlistCard.userId}`]);
  }
}
