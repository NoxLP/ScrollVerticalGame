import { CollisionableObject } from "./base/CollisionableObject.js";
import { game } from "./main.js";

export class BonusEnemy extends CollisionableObject {
  constructor(x, y) {
    let elem = new Image();
    elem.src = `../assets/images/spaceships/bonus.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("bonusEnemy");
    super(elem, x, y, game.bonusSize[0], game.bonusSize[1]);

    this.animationFrameId = null;
  }
  reset() {
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.animationFrameId);
    this.elem.style.display = "none";
    this.x = 0;
    this.y = 0;
  }
  move(){
    //console.log("in move")
    if(this.x < game.width){
      //console.log("if move done")
      this.x += game.enemyFrameStep;
      this.update();
      this.animationFrameId = window.requestAnimationFrame(() => {this.move();});
    }else{
      this.elem.style.opacity = 0;
      this.animationFrameId = setTimeout(() => { 
        this.animationFrameId = window.requestAnimationFrame(() => {
          this.x = - this.width;
          this.elem.style.opacity = 1;
          this.move();
        });
      }, 10000);
    }
  }
}