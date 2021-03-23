import { Component, OnInit } from '@angular/core';
import {MusicService} from "../../services/music/music.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(
    private musicService: MusicService
  ) { }

  ngOnInit() {
  }
}
