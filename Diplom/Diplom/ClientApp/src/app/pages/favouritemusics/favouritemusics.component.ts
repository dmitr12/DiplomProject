import { Component, OnInit } from '@angular/core';
import {MusicService} from "../../services/music/music.service";
import {finalize} from "rxjs/operators";
import {MusicInfo} from "../../models/musics/musicInfo";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-favouritemusics',
  templateUrl: './favouritemusics.component.html',
  styleUrls: ['./favouritemusics.component.css']
})
export class FavouritemusicsComponent implements OnInit {

  musicLoaded = false;
  likedMusic: MusicInfo[] = [];
  filteredMusics: MusicInfo[] = [];

  constructor(
    private musicService: MusicService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.musicService.getLiked().pipe(finalize(()=>this.musicLoaded = true)).subscribe((res:MusicInfo[])=>{
      this.likedMusic = res;
      this.filteredMusics = this.likedMusic;
    }, error => {
      if(error.status == 401){
        this.router.navigate(['auth']);
      }
      if (error.status != 0) {
        this.matSnackBar.open(`При получении музыки возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
  }

  navigateMusicInfo(id: number) {
    this.router.navigate(['musicinfo',`${id}`]);
  }

  search(data: string) {
    this.musicLoaded = false;
    this.filteredMusics = this.likedMusic.filter(m=>m.name.toLowerCase().includes(data.toLowerCase()));
    this.musicLoaded = true;
  }
}
