import { Component, OnInit } from '@angular/core';
import {Complaint} from "../../models/complaints/complaintInfo";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ComplaintService} from "../../services/complaints/complaint.service";
import {finalize} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-checkedcomplaints',
  templateUrl: './checkedcomplaints.component.html',
  styleUrls: ['./checkedcomplaints.component.css']
})
export class CheckedcomplaintsComponent implements OnInit {

  complaintsLoaded = false;
  checkedComplaints: Complaint[] = [];
  filterComplaints: Complaint[] = [];

  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar,
    private complaintService: ComplaintService
  ) { }

  ngOnInit() {
    this.complaintService.getComplaints().pipe(finalize(()=>this.complaintsLoaded = true))
      .subscribe((res:Complaint[])=>{
        this.checkedComplaints = res.filter(c=>c.isChecked);
        this.filterComplaints = this.checkedComplaints;
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
    this.router.navigate([`musicinfo`, `${complaint.musicId}`]);
  }

  changeComplaintType(event: MatSelectChange) {
    if(event.value == 0){
      this.filterComplaints = this.checkedComplaints;
    }
    else{
      this.filterComplaints = this.checkedComplaints.filter((c=>c.complaintType == event.value));
    }
  }
}
