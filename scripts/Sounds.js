export class Sounds {
  constructor(volume) {
    this.volume = volume;
  }
  playAudio(path, volume) {
    let audio = new Audio(path);
    audio.volume = volume ? volume : this.volume;
    audio.play();
  }
}