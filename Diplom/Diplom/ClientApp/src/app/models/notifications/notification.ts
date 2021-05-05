export enum NotificationType {
  AddedMusic = 1
}

export class Notification {
  notificationId: number;
  userId: number;
  sourceId: number;
  notificationType: NotificationType;
  message: string;
  isChecked: boolean;
  createDate: Date;
  routeString: string;
}
