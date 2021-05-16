import { Injectable} from '@angular/core';
import * as moment from 'moment';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  public audioObj = new Audio();
  isVisible = false;

  currentTime = '00:00';
  duration='00:00';
  delay: any;
  isPlaying = false;
  audioName = "";
  idMusic: number=-1;
  currentAudioFileName = '';

  openFile(idM: number, fileName: string, name: string) {
    this.isVisible = true
    this.duration = '00:00';
    this.currentAudioFileName = fileName;
    this.idMusic = idM;
    this.audioName = name;
    this.audioObj.src = `${environment.url}api/music/${fileName}`
    this.audioObj.preload = "auto"
    this.audioObj.load();
    this.play();
    this.audioObj.onended = () => {
      this.clearMusic()
    }
  }

  play() {
    if (this.audioObj.src) {
      this.updateProgress();
      this.audioObj.play();
      if (this.currentAudioFileName)
        this.isPlaying = true;
    }
  }

  clearMusic() {
    this.pause();
    clearTimeout(this.delay);
    this.audioObj = new Audio();
    this.audioName = "";
    this.duration = "00:00";
    this.currentTime = "00:00";
    this.isPlaying = false;
    this.isVisible = false;
  }

  pause() {
    clearTimeout(this.delay);
    this.audioObj.pause();
    if (this.currentAudioFileName)
      this.isPlaying = false;
  }

  stop() {
    this.audioObj.pause();
    this.audioObj.currentTime = 0;
  }

  timeFormat(time: any, format = "mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  mouseDown() {
    if(this.audioObj.currentTime != 0){
      clearTimeout(this.delay);
      this.audioObj.pause();
    }
  }

  mouseUp(ev: any) {
    if(this.audioObj.currentTime != 0){
      var value = ev.target.value;
      var parsed = parseFloat(value);
      this.audioObj.currentTime = parsed;
      this.audioObj.play();
      this.isPlaying = true;
      this.updateProgress();
    }
  }

  updateProgress() {
      this.currentTime = this.timeFormat(this.audioObj.currentTime);
      if (this.timeFormat(this.audioObj.duration) != 'Invalid date') {
        this.duration = this.timeFormat(this.audioObj.duration);
      }
      this.delay = setTimeout(() => {
        this.updateProgress();
      }, 1000);
  }

  mute() {
    this.audioObj.muted = true;
    this.audioObj.volume = 0;
  }

  unmute() {
    this.audioObj.muted = false;
  }

  changeVolume() {
    this.unmute();
  }
}
