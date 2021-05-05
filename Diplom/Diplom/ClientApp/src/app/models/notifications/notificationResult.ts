import {Notification} from "./notification";

export class NotificationResult {
  notification: Notification;
  followers: number[];
  operationCompleted: boolean;
  errorMessage: string;
}
