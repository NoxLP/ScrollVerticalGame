import { CollisionableObject } from "./base/CollisionableObject.js";
import { EnemyBullet } from "./bullets/EnemyBullet.js";
import { game, player, normalizeVector } from "./main.js";
import { Tween } from "./tweens/Tween.js";
//DELETEME
import { easings } from "./tweens/easings.js";

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

    this.lastMove;
    //this.moveAnimationId = null;
    this.myMovementTween;
    this.shootingAnimationId;
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
      this.x += game.siEnemyFrameStep;
      if (this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
        return;
      } else {
        this.moveAnimationId = window.requestAnimationFrame(() => { this.moveRightToTarget(target); });
      }
    } else {
      //console.log("TIMEOUT")
      this.moveAnimationId = setTimeout(() => { this.moveAnimationId = window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
    }
  }
  moveLeftToTarget(target) {
    if (this.centerX > target) {
      //console.log("leftToRight");
      this.x -= game.siEnemyFrameStep;
      if (this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
        return;
      } else {
        this.moveAnimationId = window.requestAnimationFrame(() => { this.moveLeftToTarget(target); });
      }
    } else {
      //console.log("TIMEOUT")
      this.moveAnimationId = setTimeout(() => { this.moveAnimationId = window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
    }
  }
  moveDownToTarget(target) {
    if (this.centerY < target) {
      //console.log("moveDown")
      this.y += game.siEnemyFrameStep;
      if (this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
        return;
      } else {
        this.moveAnimationId = window.requestAnimationFrame(() => { this.moveDownToTarget(target); });
      }
    } else {
      if (this.lastMove === "right") {
        this.moveAnimationId = setTimeout(() => { this.moveAnimationId = window.requestAnimationFrame(() => { this.moveEnemyRightToLeft(); }) }, 500);
      } else {
        this.moveAnimationId = setTimeout(() => { this.moveAnimationId = window.requestAnimationFrame(() => { this.moveEnemyLeftToRight(); }) }, 500);
      }
    }
  }
  /**
   * Move enemy to the right. Part of the classical movement pattern
   */
  moveEnemyLeftToRight() {
    if (!game.rightColumnEnemyIsInCanvasRightColumn()) { //(!game.enemyIsInCanvasColumn(game.siEnemiesPerRow - 1, game.canvasColumns - 1)) {
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
    if(!game.leftColumnEnemyIsInCanvasLeftColumn()) { //(!game.enemyIsInCanvasColumn(0, 0)) {
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
  moveToPoint(point, speedFactor, leftEasing, topEasing) {
    //console.log("MOVE TO POINT ", this)
    if(this.myMovementTween) {
      //if enemy is already in the middle of a movement tween, better to return false. If want to cancel the current tween, one can always pause or stop it before beginning a new movement
      if(this.myMovementTween.running)
        return false;
      
      //if enemy was in a tween AND the tween was paused, stopped, or finished, then just check if it was only paused and stop it without calling the final callback
      if(this.myMovementTween.paused) {
        this.myMovementTween.stopWithoutCallback = true;
        this.myMovementTween.stop();
      }
    }

    const checkIfCollideWithPlayerEachFrame = () => {
      if(this.collideWith(player)) {
        game.enemyCollidesWithPlayer(this);
      }
    }

    this.myMovementTween = new Tween(
      this, 
      speedFactor, 
      point, 
      2, 
      topEasing, 
      leftEasing, 
      checkIfCollideWithPlayerEachFrame, 
      () => { game.svEnemiesPool.storeObject(this); });
    
    this.myMovementTween.start();
  }
  shoot() {
    this.audio = game.audio.playAudio("assets/music/sounds/enemyLaser.mp3");
    let bullet, bulletInitialCoords = [this.x + (this.width / 2), this.y + (this.height / 2)];
    if (game.gameState === "spaceInvaders") {
      bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(
        this.x, this.y + this.height - game.bulletSize[1]), this.x, this.y + this.height - game.bulletSize[1]);
      bullet.move([0, 1]);
    } else {
      let direction;
      switch (this.type) {
        case 0:
          direction = normalizeVector([player.x - this.x, player.y - this.y]);
          console.log("direction", direction)
          bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
          bullet.move(direction);
          break;
        case 1:
          if (Math.random() > 0.5) { //horizontal
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([1, 0]);
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([-1, 0]);
          } else { //vertical
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([0, 1]);
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([0, -1]);
          }
          break;
        case 2:
          direction = [0, 1];
          for (let i = 0; i < 4; i++) {
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move(direction);
            direction = [direction[1], -direction[0]];
          }
          break;
      }
    }
  }
}