import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FilterMusicModel} from "../../models/musics/filterMusicModel";
import {MusicService} from "../../services/music/music.service";
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {MatSelect, MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @ViewChild("inputSearch", {static: false})
  inputSearch: ElementRef;
  @ViewChild("searchBtn", {static: false})
  searchBtn: ElementRef;
  @Input() musicGenreList: MusicGenreInfo[] = [];
  @Output() onSearch = new EventEmitter<FilterMusicModel>();
  @Input() genreId: number;

  constructor(
    private musicService: MusicService
  ) {
  }

  ngOnInit() {
  }

  search() {
    this.onSearch.emit(new FilterMusicModel(this.inputSearch.nativeElement.value, this.genreId));
  }

  genreChanged(event: MatSelectChange) {
    this.genreId = event.value;
  }
}
