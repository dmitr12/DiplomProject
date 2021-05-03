import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {EditFollower} from "../../models/followers/editFollower";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FollowerService {

  constructor(
    private http: HttpClient
  ) { }

  addFollower(editFollower: EditFollower){
    return this.http.post(`${environment.url}api/follower/addFollower`, editFollower);
  }

  isFollowerExists(userToFollowId: number): Observable<boolean>{
    return this.http.get<boolean>(`${environment.url}api/follower/IsCurrentUserFollowed/${userToFollowId}`)
  }

  deleteFollower(userToFollowId: number){
    return this.http.delete(`${environment.url}api/follower/deleteFollower/${userToFollowId}`);
  }
}
