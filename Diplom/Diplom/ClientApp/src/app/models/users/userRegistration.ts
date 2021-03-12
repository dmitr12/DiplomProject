export class UserRegistration {

  constructor(mail: string, login: string, password: string) {
    this.mail = mail;
    this.login = login;
    this.password = password;
  }

  mail: string;
  login: string;
  password: string;
}
