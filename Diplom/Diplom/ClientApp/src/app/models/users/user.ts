export enum UserRole{
  User = 1,
  Admin = 2
}

export class User {
  userId: number;
  login: string;
  mail: string;
}
