import {NotificationType} from "./notification";

export class NotificationInfo {

  constructor(notificationId: number, userId: number, sourceId: number, notificationType: NotificationType,
              message: string, isChecked: boolean, createDate: Date, routeString: string) {
    this.notificationId = notificationId;
    this.userId = userId;
    this.sourceId = sourceId;
    this.notificationType = notificationType;
    this.message = message;
    this.isChecked = isChecked;
    this.createDate = createDate;
    this.routeString = routeString;
  }

  notificationId: number;
  userId: number;
  sourceId: number;
  notificationType: NotificationType;
  message: string;
  isChecked: boolean;
  createDate: Date;
  routeString: string;
}
