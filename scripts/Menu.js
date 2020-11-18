import { game } from "./main.js";

export class Menu {
  constructor() {
    this._menuSection = document.getElementById("menu");
    this._gameSection = document.getElementById("background");

    this._gifs = [
      document.getElementById("fGif"),
      document.getElementById("nGif"),
      document.getElementById("aGif")
    ];
    this._gifsTimerId;
    this.gifsAnimation = true;
    if(this.gifsAnimation) {
      this._animateGifs();
      this._gifsTimerId = setInterval(() => { this._animateGifs(); }, 10000);
    }
    this._lastAnimation;
  }
  goToMenu() {
    this._menuSection.style.display = "block";
    this._gameSection.style.display = "none";
    if(this.gifsAnimation) {
      this._animateGifs();
      this._gifsTimerId = setInterval(() => { this._animateGifs(); }, 10000);
    }
  }
  goToGame() {
    clearInterval(this._gifsTimerId);
    this._menuSection.style.display = "none";
    this._gameSection.style.display = "block";
    player.responsive = false;
    setTimeout(() => { game.start(); }, 300);
  }
  gameIsInMenu() {
    return this._menuSection.style.display === "block";
  }
  _animateGifs() {
    let animation;
    while((animation = Math.round(Math.random() * 3)) === this._lastAnimation) ;
    console.log("animating gifs", animation)
    for (let i = 0; i < this._gifs.length; i++) {
      this._gifs[i].style.transition = "";
      this._gifs[i].classList.remove(`menuGifsFinal${this._lastAnimation}`);
      setTimeout(() => { 
        this._gifs[i].classList.add(`menuGifsFinal${animation}`); }, 1500 * i);
    }
    this._lastAnimation = animation;
  }
}