import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MusicInfo} from "../../models/musics/musicInfo";
import {PlaylistInfo} from "../../models/playlists/playlistInfo";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(
    private http: HttpClient
  ) { }

  addPlaylist(formData: FormData) {
    return this.http.post(`${environment.url}api/playlist/addPlaylist`, formData);
  }

  getUserPlaylists(): Observable<PlaylistInfo[]>{
    return this.http.get<PlaylistInfo[]>(`${environment.url}api/playlist/UserPlaylists`);
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
