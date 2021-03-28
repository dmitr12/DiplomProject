export class MusicStarRating {

  constructor(musicId: number, userId: number, rating: number) {
    this.musicId = musicId;
    this.userId = userId;
    this.rating = rating;
  }

  musicId: number;
  userId: number;
  rating: number;
}
