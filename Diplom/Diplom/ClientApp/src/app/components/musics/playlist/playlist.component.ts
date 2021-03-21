import { Component, OnInit } from '@angular/core';
import {AudioService} from "../../../services/player/audio.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
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

  dialogSource: any;
  musics: Music[] = [];
  loaded = false;

  constructor(
    private audioService: AudioService,
    private musicService: MusicService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.musicService.getMusicsByUserId().pipe(finalize(()=>this.loaded = true)).subscribe(
      (res: Music[])=>{
        this.musics = res;
        console.log(this.musics)
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

  check(event: Event) {
    if(!event.target.className.includes('edit_menu'))
    {
      alert('play music')
    }
  }

  clickM() {
    alert('menu')
  }
}
