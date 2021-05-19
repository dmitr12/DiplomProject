export enum NotificationType {
  AddedMusic = 1,
  AddedPlaylist = 2
}

export class Notification {
  notificationId: number;
  userId: number;
  sourceId: number;
  notificationType: NotificationType;
  message: string;
  createDate: Date;
  routeString: string;
}
