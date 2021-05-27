import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Complaint, ComplaintType} from "../../models/complaints/complaintInfo";

@Component({
  selector: 'app-complaint-card',
  templateUrl: './complaint-card.component.html',
  styleUrls: ['./complaint-card.component.css']
})
export class ComplaintCardComponent implements OnInit {

  typeMapper = new Map<ComplaintType, string>([
    [ComplaintType.Copyright, 'Нарушение авторских прав'],
    [ComplaintType.Other, 'Другая причина'],
    [ComplaintType.Comment, 'Жалоба на комментарий']
  ])

  imageMapper = new Map<ComplaintType, string>([
    [ComplaintType.Copyright, "/assets/images/copyright.png"],
    [ComplaintType.Other, "/assets/images/complaint.png"],
    [ComplaintType.Comment, "/assets/images/comment.jpg"]
  ])

  @Output() checkEvent = new EventEmitter<Complaint>();
  @Input() complaint: Complaint;
  @Input() buttonName: string;
  imageLoaded = false;

  constructor() { }

  ngOnInit() {
  }

  clickCheck() {
    this.checkEvent.emit(this.complaint);
  }
}
