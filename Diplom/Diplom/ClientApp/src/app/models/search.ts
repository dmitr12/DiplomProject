import {FilterMusicModel} from "./musics/filterMusicModel";
import {FilterPlaylistModel} from "./playlists/filterPlaylistModel";
import {FilterUserModel} from "./users/filterUserModel";

export enum SearchType{
  Music = 1,
  Playlist = 2,
  User = 3
}

export class SearchModel {

  constructor(searchType: SearchType, filterModel: FilterMusicModel | FilterPlaylistModel | FilterUserModel) {
    this.searchType = searchType;
    this.filterModel = filterModel;
  }

  searchType: SearchType;
  filterModel: FilterMusicModel | FilterPlaylistModel | FilterUserModel;
}
