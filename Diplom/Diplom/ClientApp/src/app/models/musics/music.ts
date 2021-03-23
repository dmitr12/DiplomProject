import {User} from "../users/user";

export class Music{
  musicId: number;
  musicName: string;
  musicFileName: string;
  musicUrl: string;
  musicImageName: string;
  musicImageUrl: string;
  userId: number;
  dateOfPublication: string;
  musicGenreId: number;
  user: User
}
