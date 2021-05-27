import {ComplaintType} from "./complaintInfo";

export class AddComplaint {

  constructor(complaintType: ComplaintType, musicId: number, message: string) {
    this.complaintType = complaintType;
    this.musicId = musicId;
    this.message = message;
  }

  complaintType: ComplaintType;
  musicId: number;
  message: string;
}
