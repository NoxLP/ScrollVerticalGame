import { CollisionableObject } from "./base/CollisionableObject.js";
import { game, player } from "./main.js";

var lastId = -1;

/**
 * Class for enemies
 */
export class Enemy extends CollisionableObject {
  constructor(type, x, y, row, column) {
    let elem = new Image();
    elem.src = `assets/images/spaceships/enemy${type}.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("enemy");
    //constructor(domElement, x, y, width, height, topBottom = "top", leftRight = "left")
    super(elem, x, y, game.enemiesSize[type][0], game.enemiesSize[type][1]);
    this.id = lastId++;
    this._type = type;

    this.row = row;
    this.column = column;

    this.lastMove = null;
    this.animationFrameId = null;
  }
  get type() { return this._type; }
  set type(value) {
    this._type = value;
    this.elem.src = `assets/images/spaceships/enemy${this._type}.png`;
  }
  get canvasColumn() { return Math.round(this.x / game.canvasColumnWidth); }
  get canvasRow() { return Math.round(this.y / game.canvasRowHeight); }
  moveRightToTarget(target) {
    if (this.centerX < target) {
      //console.log("leftToRight");
      this.x += game.enemyFrameStep;
      if (this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
        return;
      } else {
        this.animationFrameId = window.requestAnimationFrame(() => { this.moveRightToTarget(target); });
      }
    } else {
      //console.log("TIMEOUT")
      this.animationFrameId = setTimeout(() => { this.animationFrameId = window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
    }
  }
  moveLeftToTarget(target) {
    if (this.centerX > target) {
      //console.log("leftToRight");
      this.x -= game.enemyFrameStep;
      if (this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
        return;
      } else {
        this.animationFrameId = window.requestAnimationFrame(() => { this.moveLeftToTarget(target); });
      }
    } else {
      //console.log("TIMEOUT")
      this.animationFrameId = setTimeout(() => { this.animationFrameId = window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
    }
  }
  moveDownToTarget(target) {
    if (this.centerY < target) {
      //console.log("moveDown")
      this.y += game.enemyFrameStep;
      if (this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
        return;
      } else {
        this.animationFrameId = window.requestAnimationFrame(() => { this.moveDownToTarget(target); });
      }
    } else {
      if (this.lastMove === "right") {
        this.animationFrameId = setTimeout(() => { this.animationFrameId = window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
      } else {
        this.animationFrameId = setTimeout(() => { this.animationFrameId = window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
      }
    }
  }
  /**
   * Move enemy to the right. Part of the classical movement pattern
   */
  moveEnemyLeftToRight() {
    if (!game.enemyIsInCanvasColumn(game.enemiesPerRow - 1, game.canvasColumns - 1)) {
      const nextCanvasColumnX = game.getXOfCanvasColumn(this.canvasColumn + 1);
      //console.log("moveEnemyLeftToRight", this.x, nextCanvasColumnX)
      this.moveRightToTarget(nextCanvasColumnX);
    } else {
      this.lastMove = "right";
      this.moveEnemyDown();
    }
  }
  /**
   * Move enemy to the left. Part of the classical movement pattern
   */
  moveEnemyRightToLeft() {
    if (!game.enemyIsInCanvasColumn(0, 0)) {
      const nextCanvasColumnX = game.getXOfCanvasColumn(this.canvasColumn - 1);
      //console.log("moveEnemyLeftToRight", this.x, nextCanvasColumnX)
      this.moveLeftToTarget(nextCanvasColumnX);
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
    this.moveDownToTarget(nextCanvasRowY);
  }
  teleportToInitialPosition() {
    let coords = game.calculateCoordinatesByPosition(this.row, this.column);
    this.x = coords[0];
    this.y = coords[1];
    if (this.elem.style.display === "none") {
      this.elem.style.display = "inline";
    }
    if (!this.collisionable)
      this.collisionable = true;
  }
  moveToPoint(point, segs, leftEasing, topEasing) {
    console.log("******* moveToPoint", `left ${segs}s ${leftEasing}, top ${segs}s ${topEasing}`)
    //this.elem.style.transitionProperty = "top, left";
    this.elem.style.transition = `left ${segs}s ${leftEasing}, top ${segs}s ${topEasing}`;
    this.x = point[0];
    this.y = point[1];
    console.log("****** enemy moved to ", this.elem.style.left, this.elem.style.top);

    const checkIfCollideWithPlayerEachFrame = () => {
      let rect = this.elem.getBoundingClientRect();
      let collides = this.collideWithByBoundingRect(player);
      //console.log("**** check enmy collides ", rect.left, rect.top);
      if(!collides && rect.left !== point[0] && rect.top !== point[1]) {
        this.animationFrameId = window.requestAnimationFrame(checkIfCollideWithPlayerEachFrame);
      }
      else if (collides)
        game.enemyCollidesWithPlayer(this);
      else {
        game.svEnemiesPool.storeObject(this);
      }
    }
    checkIfCollideWithPlayerEachFrame();
  }
}