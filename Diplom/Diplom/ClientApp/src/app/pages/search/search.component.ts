import { Component, OnInit } from '@angular/core';
import {MusicService} from "../../services/music/music.service";
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FilterMusicModel} from "../../models/musics/filterMusicModel";
import {MusicInfo} from "../../models/musics/musicInfo";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  genres: MusicGenreInfo[] = [];
  musics: MusicInfo[] = [];
  loadedPage = false;
  loadedSearch = true;
  totalRecords: string;
  genreId = 0;
  private subscription: Subscription;
  page: number = 1;
  itemsPage = 20;

  constructor(
    private musicService: MusicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  private matSnackBar: MatSnackBar
  ) {
    activatedRoute.queryParams.subscribe(params=>{
      if(params['genreId']){
        this.genreId = Number(params['genreId']);
        this.search(new FilterMusicModel('', params['genreId']));
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

  search(event: FilterMusicModel) {
    this.loadedSearch = false;
    this.musicService.getFilteredMusicList(event).pipe(finalize(()=>this.loadedSearch = true)).subscribe((res: MusicInfo[])=>{
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
  }

  getMusicInfo(id: number) {
    this.router.navigate(['musicinfo', `${id}`])
  }
}
