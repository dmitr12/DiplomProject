import { Component, OnInit } from '@angular/core';
import {AudioService} from "../../../services/player/audio.service";

@Component({
  selector: 'app-authlayout',
  templateUrl: './authlayout.component.html',
  styleUrls: ['./authlayout.component.css']
})
export class AuthlayoutComponent implements OnInit {

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit() {
    this.audioService.clearMusic();
  }

}
