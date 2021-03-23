import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-music-card',
  templateUrl: './search-music-card.component.html',
  styleUrls: ['./search-music-card.component.css']
})
export class SearchMusicCardComponent implements OnInit {

  items=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

  totalRecords: string;
  page: number = 1;

  constructor() { }

  ngOnInit() {
  }

}
