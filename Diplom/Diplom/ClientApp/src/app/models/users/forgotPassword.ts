import {Guid} from "guid-typescript";

export class ForgotPassword {

  constructor(userId: number, verifyCode: Guid, password: string) {
    this.userId = userId;
    this.verifyCode = verifyCode;
    this.password = password;
  }

  userId: number;
  verifyCode: Guid;
  password: string;
}
