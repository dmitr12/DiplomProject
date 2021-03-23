import { Component, OnInit } from '@angular/core';
import {FilterMusicModel} from "../../models/musics/filterMusicModel";
import {MusicService} from "../../services/music/music.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  someList=[
    "1",
    '2',
    '3',
    '4'
  ]

  constructor(
    private musicService: MusicService
  ) { }

  ngOnInit() {
  }

  search() {
    this.musicService.getFilteredMusicList(new FilterMusicModel('m', 3)).subscribe(res=>{
      console.log(res);
    })
  }
}
