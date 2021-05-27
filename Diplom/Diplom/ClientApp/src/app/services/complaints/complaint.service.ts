import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AddComplaint} from "../../models/complaints/addComplaint";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Complaint} from "../../models/complaints/complaintInfo";
import {CheckComplaint} from "../../models/complaints/checkComplaint";

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(
    private http: HttpClient
  ) {
  }

  isUserComplained(userId: number, musicId: number):Observable<boolean>{
    let httpParams = new HttpParams().set('userId', userId.toString()).set('musicId', musicId.toString());
    return this.http.get<boolean>(`${environment.url}api/Complaint/IsUserComplained`, {params: httpParams});
  }

  addComplaint(addComplaint: AddComplaint){
    return this.http.post(`${environment.url}api/Complaint/AddComplaint`, addComplaint);
  }

  getComplaints(): Observable<Complaint[]>{
    return this.http.get<Complaint[]>(`${environment.url}api/Complaint/AllComplaints`);
  }

  checkComplaint(checkComplaint: CheckComplaint){
    return this.http.put(`${environment.url}api/Complaint/CheckComplaint`, checkComplaint);
  }
}
