import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SearchModel, SearchType} from "../../models/search";
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {MatSelectChange} from "@angular/material/select";
import {FilterMusicModel} from "../../models/musics/filterMusicModel";
import {FilterPlaylistModel} from "../../models/playlists/filterPlaylistModel";
import {FilterUserModel} from "../../models/users/filterUserModel";

@Component({
  selector: 'app-search-bar-page',
  templateUrl: './search-bar-page.component.html',
  styleUrls: ['./search-bar-page.component.css']
})
export class SearchBarPageComponent implements OnInit {

  @ViewChild("inputMusicName", {static: false})
  inputMusicName: ElementRef;
  @ViewChild("inputPlaylistName", {static: false})
  inputPlaylistName: ElementRef;
  @ViewChild("inputUserLogin", {static: false})
  inputUserLogin: ElementRef;

  @Input() musicGenreList: MusicGenreInfo[] = [];
  @Input() genreId: number;
  @Input() searchType: SearchType;
  @Output() onSearch = new EventEmitter<SearchModel>();
  @Output() onChangeSearchType = new EventEmitter<SearchType>();

  constructor(
  ) { }

  ngOnInit() {
  }

  isMusicType(){
    return this.searchType === SearchType.Music;
  }

  isPlaylistType(){
    return this.searchType === SearchType.Playlist;
  }

  isUserType(){
    return this.searchType === SearchType.User;
  }

  musicGenreChanged(event: MatSelectChange) {
    this.genreId = event.value
  }

  searchTypeChanged(event: MatSelectChange) {
    this.searchType = event.value;
    this.onChangeSearchType.emit(this.searchType);
  }

  search() {
    if(this.isMusicType()){
      this.onSearch.emit(new SearchModel(SearchType.Music, new FilterMusicModel(this.inputMusicName.nativeElement.value, this.genreId)))
    }
    else if(this.isPlaylistType()){
      this.onSearch.emit(new SearchModel(SearchType.Playlist, new FilterPlaylistModel(this.inputPlaylistName.nativeElement.value)))
    }
    else if(this.isUserType()){
      this.onSearch.emit(new SearchModel(SearchType.User, new FilterUserModel(this.inputUserLogin.nativeElement.value)))
    }
  }
}
