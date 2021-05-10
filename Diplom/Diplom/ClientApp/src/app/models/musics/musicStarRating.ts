export class MusicStarRating {

  constructor(userId: number, musicId: number, rating: number, liked = false) {
    this.userId = userId;
    this.musicId = musicId;
    this.rating = rating;
    this.liked = liked;
  }

  userId: number;
  musicId: number;
  rating: number;
  liked: boolean
}
