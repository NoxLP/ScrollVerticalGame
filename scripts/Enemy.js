import { CollisionableObject } from "./CollisionableObject.js";
import { game } from "./main.js";

/**
 * Class for enemies
 */
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
    this.lastMove = null;
  }
  get canvasColumn() { return Math.round(this.x / game.canvasColumnWidth); }
  get canvasRow() { return Math.round(this.y / game.canvasRowHeight); }
  moveRightToX(target) {
    if(this.x < target) {
      console.log("leftToRight");
      this.x += game.enemyFrameStep;
      this.update();
      window.requestAnimationFrame(() => { this.moveRightToX(target); });
    } else {
      console.log("TIMEOUT")
      setTimeout(() => { window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
    }
  }
  moveLeftToX(target) {
    if(this.x > target) {
      console.log("leftToRight");
      this.x -= game.enemyFrameStep;
      this.update();
      window.requestAnimationFrame(() => { this.moveLeftToX(target); });
    } else {
      console.log("TIMEOUT")
      setTimeout(() => { window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
    }
  }
  moveDownToY(target) {
    if(this.y < target) {
      console.log("moveDown")
      this.y += game.enemyFrameStep;
      this.update();
      window.requestAnimationFrame(() => { this.moveDownToY(target); });
    } else {
      if(this.lastMove === "right") {
        setTimeout(() => { window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
      } else {
        setTimeout(() => { window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
      }
    }
  }
  /**
   * Move enemy to the right. Part of the classical movement pattern
   */
  moveEnemyLeftToRight() {
    if(!game.enemyIsInCanvasColumn(game.enemiesPerRow - 1, game.canvasColumns - 1)) {
      const nextCanvasColumnX = game.getXOfCanvasColumn(this.canvasColumn + 1);
      console.log("moveEnemyLeftToRight", this.x, nextCanvasColumnX)
      this.moveRightToX(nextCanvasColumnX);
    } else {
      this.lastMove = "right";
      this.moveEnemyDown();
    }
  }
  /**
   * Move enemy to the left. Part of the classical movement pattern
   */
  moveEnemyRightToLeft() {
    if(!game.enemyIsInCanvasColumn(0, -1)) {
      const nextCanvasColumnX = game.getXOfCanvasColumn(this.canvasColumn - 1);
      console.log("moveEnemyLeftToRight", this.x, nextCanvasColumnX)
      this.moveLeftToX(nextCanvasColumnX);
    } else {
      this.lastMove = "left";
      this.moveEnemyDown();
    }
  }
  /**
   * Move enemy down. Part of the classical movement pattern
   */
  moveEnemyDown() {
    const nextCanvasRowY = game.getYOfCanvasRow(this.canvasRow + 1);
    this.moveDownToY(nextCanvasRowY);
  }
}