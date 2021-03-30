import {Guid} from "guid-typescript";

export class MusicCommentInfo {
  idComment: Guid;
  comment: string;
  commentDate: Date;
  parentIdComment: Guid;
  musicId: number;
  userId: number;
  userLogin: string;
  userAvatar: string;
}
