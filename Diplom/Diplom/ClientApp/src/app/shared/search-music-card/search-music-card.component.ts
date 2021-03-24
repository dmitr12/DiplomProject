import {Component, Input, OnInit} from '@angular/core';
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {MusicInfo} from "../../models/musics/musicInfo";

@Component({
  selector: 'app-search-music-card',
  templateUrl: './search-music-card.component.html',
  styleUrls: ['./search-music-card.component.css']
})
export class SearchMusicCardComponent implements OnInit {

  @Input() data: MusicInfo;

  constructor() { }

  ngOnInit() {
  }

}
