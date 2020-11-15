import { CollisionableObject } from "./base/CollisionableObject.js";
import { game } from "./main.js";
import { PlayerBullet } from "./bullets/PlayerBullet.js";

/**
 * Player class
 */
export class Player extends CollisionableObject {
  constructor() {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "assets/images/spaceships/player1.png";
    elem.id = "player";
    super(elem, game.playerInitialCoords[0], game.playerInitialCoords[1], game.playerSize[0], game.playerSize[1]);

    this.lastBulletTime = null;
    this.shootTimer;
    this._lives = 3;
    this.responsive = true;
  }
  get lives() { return this._lives; }
  loseLive() {
    let live = document.getElementById(`live${this._lives}`);
    live.style.filter = "brightness(0.3)";
    live.style.transition = "filter 1s ease-out";
    this._lives--;
  }
  resetLives() {
    this._lives = 3;
    for(let i = 1; i < 4; i++) {
      let live = document.getElementById(`live${i}`);
      live.style.filter = "";
    }
  }
  /**
   * Move the player ship one step left
   */
  moveLeft = function () {
    if (this.x > game.step && game.keysDown.ArrowLeft) {
      this.x -= game.step;
      window.requestAnimationFrame(() => { this.moveLeft(); });
    }
  }
  /**
   * Move the player ship one step right
   */
  moveRight = function () {
    if (this.x + this.width < game.width - game.step && game.keysDown.ArrowRight) {
      this.x += game.step;
      window.requestAnimationFrame(() => { this.moveRight(); });
    }
  }
  moveUp = function () {
    console.log("UP", this.y, game.keysDown.ArrowUp)
    if (this.y > game.step && game.keysDown.ArrowUp) {
      console.log("INSIDE up")
      this.y -= game.step;
      window.requestAnimationFrame(() => { this.moveUp(); });
    }
  }
  moveDown = function () {
    console.log("DOWN")
    if (this.y + this.height < game.height - game.step && game.keysDown.ArrowDown) {
      console.log("INSIDE down")
      this.y += game.step;
      window.requestAnimationFrame(() => { this.moveDown(); });
    }
  }
  /**
   * Create bullets while the spacebar is pressed
   */
  shoot() {
    if(game.keysDown.Space) {
      //console.log("BULLET")
      const bullet = new PlayerBullet(
        this.x + (this.width / 2) - (game.bulletSize[0] / 2), 
        this.y - (game.bulletSize[1] * 0.5));
      /*
      Para mover la bala hacia arriba:
      1.- window.requestAnimationFrame(bullet.move)
      */
      bullet.move();
      if(!this.shootTimer)
        this.shootTimer = setInterval(() => { this.shoot(); }, game.bulletTimeout);
    } else {
      //console.log("FALSE")
      clearInterval(this.shootTimer);
      this.shootTimer = null;
    }
  }
  teleportToInitialPosition() {
    this.x = game.playerInitialCoords[0];
    this.y = game.playerInitialCoords[1];
    this.elem.style.display = "inline";
    this.responsive = true;
  }
}