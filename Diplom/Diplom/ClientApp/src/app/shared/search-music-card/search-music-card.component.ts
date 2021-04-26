import {Component, Input, OnInit} from '@angular/core';
import {MusicInfo} from "../../models/musics/musicInfo";

@Component({
  selector: 'app-search-music-card',
  templateUrl: './search-music-card.component.html',
  styleUrls: ['./search-music-card.component.css']
})
export class SearchMusicCardComponent implements OnInit {

  @Input() data: MusicInfo;
  imgHidden = true;

  constructor() { }

  ngOnInit() {
  }

  imageLoaded() {
    this.imgHidden = false;
  }
}
