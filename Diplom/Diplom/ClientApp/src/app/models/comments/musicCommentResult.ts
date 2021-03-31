import {MusicCommentInfo} from "./musicCommentInfo";

export enum CommentChangedType{
  added = 1,
  deleted = 2
}

export class MusicCommentResult {
  result: boolean;
  commentChangedType: CommentChangedType;
  musicCommentInfo: MusicCommentInfo;
}
