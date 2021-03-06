import { Injectable, EventEmitter } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {MusicGenreInfo} from "../../models/musics/musicGenreInfo";
import {FilterMusicModel} from "../../models/musics/filterMusicModel";
import {MusicInfo} from "../../models/musics/musicInfo";
import {MusicStarRating} from "../../models/musics/musicStarRating";

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(
    private http: HttpClient
  ) {
  }

  getFilteredMusicList(filter: FilterMusicModel): Observable<MusicInfo[]> {
    let httpParams = new HttpParams().set('musicName', filter.musicName).set('genreId', filter.genreId.toString());
    return this.http.get<MusicInfo[]>(`${environment.url}api/music/FilterMusic`, {params: httpParams});
  }

  getMusicGenres(): Observable<MusicGenreInfo[]>{
    return this.http.get<MusicGenreInfo[]>(`${environment.url}api/music/ListMusicGenres`);
  }

  getMusicsByUserId(): Observable<MusicInfo[]>{
    return this.http.get<MusicInfo[]>(`${environment.url}api/music/ListMusicsByUserId`);
  }

  getNewMusics(): Observable<MusicInfo[]>{
    return this.http.get<MusicInfo[]>(`${environment.url}api/music/GetNewMusics`);
  }

  getMusic(id: number): Observable<MusicInfo>{
    return this.http.get<MusicInfo>(`${environment.url}api/music/GetMusic/${id}`);
  }

  getPartOfMusicsByUserId(lastIndex: number): Observable<MusicInfo[]>{
    return this.http.get<MusicInfo[]>(`${environment.url}api/music/GetPartOfMusicsPyUserId/${lastIndex}`);
  }

  getLiked():Observable<MusicInfo[]>{
    return this.http.get<MusicInfo[]>(`${environment.url}api/music/GetLikedMusics`);
  }

  getMusicByPlaylist(playlistId: number): Observable<MusicInfo[]>{
    return this.http.get<MusicInfo[]>(`${environment.url}api/music/GetMusicByPlaylist/${playlistId}`);
  }

  addmusic(formData: FormData) {
    return this.http.post(`${environment.url}api/music/AddMusic`, formData);
  }

  editMusic(formData: FormData){
    return this.http.put(`${environment.url}api/music/EditMusic`, formData);
  }

  deleteMusic(idMusic: number):Observable<any>{
    return this.http.delete(`${environment.url}api/music/DeleteMusic/${idMusic}`)
  }

  likeMusic(model: MusicStarRating){
    return this.http.post(`${environment.url}api/music/LikeMusic`, model);
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
