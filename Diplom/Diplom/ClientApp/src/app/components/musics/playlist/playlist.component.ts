import {Component, OnInit, ViewChild} from '@angular/core';
import {AudioService} from "../../../services/player/audio.service";
import {MusicService} from "../../../services/music/music.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddmusicformComponent} from "../addmusicform/addmusicform.component";
import {Music} from "../../../models/musics/music";
import {finalize} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  @ViewChild('scrollElem', {static: false})
  private scrollElem: any;

  dialogSource: any;
  musics: Music[] = [];
  loaded = false;
  scrollLoaded = false;
  lastIndex = -1;
  notEmptyMusic = true;
  notScrolly = true;

  constructor(
    private audioService: AudioService,
    private musicService: MusicService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.musicService.getPartOfMusicsByUserId(this.lastIndex).pipe(finalize(()=>{this.loaded = true; this.scrollLoaded = true})).subscribe(
      (res: Music[])=>{
        this.musics = res;
        this.lastIndex = res[res.length-1].musicId;
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении музыки возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
        }
      }
    )
  }

  callAdd() {
    const dialogConfig = new MatDialogConfig();
    this.dialogSource = this.dialog.open(AddmusicformComponent, dialogConfig);
    // this.dialogSource.afterClosed().subscribe();
  }

  check(event: any) {
    if(!event.target.className.includes('edit_menu'))
    {
      alert('play music')
    }
  }

  clickM() {
    alert('menu')
  }

  onScroll(event: any) {
    if(this.notScrolly && this.notEmptyMusic){
      this.scrollLoaded = false;
      this.notScrolly = false;
      this.loadNextMusics();
    }
  }

  loadNextMusics(){
    this.musicService.getPartOfMusicsByUserId(this.lastIndex).pipe(finalize(()=>{this.scrollLoaded = true; this.notScrolly=true})).subscribe(
      (res: Music[])=>{
        if(res.length>0){
          this.musics = this.musics.concat(res);
          this.lastIndex = res[res.length-1].musicId;
        }
        else{
          this.notEmptyMusic = false;
        }
      }, error => {
        if (error.status != 0) {
          this.matSnackBar.open(`При получении музыки возникла ошибка, статусный код ${error.status}`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar'});
        }
      }
    )
  }

  checkss() {
    this.musics = this.musics.concat(this.musics)
  }
}
