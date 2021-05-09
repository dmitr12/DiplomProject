export class ChangeUserPassword {

  constructor(oldPassword: string, newPassword: string) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }

  oldPassword: string;
  newPassword: string;
}
