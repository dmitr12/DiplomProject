export enum ComplaintType {
  Copyright = 1,
  Other = 2,
  Comment = 3
}

export class Complaint {
  complaintId: number;
  complaintType: ComplaintType;
  userId: number;
  musicId: number;
  message: string;
  isChecked: boolean;
  createDate: Date;
}
