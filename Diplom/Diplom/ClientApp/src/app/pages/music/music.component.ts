import {Component, OnInit, ViewChild} from '@angular/core';
import {AudioService} from "../../services/player/audio.service";
import {MusicService} from "../../services/music/music.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddmusicformComponent} from "../../components/musics/addmusicform/addmusicform.component";
import {Music} from "../../models/musics/music";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MusicInfo} from "../../models/musics/musicInfo";
import {Router} from "@angular/router";

@Component({
  selector: 'app-playlist',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {

  @ViewChild('scrollElem', {static: false})
  private scrollElem: any;

  dialogSource: any;
  musics: MusicInfo[] = [];
  loaded = false;
  scrollLoaded = false;
  lastIndex = -1;
  notEmptyMusic = true;
  notScrolly = true;

  constructor(
    public audioService: AudioService,
    private musicService: MusicService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.musicService.getPartOfMusicsByUserId(this.lastIndex).pipe(finalize(() => {
      this.loaded = true;
      this.scrollLoaded = true
    })).subscribe(
      (res: MusicInfo[]) => {
        this.musics = res;
        if(res.length>0){
          this.lastIndex = res[res.length - 1].id;
        }
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
      }
    )
  }

  addMusic() {
    const dialogConfig = new MatDialogConfig();
    this.dialogSource = this.dialog.open(AddmusicformComponent, dialogConfig);
    this.dialogSource.afterClosed().subscribe(result => {
      if (result !== 'false'){
        this.musicService.getMusic(result).pipe(finalize(()=> this.loaded = true)).subscribe((res:MusicInfo)=>{
          this.loaded = false;
          this.musics = this.musics.concat(res);
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
        })
      }
    });
  }

  onScroll(event: any) {
    if (this.notScrolly && this.notEmptyMusic) {
      this.scrollLoaded = false;
      this.notScrolly = false;
      this.loadNextMusics();
    }
  }

  loadNextMusics() {
    this.musicService.getPartOfMusicsByUserId(this.lastIndex).pipe(finalize(() => {
      this.scrollLoaded = true;
      this.notScrolly = true
    })).subscribe(
      (res: MusicInfo[]) => {
        if (res.length > 0) {
          this.musics = this.musics.concat(res);
          this.lastIndex = res[res.length - 1].id;
        } else {
          this.notEmptyMusic = false;
        }
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении музыки возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      }
    )
  }

  onMusicDeleted(id: number) {
    this.loaded = false;
    const index = this.musics.indexOf(this.musics.filter(m=>m.id == id)[0]);
    this.musics.splice(index, 1);
    this.loaded = true;
  }

  onMusicEdited(music: MusicInfo) {
    this.musicService.getMusic(music.id).pipe(finalize(()=> this.loaded = true)).subscribe((res:MusicInfo)=>{
      this.loaded = false;
      const index = this.musics.indexOf(this.musics.filter(m=>m.id == music.id)[0]);
      this.musics[index] = res;
    }, error => {
      if (error.status != 0) {
        this.matSnackBar.open(`При получении музыки возникла ошибка, статусный код ${error.status}`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    })
  }
}
