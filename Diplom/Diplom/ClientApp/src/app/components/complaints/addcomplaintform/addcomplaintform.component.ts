import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../../services/loader/loader.service";
import {ComplaintService} from "../../../services/complaints/complaint.service";
import {AddComplaint} from "../../../models/complaints/addComplaint";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-addcomplaintform',
  templateUrl: './addcomplaintform.component.html',
  styleUrls: ['./addcomplaintform.component.css']
})
export class AddcomplaintformComponent implements OnInit {

  form = new FormGroup({
    complaintType: new FormControl(null, [Validators.required]),
    message: new FormControl(null)
  })
  postingQuery: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private complaintService: ComplaintService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public loaderService: LoaderService,
    private dialogSource: MatDialogRef<AddcomplaintformComponent>
  ) {
    dialogSource.disableClose = true;
  }

  ngOnInit() {
  }

  addComplaint() {
    this.postingQuery = true;
    this.complaintService.addComplaint(new AddComplaint(this.form.value.complaintType, Number(this.data), this.form.value.message))
      .pipe(finalize(()=>this.postingQuery = false))
      .subscribe((res:any)=>{
        if(res && res.msg){
          this.matSnackBar.open(`${res.msg}`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
        }
        else{
          this.matSnackBar.open(`Жалоба успешно отправлена`, '', {duration: 3000, panelClass: 'custom-snack-bar-success'});
          this.dialogSource.close(true);
        }
    }, error => {
        if(error.status == 401){
          this.router.navigate(['auth']);
        }
        else if(error.status == 404){
          this.matSnackBar.open(error.error.msg, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else if(error.status != 0){
          this.matSnackBar.open(`При отправке жалобы возникла ошибка`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
        else{
          this.matSnackBar.open(`Сервер отключен`, '', {duration: 3000, panelClass: 'custom-snack-bar-error'});
        }
      })
  }
}
