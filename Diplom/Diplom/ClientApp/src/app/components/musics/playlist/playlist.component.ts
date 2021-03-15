import { Component, OnInit } from '@angular/core';
import {AudioService} from "../../../services/audio.service";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit() {
  }

  click(){
    this.audioService.openFile(1,"https://www.dropbox.com/s/10tgceznwsokd2p/TestLogin_9.3.2021%2021%3A32%3A37_two.mp3?dl=1",'TestMusic')
  }
}
