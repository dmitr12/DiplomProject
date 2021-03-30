import {Guid} from "guid-typescript";

export class MusicComment{

  constructor(comment: string, commentDate: any, userId: number, musicId: number, parentIdComment: Guid) {
    this.comment = comment;
    this.commentDate = commentDate;
    this.userId = userId;
    this.musicId = musicId;
    this.parentIdComment = parentIdComment;
  }

  idComment: Guid = null;
  comment: string;
  commentDate: any;
  userId: number;
  musicId: number;
  parentIdComment: Guid;
}
