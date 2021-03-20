import { Component, OnInit } from '@angular/core';
import {AudioService} from "../../../services/player/audio.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MusicService} from "../../../services/music/music.service";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(
    private audioService: AudioService,
    private musicService: MusicService
  ) { }

  form: FormGroup;
  formData: FormData;

  ngOnInit() {
    this.formData = new FormData();

    this.form = new FormGroup({
      musicName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      musicFileName: new FormControl(null, [Validators.required]),
      musicImageName: new FormControl(null),
      musicGenreId: new FormControl(null, [Validators.required])
    })

  }

  changeImageFile(files: any) {
    this.formData.delete("MusicImageFile");
    this.formData.append("MusicImageFile", files[0], files[0].name);
  }

  changeMusicFile(files: any) {
    this.formData.delete("MusicFile");
    this.formData.append("MusicFile", files[0], files[0].name);
  }

  add() {
    let fileImageName;
    let fileMusicName = this.musicService.getFileNameByPath(this.form.value.musicFileName);
    if (this.form.value.musicImageName===null)
      fileImageName = '';
    else
      fileImageName = this.musicService.getFileNameByPath(this.form.value.musicImageName)
    if (!this.musicService.checkFileFormat(fileMusicName, "mp3")) {
      alert('Выбран неверный формат аудозаписи')
      return;
    }
    if (fileImageName) {
      if (!this.musicService.checkFileFormat(fileImageName, 'png') && !this.musicService.checkFileFormat(fileImageName, 'jpg')) {
        alert('Выбран неверный формат изображения')
        return;
      }
    }
    this.formData.delete("MusicGenreId");
    this.formData.delete("MusicName");
    this.formData.append("MusicGenreId", this.form.value.musicGenreId);
    this.formData.append("MusicName", this.form.value.musicName);
    this.musicService.addmusic(this.formData).subscribe((response: any) => {
        if(response && response.msg)
          alert(response.msg)
      else
        alert('added')
      },
      err => alert('Статусный код '+err.status),
    );
  }

  click(){
    this.audioService.openFile(1,"https://www.dropbox.com/s/1u1eci75uk6e5zr/TestLogin_18.3.2021%2021%3A30%3A2_m.mp3?dl=1",'TestMusic')
  }
}
