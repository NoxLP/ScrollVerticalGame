import { Enemy } from "./Enemy.js";
import { BonusEnemy } from "./BonusEnemy.js";
import { player } from "./main.js";
import { PointsCounter } from "./PointsCounter.js";

/**
 * Class for control them all
 */
export class Game {
  constructor(enemiesPerRow) {
    this.step = 9;
    this.enemyFrameStep = 4;
    this.bulletStep = 15;
    this.bulletTimeout = 250;

    this.canvas = document.getElementById("game");
    this.width = 1900;
    this.height = 870;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    //this.padding = [20, 10];
    this.canvasRows = 10;
    this.canvasColumns = enemiesPerRow + 3;
    this.canvasRowHeight = this.height / this.canvasRows; //(this.height - (this.padding[1] * 2)) / this.canvasRows;
    this.canvasColumnWidth = this.width / this.canvasColumns; //(this.width - (this.padding[0] * 2)) / this.canvasColumns;

    this.enemiesSize = [
      [50, 50],
      [65, 65],
      [80, 80]
    ];
    this.bonusSize = [80, 100];
    /*
    new Array(5) === [null, null, null, null, null]
    for(i=0;i<length;i++)
      array[i] = ...
    
    this.enemies = [
      [,,,,,,,],
      [,,,,,,,],
      ...,
      [,,,,,,,]
    ]
    */
    this.enemies = [];
    this.bonus;
    this.enemiesPerRow = enemiesPerRow;
    this.playerSize = [80, 80];
    this.playerInitialCoords = [
      (this.width / 2) - (this.playerSize[0] / 2),// + this.padding[0],
      (this.canvasRowHeight * (this.canvasRows - 1)) + (this.canvasRowHeight / 2) - (this.playerSize[1] / 2)
    ];// - this.padding[1]];
    this.bulletSize = [60, 50];

    this._points = 0;
    this.pointsCounter = new PointsCounter(50);

    this.keysDown = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    }
  }
  get points() { return this._points; }
  set points(total) {
    this._points = total;
    this.pointsCounter.showedPoints = total;
  }
  /**
   * Returns DOM coordinates for initial enemy position
   * @param {number} row 
   * @param {number} column 
   */
  calculateCoordinatesByPosition(row, column) {
    //console.log(this.game.canvas.style.width)
    //console.log(this.canvasColumns)
    //margen + ((total ancho / numero de naves) * numero nave actual)
    const enemyType = Math.ceil(row / 2);
    return [
      (this.canvasColumnWidth * (column + 0.5)) - (this.enemiesSize[enemyType][0] / 2),
      (this.canvasRowHeight * (row + 1.5)) - (this.enemiesSize[enemyType][1] / 2)
      /*
      (this.canvasColumnWidth * column) + this.padding[0] * 3 - (this.enemiesSize[enemyType][0] / 2),
      (this.canvasRowHeight * row) + (this.canvasRowHeight * 0.5) + this.padding[1] - (this.enemiesSize[enemyType][1] / 2)
      */
    ];
  }
  /**
   * Create all enemies in their initial position
   */
  createEnemies() {
    /*
    tipo 1 => row 1, 2
    tipo 2 => row 3, 4
    
    tipo 1 => (tipo * 2) - 1, tipo * 2 => 2 - 1, 2 => 1, 2
    tipo 2 => (tipo * 2) - 1, tipo * 2 => 4 - 1, 4 => 3, 4
    
    row_1 = (tipo * 2) - 1
    row_2 = tipo * 2
    
    type = roundUp(row / 2)
    */
    /*
    enemies = []
    i = 0 => enemies = [[]]
    j = 0 => 
    j = 1 =>
    ...
    i = 1 => enemies = [[], []]
    i = 2 => enemies = [[], [], []]
    */
    for (let i = 0; i < 5; i++) {
      this.enemies.push([]);
      for (let j = 0; j < this.enemiesPerRow; j++) {
        let coords = this.calculateCoordinatesByPosition(i, j);
        this.enemies[i].push(new Enemy(Math.ceil(i / 2), coords[0], coords[1], i, j));
      }
    }
    console.log(this.enemies)
  }
  /**
   * Remove enemy
   * @param {Enemy} enemy Enemy to remove
   */
  removeEnemy(enemy) {
    //Remove enemy image from DOM and object from array. No more references are ever created, so garbage collector should remove it rom memory
    console.log(enemy)
    enemy.elem.style.display = "none";
    enemy.collisionable = false;
    //this.canvas.removeChild(enemy.elem);
    //this.enemies[enemy.row][enemy.column] = null;
    cancelAnimationFrame(enemy.animationFrameId);
    clearTimeout(enemy.animationFrameId);
    
    this.points += (enemy.type + 1) * 100;
  }
  removePlayer() {
    player.elem.style.display = "none";
    player.collisionable = false;
    for(let key in this.keysDown) {
      this.keysDown[key] = false;
    }
  }
  /**
   * Create explosion when enemy gets destroyed
   * @param {CollisionableObject} collidingObject Enemy destroyed
   */
  createExplosion(collidingObject) {
    let explosion = new Image();
    explosion.src = "../assets/images/spaceships/playerExplosion.gif";
    explosion.classList.add("explosion");
    explosion.style.width = `${collidingObject.width}px`;
    explosion.style.height = `${collidingObject.height}px`;
    explosion.style.top = `${collidingObject.y}px`;
    explosion.style.left = `${collidingObject.x}px`;

    this.canvas.appendChild(explosion);
    setTimeout(() => {
      this.canvas.removeChild(explosion);
    },
    500);
  }

  createBonusEnemy() {
    /* 
    Creamos la nave.
    Se mueve hasta salirse del canvas y se para.
    Cuando salga de la pantalla se hace transparente.
    Despues de 30 seg vuelve a ser visible en la posición de salida.
    
    */
    this.bonus = new BonusEnemy(0,0);
    this.bonus.move();
  }

  cancelAllEnemiesMovement() {
    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = 0; j < this.enemies[i].length; j++) {
        cancelAnimationFrame(this.enemies[i][j].animationFrameId);
        clearTimeout(this.enemies[i][j].animationFrameId);
      }
    }
  }
  reset() {
    player.teleportToInitialPosition();
    //All enemies to initial position
    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = 0; j < this.enemies[i].length; j++) {
        this.enemies[i][j].teleportToInitialPosition();
      }
    }
  }
  enemyCollidesWithPlayer(enemy) {
    /*
    if vidas > 1
      Explosiones
      desaparece enemigo
      desaparece player
      parar enemigos
      parar nave bonus
      Jugador pierde vida => player.lives
      En el contador pierde una vida => classList.add(liveLost)
      ¿mensaje?
      TIMEOUT
      Reset
        jugador volver a position inicial
        enemigos volver a position inicial
          moverlos a su sitio
          dejar de ser transparentes
          vuelvan a ser colisionables
    else
      game over
    */
    if(player.lives > 1) {
      this.createExplosion(player);
      this.createExplosion(enemy);
      this.removeEnemy(enemy);
      this.removePlayer();
      this.cancelAllEnemiesMovement();
      this.bonus.reset();
      console.log(document.getElementById(`live${player.lives}`));
      let live = document.getElementById(`live${player.lives}`);
      live.style.filter = "brightness(0.3)";
      live.style.transition = "filter 1s ease-out";
      player.lives--;
      setTimeout(() => {alert("¡¡¡Has perdido una vida!!!");}, 1000); 
      setTimeout(() => {this.reset();}, 5000);
    } else {
      //TODO - game over
    }
  }

  /************************************************************************************************************/
  /********************************************* ENEMIES MOVEMENT *********************************************/
  /************************************************************************************************************/

  getXOfCanvasColumn(column) { return this.canvasColumnWidth * (column + 0.5); }
  getYOfCanvasRow(row) { return this.canvasRowHeight * (row + 0.5); }
  /**
   * Returns true if enemy from enemies column is on canvas column. Used by the enemies movement pattern to decide when to move down.
   * @param {number} enemyColumn Column in enemies array
   * @param {number} canvasColumn Column in canvas
   */
  enemyIsInCanvasColumn(enemyColumn, canvasColumn) {
    const enemy = this.enemies[0][enemyColumn];
    return enemy && 
      enemy.x > this.canvasColumnWidth * canvasColumn && 
      enemy.x < this.canvasColumnWidth * (canvasColumn + 1);
  }
  /**
   * Returns true if enemy from enemies row is on canvas row. Used by the enemies movement pattern.
   * @param {number} enemyRow Row in enemies array
   * @param {number} canvasRow Row in canvas
   */
  enemyIsInCanvasRow(enemyRow, canvasRow) {
    const enemy = this.enemies[enemyRow][0];
    return enemy && 
      enemy.y >= canvasRow * this.canvasRowHeight + this.padding[0] && 
      enemy.x < ((canvasColumn + 1) * this.canvasColumnWidth) + this.padding[1];
  }
  /**
   * Move all enemies in the classical pattern
   */
  moveEnemies() {
    /*
    Van de izquierda a derecha
    mientras que la esquina derecha del enemigo de la derecha no colisione con el límite de la derecha
      sumas a x
    bajan
      sumas una fila a y 
    van de derecha a izquierda
      mientras que la esquina izquierda del enemigo de la izquierda no colisione con el límite de la izquierda
    restas a x
      bajan
    sumas una fila a y 
    REPITE hasta que un enemigo de la fila inferior colisione con player
    */

    //While la fila de abajo no colisione con el jugador

    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = 0; j < this.enemies[i].length; j++) {
        //if (this.enemies[i][j])
        let enemy = this.enemies[i][j];
        enemy.collisionable = true;
        enemy.elem.style.display = "inline";
        enemy.moveEnemyLeftToRight();
      }
    }
  }
}