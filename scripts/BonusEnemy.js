import { CollisionableObject } from "./base/CollisionableObject.js";
import { game } from "./main.js";

export class BonusEnemy extends CollisionableObject {
  constructor() {
    let elem = new Image();
    elem.src = `assets/images/spaceships/bonus.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("bonusEnemy");
    super(elem, -game.bonusSize[0] - 15, 0, game.bonusSize[0], game.bonusSize[1]);

    this.animationFrameId = null;
  }
  resetPosition() {
    this.elem.style.display = "none";
    this.x = -this.elem.width - 15;
    this.y = 0;
    this.collisionable = false;
  }
  cancelAnimation() {
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.animationFrameId);
  }
  move() {
    //console.log("in move")
    if(this.x < game.width){
      //console.log("if move done")
      this.x += game.enemyFrameStep;
      this.animationFrameId = window.requestAnimationFrame(() => {this.move();});
    } else {
      this.resetPosition();
      this.cancelAnimation();
      this.animationFrameId = setTimeout(() => { 
        this.animationFrameId = window.requestAnimationFrame(() => {
          this.x = - this.width;
          this.elem.style.display = "inline";
          this.collisionable = true;
          this.move();
        });
      }, game.bonusTimeout);
    }
  }
}