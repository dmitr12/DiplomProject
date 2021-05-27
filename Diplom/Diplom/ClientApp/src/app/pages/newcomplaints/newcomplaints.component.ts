import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ComplaintService} from "../../services/complaints/complaint.service";
import {Complaint} from "../../models/complaints/complaintInfo";
import {finalize} from "rxjs/operators";
import {CheckComplaint} from "../../models/complaints/checkComplaint";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-newcomplaints',
  templateUrl: './newcomplaints.component.html',
  styleUrls: ['./newcomplaints.component.css']
})
export class NewcomplaintsComponent implements OnInit {

  complaintsLoaded = false;
  newComplaints: Complaint[] = [];
  filterComplaints: Complaint[] = [];

  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar,
    private complaintService: ComplaintService
  ) { }

  ngOnInit() {
    this.complaintService.getComplaints().pipe(finalize(()=>this.complaintsLoaded = true))
      .subscribe((res:Complaint[])=>{
      this.newComplaints = res.filter(c=>!c.isChecked);
      this.filterComplaints = this.newComplaints;
    }, error => {
        if (error.status == 401) {
          this.router.navigate(['auth']);
        }
        else if (error.status == 403) {
          this.router.navigate(['auth']);
        }
        else if (error.status != 0) {
          this.matSnackBar.open(`При получении жалоб возникла ошибка`, '', {
            duration: 3000,
            panelClass: 'custom-snack-bar-error'
          });
        } else {
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      })
  }

  check(complaint: Complaint) {
    this.complaintService.checkComplaint(new CheckComplaint(complaint.complaintId)).subscribe((res:any)=>{

    }, error => {
      if (error.status == 401) {
        this.router.navigate(['auth']);
      }
      else if (error.status == 403) {
        this.router.navigate(['auth']);
      }
      else if (error.status == 404){
        this.matSnackBar.open(`Жалоба не найдена`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      }
      else if (error.status != 0) {
        this.matSnackBar.open(`При получении жалоб возникла ошибка`, '', {
          duration: 3000,
          panelClass: 'custom-snack-bar-error'
        });
      } else {
        this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
      }
    });
    this.router.navigate([`musicinfo`, `${complaint.musicId}`]);
  }

  changeComplaintType(event: MatSelectChange) {
    if(event.value == 0){
      this.filterComplaints = this.newComplaints;
    }
    else{
      this.filterComplaints = this.newComplaints.filter((c=>c.complaintType == event.value));
    }
  }
}
