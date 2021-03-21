import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {Music} from "../../models/musics/music";

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(
    private http: HttpClient
  ) { }

  getMusicGenres(): Observable<MusicGenreInfo[]>{
    return this.http.get<MusicGenreInfo[]>(`${environment.url}api/music/ListMusicGenres`);
  }

  getMusicsByUserId(): Observable<Music[]>{
    return this.http.get<Music[]>(`${environment.url}api/music/ListMusicsByUserId`)
  }

  addmusic(formData: FormData) {
    return this.http.post(`${environment.url}api/music/AddMusic`, formData);
  }

  getFileNameByPath(path: string):string {
    var arr = path.split('\\');
    return arr[arr.length - 1];
  }

  checkFileFormat(fileName:string, regularFormat: string): boolean {
    var format = fileName.substring(fileName.indexOf('.') + 1, fileName.length)
    if (format == regularFormat)
      return true;
    return false;
  }
}
