export class FilterMusicModel{

  constructor(musicName: string, genreId: number) {
    this.musicName = musicName;
    this.genreId = genreId;
  }

  musicName: string;
  genreId: number;
}
