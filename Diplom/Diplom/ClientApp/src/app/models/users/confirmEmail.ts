import {Guid} from "guid-typescript";

export class ConfirmEmail {

  constructor(userId: number, verifyCode: Guid) {
    this.userId = userId;
    this.verifyCode = verifyCode;
  }

  userId: number;
  verifyCode: Guid;
}
