import { CollisionableObject } from "./base/CollisionableObject.js";
import { EnemyBullet } from "./bullets/EnemyBullet.js";
import { game, player, normalizeVector } from "./main.js";

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
    this.moveAnimationId = null;
    this.shootingAnimationId = null;
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
      this.x -= game.enemyFrameStep;
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
      this.y += game.enemyFrameStep;
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
    if (!game.enemyIsInCanvasColumn(game.siEnemiesPerRow - 1, game.canvasColumns - 1)) {
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
    //console.log("******* moveToPoint", `left ${segs}s ${leftEasing}, top ${segs}s ${topEasing}`)
    //this.elem.style.transitionProperty = "top, left";
    this.elem.style.transition = `left ${segs}s ${leftEasing}, top ${segs}s ${topEasing}`;
    this.x = point[0];
    this.y = point[1];
    //console.log("****** enemy moved to ", this.elem.style.left, this.elem.style.top);

    const checkIfCollideWithPlayerEachFrame = () => {
      let rect = this.elem.getBoundingClientRect();
      let collides = this.collideWithByBoundingRect(player);
      //console.log("**** check enmy collides ", rect.left, rect.top);
      if(!collides && rect.left !== point[0] && rect.top !== point[1]) {
        this.moveAnimationId = window.requestAnimationFrame(checkIfCollideWithPlayerEachFrame);
      }
      else if (collides) {
        game.enemyCollidesWithPlayer(this);
      } else {
        game.svEnemiesPool.storeObject(this);
      }
    }
    checkIfCollideWithPlayerEachFrame();

    let shootingTime = (segs * 1000 / 3);
    this.shootingAnimationId = setTimeout(() => 
    { 
      this.shoot();
      this.shootingAnimationId = setTimeout(() => 
      { 
        this.shoot(); 
      }, 
      shootingTime + (Math.random() * 200));
    }, 
    shootingTime + (Math.random() * 700))

    setTimeout(() => { game.svEnemiesPool.storeIfNotStored(this); }, segs * 1000);
  }
  shoot() {
    let rect = this.elem.getBoundingClientRect();
    let bullet, bulletInitialCoords = [rect.left + (this.width  / 2), rect.top + (this.height / 2)];
    if(game.gameState === "spaceInvaders") {
      bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(
        this.x, this.y + this.height - game.bulletSize[1]), this.x, this.y + this.height - game.bulletSize[1]);
      bullet.move([0,1]);
    } else {
      let direction;
      switch(this.type) {
        case 0:
          direction = normalizeVector([player.x - rect.left, player.y - rect.top]);
          console.log("direction", direction)
          bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
          bullet.move(direction);
          break;
        case 1:
          if(Math.random() > 0.5) { //horizontal
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([1,0]);
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([-1,0]);
          } else { //vertical
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([0,1]);
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move([0,-1]);
          }
          break;
        case 2:
          direction = [0,1];
          for(let i = 0; i < 4; i++) {
            bullet = game.enemiesBulletsPool.getNewObject(() => new EnemyBullet(bulletInitialCoords[0], bulletInitialCoords[1]), bulletInitialCoords[0], bulletInitialCoords[1]);
            bullet.move(direction);
            direction = [direction[1], -direction[0]];
          }
          break;
      }
    }
  }
}