import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MusicCommentInfo} from "../../models/comments/musicCommentInfo";
import {environment} from "../../../environments/environment";
import {MusicComment} from "../../models/comments/musicComment";
import {Guid} from "guid-typescript";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient
  ) { }

  getCommentsForMusic(musicId: number):Observable<MusicCommentInfo[]>{
    return this.http.get<MusicCommentInfo[]>(`${environment.url}api/comment/${musicId}`);
  }

  musicCommentOn(musicComment: MusicComment){
    return this.http.post(`${environment.url}api/Comment/CommnetOn`, musicComment);
  }
}
