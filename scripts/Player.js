import { CollisionableObject } from "./base/CollisionableObject.js";
import { game } from "./main.js";
import { PlayerBullet } from "./bullets/PlayerBullet.js";

/**
 * Player class
 */
export class Player extends CollisionableObject {
  constructor() {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/player1.png";
    elem.id = "player";
    super(elem, game.playerInitialCoords[0], game.playerInitialCoords[1], game.playerSize[0], game.playerSize[1]);

    this.lastBulletTime = null;
    this.shootTimer;
    this.lives = 3;
  }
  teleportToInitialPosition() {
    this.x = game.playerInitialCoords[0];
    this.y = game.playerInitialCoords[1];
    this.elem.style.display = "inline";
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
}