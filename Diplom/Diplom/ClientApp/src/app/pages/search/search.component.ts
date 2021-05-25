import {Component, OnInit} from '@angular/core';
import {MusicService} from "../../services/music/music.service";
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FilterMusicModel} from "../../models/musics/filterMusicModel";
import {MusicInfo} from "../../models/musics/musicInfo";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SearchModel, SearchType} from "../../models/search";
import {PlaylistService} from "../../services/playlist/playlist.service";
import {FilterPlaylistModel} from "../../models/playlists/filterPlaylistModel";
import {PlaylistInfo} from "../../models/playlists/playlistInfo";
import {UserInfo} from "../../models/users/userInfo";
import {UsersService} from "../../services/users/users.service";
import {FilterUserModel} from "../../models/users/filterUserModel";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  genres: MusicGenreInfo[] = [];
  musics: MusicInfo[] = [];
  playlists: PlaylistInfo[] = [];
  users: UserInfo[] = [];
  loadedPage = false;
  loadedSearch = true;
  totalRecords: string;
  genreId = 0;
  private subscription: Subscription;
  page = 1;
  searchType: SearchType;

  constructor(
    private musicService: MusicService,
    private playlistService: PlaylistService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.searchType = SearchType.Music;

    activatedRoute.queryParams.subscribe(params=>{
      if(params['genreId'] && params['searchType'] && params['searchType'] === '1'){
        this.searchType = SearchType.Music;
        this.genreId = Number(params['genreId']);
        this.search(new SearchModel(SearchType.Music, new FilterMusicModel('', params['genreId'])));
      }
      else if(!params['searchType']){
        this.search(new SearchModel(SearchType.Music, new FilterMusicModel('',-1)));
      }
    })
  }

  ngOnInit() {
    this.musicService.getMusicGenres().pipe(finalize(() => {
      this.loadedPage = true;
    })).subscribe((res: MusicGenreInfo[]) => {
      this.genres = res;
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении жанров возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  search(event: SearchModel) {
    this.loadedSearch = false;
    this.page = 1;
    switch (event.searchType) {
      case SearchType.Music:{
        this.musicService.getFilteredMusicList(event.filterModel as FilterMusicModel).pipe(finalize(()=>this.loadedSearch = true)).subscribe((res: MusicInfo[])=>{
          this.musics = res;
        }, error => {
          if(error.status == 401){
            this.router.navigate(['auth']);
          }
          if (error.status != 0) {
            this.matSnackBar.open(`При поиске музыки возникла ошибка, статусный код ${error.status}`, '', {
              duration: 3000,
              panelClass: 'custom-snack-bar-error'
            });
          } else {
            this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
          }
        })
        break;
      }
      case SearchType.Playlist:{
        this.playlistService.getFiltered(event.filterModel as FilterPlaylistModel).pipe(finalize(()=>this.loadedSearch = true)).subscribe((res: PlaylistInfo[])=>{
          this.playlists = res;
        }, error => {
          if(error.status == 401){
            this.router.navigate(['auth']);
          }
          if (error.status != 0) {
            this.matSnackBar.open(`При поиске плейлистов возникла ошибка, статусный код ${error.status}`, '', {
              duration: 3000,
              panelClass: 'custom-snack-bar-error'
            });
          } else {
            this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
          }
        })
        break;
      }
      case SearchType.User:{
        this.userService.getFiltered(event.filterModel as FilterUserModel).pipe(finalize(()=>this.loadedSearch = true)).subscribe((res:UserInfo[])=>{
          this.users = res;
        }, error => {
          if(error.status == 401){
            this.router.navigate(['auth']);
          }
          if (error.status != 0) {
            this.matSnackBar.open(`При поиске пользователей возникла ошибка, статусный код ${error.status}`, '', {
              duration: 3000,
              panelClass: 'custom-snack-bar-error'
            });
          } else {
            this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
          }
        });
        break;
      }
    }
  }

  getMusicInfo(id: number) {
    this.router.navigate(['musicinfo', `${id}`])
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

  changedSearchType(event: SearchType) {
    this.searchType = event;
    this.musics = [];
    this.playlists = [];
    this.users = [];
  }

  navigatePlaylistInfo(playlistId: number) {
    this.router.navigate(['playlist-info',`${playlistId}`]);
  }

  navigateProfile(userId: number) {
    this.router.navigate(['profile',`${userId}`]);
  }
}
