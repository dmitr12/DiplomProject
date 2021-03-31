import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Music} from "../../models/musics/music";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DeletemusicformComponent} from "../../components/musics/deletemusicform/deletemusicform.component";
import {EditmusicformComponent} from "../../components/musics/editmusicform/editmusicform.component";
import {AudioService} from "../../services/player/audio.service";
import {MusicInfo} from "../../models/musics/musicInfo";

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.css']
})
export class MusicCardComponent implements OnInit {

  @Input() data: MusicInfo;
  @Output() onDeleted = new EventEmitter<number>();
  @Output() onEdited = new EventEmitter<MusicInfo>();
  dialogSource: any;

  constructor(
    private dialog: MatDialog,
    private audioService: AudioService
  ) { }

  ngOnInit() {
  }

  edit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.data;
    this.dialogSource = this.dialog.open(EditmusicformComponent, dialogConfig);
    this.dialogSource.afterClosed().subscribe(result=>{
      if (result !== 'false'){
        if(this.audioService.idMusic == this.data.id)
          this.audioService.clearMusic();
        this.onEdited.emit(this.data);
      }
    });
  }

  delete() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.data.id;
    this.dialogSource = this.dialog.open(DeletemusicformComponent, dialogConfig);
    this.dialogSource.afterClosed().subscribe(result=>{
      if (result !== 'false'){
        if(this.audioService.idMusic == this.data.id)
          this.audioService.clearMusic()
        this.onDeleted.emit(this.data.id);
      }
    });
  }

  play(event: any) {
    if(!event.target.className.includes('edit_menu'))
    {
      this.audioService.openFile(this.data.id, this.data.musicFileName, this.data.name)
    }
  }
}
