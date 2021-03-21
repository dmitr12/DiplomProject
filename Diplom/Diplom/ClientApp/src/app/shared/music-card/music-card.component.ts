import {Component, Input, OnInit} from '@angular/core';
import {Music} from "../../models/musics/music";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddmusicformComponent} from "../../components/musics/addmusicform/addmusicform.component";
import {DeletemusicformComponent} from "../../components/musics/deletemusicform/deletemusicform.component";

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.css']
})
export class MusicCardComponent implements OnInit {

  @Input() data: Music
  dialogSource: any;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
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

  edit(musicId: number) {

  }

  delete(musicId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = musicId;
    this.dialogSource = this.dialog.open(DeletemusicformComponent, dialogConfig);
    // this.dialogSource.afterClosed().subscribe();
  }
}
