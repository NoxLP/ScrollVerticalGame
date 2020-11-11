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
    this.lastMove = null;
    this.moves = 0;
  }
  moveEnemyLeftToRight() {
    if(this.x < this.initialX + game.enemyTotalStepPx) {
      console.log("leftToRight");
      this.x += game.enemyFrameStep;
      this.update();
      window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); });
    } else {
      this.lastMove = "right";
      this.initialX = this.x;

      if(this.moves < 4) {
        this.moves++;
        setTimeout(() => { window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
      } else {
        this.moves = 0;
        this.moveEnemyDown();
      }
    }
  }
  moveEnemyRightToLeft() {
    if(this.x > this.initialX - game.enemyTotalStepPx) {
      console.log("RightToleft");
      this.x -= game.enemyFrameStep;
      this.update();
      window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); });
    } else {
      this.lastMove = "left";
      this.initialX = this.x;
      
      if(this.moves < 4) {
        this.moves++;
        setTimeout(() => { window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
      } else {
        this.moves = 0;
        this.moveEnemyDown();
      }
    }
  }
  moveEnemyDown() {
    if(this.y < this.initialY + game.canvasRowHeight) {
      console.log("down");
      this.y += game.enemyFrameStep;
      this.update();
      window.requestAnimationFrame(() => { this.moveEnemyDown(); });
    } else {
      this.initialY = this.y;
      if(this.lastMove === "right") {
        this.moveEnemyRightToLeft();
      } else {
        this.moveEnemyLeftToRight();
      }
    }
  }
}