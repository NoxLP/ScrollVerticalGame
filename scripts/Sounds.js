import { game, menu } from "./main.js";

export class Sounds {
  constructor(volume) {
    this.volume = volume;
    this.gamePlayList = [
      "assets/music/KineticFloorWave.mp3",
      "assets/music/CruiseOnPolygon.mp3",
      "assets/music/ASoloGunner.mp3"
    ];
    this.menuPlayList = [
      "assets/music/menu/menu.mp3",
      "assets/music/menu/battle.mp3",
      "assets/music/menu/loading.mp3",
      "assets/music/menu/slow-travel.mp3"
    ];
    this.currentSong = 0;

    this.songsAudio = document.getElementById("musicAudio");
    this.songsAudio.src = this.menuPlayList[0];
    this.songsAudio.volume = this.volume - 0.2;
    this.songsAudio.load();
    this.songsAudio.play();
    this.songsAudio.addEventListener("ended", () => { this.changeMusicByGameState(); });
  }
  changeMusicByGameState() {
    this.songsAudio.src = menu.gameIsInMenu() ? 
      this.menuPlayList[(this.currentSong++) % this.menuPlayList.length] :
      this.gamePlayList[(this.currentSong++) % this.gamePlayList.length];
    this.songsAudio.load();
    this.songsAudio.play();
  }
  playAudio(path, volume) {
    let audio = new Audio(path);
    audio.volume = volume ? volume : this.volume;
    audio.play();
  }
}