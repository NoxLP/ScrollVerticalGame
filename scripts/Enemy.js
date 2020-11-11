import { CollisionableObject } from "./CollisionableObject.js";
import { game } from "./main.js";

export class Enemy extends CollisionableObject {
  constructor(type, x, y, row, column) {
    let elem = new Image();
    elem.src = `../assets/images/spaceships/enemy${type}.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("enemy");
    //constructor(domElement, x, y, width, height, topBottom = "top", leftRight = "left")
    super(elem, x, y, game.enemiesSize[type][0], game.enemiesSize[type][1]);

    this.type = type;
    this.row = row;
    this.column = column;
    this.initialX = x;
    this.initialY = y;
  }
  moveEnemyLeftToRight() {
    if(this.x < this.initialX + game.enemyTotalStepPx) {
      this.x += game.enemyFrameStep;
      window.requestAnimationFrame(moveEnemyLeftToRight)
    } else {
      this.initialX = this.x;
    }
  }
  moveEnemyRightToLeft() {
    if(this.x > this.initialX - game.enemyTotalStepPx) {
      this.x -= game.enemyFrameStep;
      window.requestAnimationFrame(moveEnemyRightToLeft)
    } else {
      this.initialX = this.x;
    }
  }
  moveEnemyDown() {
    if(this.y < this.initialY + game.canvasRowHeight) {
      this.y += game.enemyFrameStep;
      window.requestAnimationFrame(moveEnemyDown)
    } else {
      this.initialY = this.y;
    }
  }
}