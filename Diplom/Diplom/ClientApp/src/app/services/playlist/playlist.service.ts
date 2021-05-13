import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PlaylistInfo} from "../../models/playlists/playlistInfo";
import {PlaylistsMusic} from "../../models/playlists/playlistsMusic";
import {FilterPlaylistModel} from "../../models/playlists/filterPlaylistModel";

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

  editPlaylist(formData: FormData){
    return this.http.put(`${environment.url}api/playlist/EditPlaylist`, formData);
  }

  deletePlaylist(playlistId: number){
    return this.http.delete(`${environment.url}api/playlist/DeletePlaylist/${playlistId}`);
  }

  addMusic(playlistsMusic: PlaylistsMusic){
    return this.http.post(`${environment.url}api/playlist/addMusic`, playlistsMusic);
  }

  getPlaylistInfo(playlistId: number): Observable<PlaylistInfo>{
    return this.http.get<PlaylistInfo>(`${environment.url}api/playlist/PlaylistInfo/${playlistId}`);
  }

  getUserPlaylists(): Observable<PlaylistInfo[]>{
    return this.http.get<PlaylistInfo[]>(`${environment.url}api/playlist/UserPlaylists`);
  }

  getFiltered(model: FilterPlaylistModel): Observable<PlaylistInfo[]>{
    let httpParams = new HttpParams().set('playlistName', model.playlistName);
    return this.http.get<PlaylistInfo[]>(`${environment.url}api/playlist/FilterPlaylist`, {params:httpParams});
  }

  getNewPlaylists():Observable<PlaylistInfo[]>{
    return this.http.get<PlaylistInfo[]>(`${environment.url}api/playlist/GetNewPlaylists`);
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
