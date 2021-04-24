import {Component, Input, OnInit} from '@angular/core';
import {PlaylistInfo} from "../../models/playlists/playlistInfo";

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent implements OnInit {

  @Input() playlistCard: PlaylistInfo;
  loaded = false;

  constructor() { }

  ngOnInit() {
  }

  imageLoaded() {
    console.log('image loaded');
    this.loaded = true
  }
}