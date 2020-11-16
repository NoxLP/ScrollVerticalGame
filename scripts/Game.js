import { Enemy } from "./Enemy.js";
import { BonusEnemy } from "./BonusEnemy.js";
import { game, player } from "./main.js";
import { PointsCounter } from "./PointsCounter.js";
import { ObjectPool } from "./ObjectPool.js";

/**
 * Class for control them all
 */
export class Game {
  constructor(enemiesPerRow) {
    this.gameState = "spaceInvaders";
    this.step = 9;
    this.enemyFrameStep = 4;
    this.bulletStep = 15;
    this.enemyBulletStep = 9;
    this.bulletTimeout = 250;

    this.background = document.getElementById("movingBackg");
    this.backgroundBottom = 5200;

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
    this.bonus;
    this.bonusTimeout = 10000;
    this.bonusPointsRange = [50, 450];
    this.siEnemies = [];
    this.siEnemiesPerRow = enemiesPerRow;
    this.svEnemiesMoveTimerId = null;
    this.svEasings = {
      linear: "linear",
      easeInSine: "cubic-bezier(0.12, 0, 0.39, 0)",
      easeOutSine: "cubic-bezier(0.61, 1, 0.88, 1)",
      easeInOutSine: "cubic-bezier(0.37, 0, 0.63, 1)",
      easeInBack: "cubic-bezier(0.36, 0.5, 0.66, -0.56)",
      easeOutBack: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easeInOutBack: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      easeInCirc: "cubic-bezier(0.55, 0, 1, 0.45)",
      easeOutCirc: "cubic-bezier(0, 0.55, 0.45, 1)",
      easeInOutCirc: "cubic-bezier(0.85, 0, 0.15, 1)"
    };
    this.svEnemiesPaths = [
      [[this.width + 400, 0], [-400, this.height * 0.9], [this.svEasings.easeInOutSine, this.svEasings.easeInOutBack]],
      [[-400, this.height * 0.2], [this.width + 400, this.height * 0.85], [this.svEasings.linear, this.svEasings.easeInOutBack]],
      [[this.width + 400, this.height * 0.2], [-400, this.height * 0.7], [this.svEasings.linear, this.svEasings.easeInOutBack]],
      [[-400, this.height * 0.7], [this.width + 400, this.height * 0.2], [this.svEasings.linear, this.svEasings.easeInOutBack]],

      [[-400, this.height * 0.7], [this.width + 400, this.height * 0.5], [this.svEasings.easeInOutSine, this.svEasings.easeInOutBack]],
      [[-400, this.height * 0.7], [this.width + 400, this.height * 0.5], [this.svEasings.easeInCirc, this.svEasings.easeInOutBack]],

      [[-400, -400], [this.width, this.height + 400], [this.svEasings.easeOutCirc, this.svEasings.linear]], //arriba izq => abajo der
      [[-400, -400], [this.width, this.height + 400], [this.svEasings.easeOutCirc, this.svEasings.easeOutCirc]], //arriba izq => abajo der
      [[-400, -400], [this.width, this.height + 400], [this.svEasings.linear, this.svEasings.easeInCirc]], //arriba izq => abajo der

      [[this.width, -400], [-400, this.height + 400], [this.svEasings.linear, this.svEasings.easeOutCirc]], //arriba der => abajo izq
      [[this.width, -400], [-400, this.height + 400], [this.svEasings.easeOutBack, this.svEasings.easeOutCirc]], //arriba der => abajo izq
      [[this.width, -400], [-400, this.height + 400], [this.svEasings.easeOutCirc, this.svEasings.easeOutCirc]], //arriba der => abajo izq
      [[this.width, -400], [-400, this.height + 400], [this.svEasings.easeInCirc, this.svEasings.linear]], //arriba der => abajo izq

      [[-400, this.height * 0.25], [this.width * 0.8, this.height + 400], [this.svEasings.easeOutBack, this.svEasings.easeInOutBack]], //abajo izq1/4 => arriba der1/4
      [[-400, this.height * 0.25], [this.width * 0.8, this.height + 400], [this.svEasings.easeOutBack, this.svEasings.easeInCirc]], //abajo izq1/4 => arriba der1/4
      [[-400, this.height * 0.25], [this.width * 0.8, this.height + 400], [this.svEasings.linear, this.svEasings.easeInCirc]], //abajo izq1/4 => arriba der1/4
      [[-400, this.height * 0.25], [this.width * 0.8, this.height + 400], [this.svEasings.easeOutBack, this.svEasings.linear]], //abajo izq1/4 => arriba der1/4
      [[-400, this.height * 0.25], [this.width * 0.8, this.height + 400], [this.svEasings.linear, this.svEasings.easeInOutBack]], //abajo izq1/4 => arriba der1/4
      [[-400, this.height * 0.25], [this.width * 0.8, this.height + 400], [this.svEasings.linear, this.svEasings.easeInBack]], //abajo izq1/4 => arriba der1/4
      
      [[this.width * 0.8, this.height + 400], [-400, -400], [this.svEasings.easeInBack, this.svEasings.linear]], //abajo der3/4 => arriba izq
      [[this.width * 0.8, this.height + 400], [-400, -400], [this.svEasings.easeInCirc, this.svEasings.linear]], //abajo der3/4 => arriba izq
      [[this.width * 0.8, this.height], [-400, -400], [this.svEasings.linear, this.svEasings.easeInBack]], //abajo der3/4 => arriba izq      
      [[this.width * 0.8, this.height + 400], [-400, -400], [this.svEasings.linear, this.svEasings.easeOutCirc]], //abajo der3/4 => arriba izq      
      
      [[-400, this.height * 0.75], [this.width * 0.8, -400], [this.svEasings.linear, this.svEasings.easeInOutCirc]],//abajo izq3/4 => arriba der3/4
      [[-400, this.height * 0.75], [this.width * 0.8, -400], [this.svEasings.easeInCirc, this.svEasings.easeInCirc]], 
      [[-400, this.height * 0.75], [this.width * 0.8, -400], [this.svEasings.linear, this.svEasings.easeInOutBack]], 
      [[-400, this.height * 0.75], [this.width * 0.8, -400], [this.svEasings.linear, this.svEasings.easeInBack]], 
      [[-400, this.height * 0.75], [this.width * 0.8, -400], [this.svEasings.linear, this.svEasings.easeInCirc]]
    ];

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
      ArrowUp: false,
      ArrowDown: false,
      Space: false
    }

    this.svEnemiesPool = new ObjectPool();
    this.enemiesBulletsPool = new ObjectPool();
  }

  get points() { return this._points; }
  set points(total) {
    this._points = total;
    this.pointsCounter.showedPoints = total;
  }

  /************************************************************************************************************/
  /****************************************** MODEL - CREATE/REMOVE *******************************************/
  //#region
  /**
   * Remove enemy
   * @param {Enemy} enemy Enemy to remove
   */
  removeEnemy(enemy) {
    if(this.gameState === "spaceInvaders") {
      //Remove enemy image from DOM and object from array. No more references are ever created, so garbage collector should remove it rom memory
      console.log(enemy)
      enemy.elem.style.display = "none";
      enemy.collisionable = false;
      //this.canvas.removeChild(enemy.elem);
      //this.siEnemies[enemy.row][enemy.column] = null;
      cancelAnimationFrame(enemy.moveAnimationId);
      clearTimeout(enemy.moveAnimationId);
      this.createExplosion(enemy);
      
      this.points += (enemy.type + 1) * 100;

      if(this.siEnemies.every(x => x.every(e => e.elem.style.display === "none"))) {
        //this.playerWins();
        this.startScrollVertical();
      }
    } else {
      this.createExplosion(enemy);
      this.svEnemiesPool.storeObject(enemy);
      this.points += (enemy.type + 1) * 100;
    }
  }
  /**
   * Player killed, remove player
   */
  removePlayer() {
    player.elem.style.display = "none";
    player.responsive = false;
    player.collisionable = false;
    this.stopAllPlayerMovements();
  }
  /**
   * Remove bonus ship
   */
  removeBonusEnemy() {
    let points = Math.round((Math.random() * this.bonusPointsRange[1]) + this.bonusPointsRange[0]);
    let pointsPopup = document.createElement("p");
    pointsPopup.innerText = points;
    pointsPopup.style.left = `${this.bonus.x + this.bonus.width + 25}px`;
    pointsPopup.style.top = `${this.bonus.y}px`;
    pointsPopup.classList.add("pointsPopup");
    this.canvas.appendChild(pointsPopup);

    setTimeout(() => { pointsPopup.classList.add("pointsPopupAnimation"); }, 50);
    setTimeout(() => { this.canvas.removeChild(pointsPopup); }, 2000);

    this.points += points;
    this.createExplosion(this.bonus);
    this.bonus.resetPosition();
    setTimeout(() => { this.bonus.move(); }, this.bonusTimeout);
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
      this.siEnemies.push([]);
      for (let j = 0; j < this.siEnemiesPerRow; j++) {
        let coords = this.calculateCoordinatesByPosition(i, j);
        this.siEnemies[i].push(new Enemy(Math.ceil(i / 2), coords[0], coords[1], i, j));
      }
    }
    console.log(this.siEnemies)
  }
  /**
   * Create explosion when enemy gets destroyed
   * @param {CollisionableObject} collidingObject Enemy destroyed
   */
  createExplosion(collidingObject) {
    console.log("////////// CREATE EXPLOSION")
    let explosion = new Image();
    explosion.src = "assets/images/spaceships/playerExplosion.gif";
    explosion.classList.add("explosion");
    explosion.style.width = `${collidingObject.width + 25}px`;
    explosion.style.height = `${collidingObject.height + 25}px`;
    if(this.gameState === "SV") {
      let rect = collidingObject.elem.getBoundingClientRect();
      explosion.style.top = `${rect.top}px`;
      explosion.style.left = `${rect.left}px`;
    } else {
      explosion.style.top = `${collidingObject.y}px`;
      explosion.style.left = `${collidingObject.x}px`;
    }

    this.canvas.appendChild(explosion);
    setTimeout(() => {
      this.canvas.removeChild(explosion);
    },
      400);
  }
  /**
   * Create bonus ship and starts movement
   */
  createBonusEnemy() {
    /* 
    Creamos la nave.
    Se mueve hasta salirse del canvas y se para.
    Cuando salga de la pantalla se hace transparente.
    Despues de 30 seg vuelve a ser visible en la posición de salida.
    
    */
    this.bonus = new BonusEnemy();
    setTimeout(() => { this.bonus.move(); }, (Math.random() * game.bonusTimeout * 0.5) + (game.bonusTimeout * 0.5));
  }
  //#endregion
  /************************************************************************************************************/
  /********************************************* ENEMIES MOVEMENT *********************************************/
  //#region 
  /**
   * Get left-most x coordinate of column
   * @param {number} column Column index
   */
  getXOfCanvasColumn(column) { return this.canvasColumnWidth * (column + 0.5); }
  /**
   * Get top-most y coordinate of row
   * @param {number} row Row index
   */
  getYOfCanvasRow(row) { return this.canvasRowHeight * (row + 0.5); }
  /**
   * Returns true if enemy from enemies column is on canvas column. Used by the enemies movement pattern to decide when to move down.
   * @param {number} enemyColumn Column in enemies array
   * @param {number} canvasColumn Column in canvas
   */
  enemyIsInCanvasColumn(enemyColumn, canvasColumn) {
    const enemy = this.siEnemies[0][enemyColumn];
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
    const enemy = this.siEnemies[enemyRow][0];
    return enemy &&
      enemy.y >= canvasRow * this.canvasRowHeight + this.padding[0] &&
      enemy.x < ((canvasColumn + 1) * this.canvasColumnWidth) + this.padding[1];
  }
  /**
   * Move all enemies in the classical pattern
   */
  moveSpaceInvadersEnemies() {
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

    for (let i = 0; i < this.siEnemies.length; i++) {
      for (let j = 0; j < this.siEnemies[i].length; j++) {
        //if (this.siEnemies[i][j])
        let enemy = this.siEnemies[i][j];
        enemy.collisionable = true;
        enemy.elem.style.display = "inline";
        enemy.moveEnemyLeftToRight();
      }
    }
  }
  /**
   * Move bonus enemy
   */
  moveBonusEnemy() { setTimeout(() => { this.bonus.move(); }, (Math.random() * game.bonusTimeout * 0.5) + (game.bonusTimeout * 0.5)); }
  /**
   * Cancel movement of all enemies
   */
  cancelAllEnemiesMovement() {
    if(this.gameState === "spaceInvaders") {
      for (let i = 0; i < this.siEnemies.length; i++) {
        for (let j = 0; j < this.siEnemies[i].length; j++) {
          cancelAnimationFrame(this.siEnemies[i][j].moveAnimationId);
          clearTimeout(this.siEnemies[i][j].moveAnimationId);
        }
      }
    } else {
      clearTimeout(this.svEnemiesMoveTimerId);
      this.svEnemiesPool.showingObjects.forEach(x => {
        clearTimeout(x.moveAnimationId);
        clearTimeout(x.shootingAnimationId);
        x.elem.style.top = getComputedStyle(x.elem).top;
        x.elem.style.left = getComputedStyle(x.elem).left;
      });
    }
  }
  scrollVerticalEnemiesMovements(lastIndex) {
    //#region explanation
    /*
    Aleatorio aparecen de 0 a X enemigos
    Crea un enemigo o coje uno en display none
      En un lugar aleatorio fuera del canvas
    Escoja un punto aleatorio del borde del canvas para salir
    Mueva el enemigo hasta ese punto
    (si muere o se sale del canvas => display none, ...)
    set timeout tiempo aleatorio 2-10segs recursivo
    */

    /* 
    Crear enemigo fuera del canvas
    X < 0 || X > canvas width
    ||
    Y < 0 || Y > canvas heigth
    
    Punto aleatorio del borde del canvas
    X === -enemy.width || X === canvas width
    ||
    Y === -enemy.height || Y === canvas heigth
     */
    //let x, y, finalX, finalY;
    /*if(Math.random() > 0.5){
      x = -400;
      y = Math.random() * this.height;
    } else {
      y = -400;
      x = Math.random() * this.width;
    }
    if(Math.random() > 0.5){
      finalX = -400;
      finalY = Math.random() * this.height;
    } else {
      finalY = -400;
      finalX = Math.random() * this.width;
    }*/
    //#endregion
    console.log("----------------- Nuevo enemigo scroll");
    let index;
    while((index = Math.round(Math.random() * (this.svEnemiesPaths.length - 1))) === lastIndex);
    
    console.log("------- PATRON ", index)
    let initial = this.svEnemiesPaths[index][0];
    let final = this.svEnemiesPaths[index][1];
    let shiptype = Math.round(Math.random() * 2);
    let animationSegs = Math.round((Math.random() * 4) + 4);
    let numberOfEnemies = Math.round((Math.random() * 3) + 2);
    //console.log("------ coords ", x, y, finalX, finalY);
    //this.svEnemies = [enemy0, , enemy2, ..., enemyN] => svEnemies.length === 5
    for(let i = 0; i < numberOfEnemies; i++) {
      let enemy = this.svEnemiesPool.getNewObject(() => new Enemy(shiptype, initial[0], initial[1]), initial[0], initial[1]);
      enemy.type = shiptype
      enemy.elem.classList.add("enemy");
      //console.log(`------ enemy of type ${enemy.type} is in `, enemy.x, enemy.y);
      enemy.moveAnimationId = setTimeout(() => {
        enemy.moveToPoint(
          [final[0], final[1]], 
          animationSegs, 
          this.svEnemiesPaths[index][2][0], 
          this.svEnemiesPaths[index][2][1])
        }, 
        1000 + (500 * i)
      );
    }
    //enemy.elem.classList.add("enemiesFinal");
    this.svEnemiesMoveTimerId = setTimeout(() => {this.scrollVerticalEnemiesMovements(index);}, (Math.random() * 6000) + 2000);
  }
  //#endregion
  /************************************************************************************************************/
  /************************************************* HELPERS **************************************************/
  //#region
  /**
   * An enemy collides with player. Kill both the enemy and the player, player lose a live, the game reset or is game over if the player have no more lives.
   * @param {Enemy} enemy Enemy that collides with player
   */
  enemyCollidesWithPlayer(enemy) {
    this.removeEnemy(enemy);
    this.playerHitted();
  }
  /**
   * The player gets hitted by an object
   */
  playerHitted() {
    /*
    if vidas > 1
      Explosiones
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
    this.createExplosion(player);
    this.removePlayer();
    this.cancelAllEnemiesMovement();
    this.bonus.cancelAnimation();
    this.bonus.resetPosition();
    player.loseLive();

    if (player.lives > 0) {
      setTimeout(() => { alert("¡You lost a life!"); }, 1000);
      
      this.svEnemiesPool.storeAllObjects();
      setTimeout(() => {
        this.reset();
        if(this.gameState === "spaceInvaders") {
          this.moveSpaceInvadersEnemies();
          this.moveBonusEnemy();
        } else {
          this.scrollVerticalEnemiesMovements();
        }
        player.responsive = true;
        player.collisionable = true;
      }, 5000);
    } else {
      setTimeout(() => {
        alert("¡¡¡Game Over!!!");
        player.resetLives();
        this.pointsCounter.reset();
        document.getElementById("menu").style.display = "block";
        document.getElementById("background").style.display = "none";
        this.reset();
      }, 1000);
    }
  }
  stopAllPlayerMovements() {
    for(let key in this.keysDown) {
      this.keysDown[key] = false;
    }
  }
  //#endregion
  /************************************************************************************************************/
  /*********************************************** GAME STATE *************************************************/
  /**
   * Reset game - Do NOT reset lives and points. Move player to initial coordinates, move enemies and bonus ship to initial coordinates and restart their movement.
   */
  reset() {
    player.teleportToInitialPosition();
    //All enemies to initial position
    for (let i = 0; i < this.siEnemies.length; i++) {
      for (let j = 0; j < this.siEnemies[i].length; j++) {
        this.siEnemies[i][j].teleportToInitialPosition();
      }
    }
    this.bonus.cancelAnimation();
    this.bonus.resetPosition();
  }
  startScrollVertical() {
    /*
    Mover background
    Empiezan a aparecer enemigos de scroll vertical
    */
    this.gameState = "SV";
    player.responsive = false;
    this.stopAllPlayerMovements();
    let pointsPopup = document.createElement("p");
    pointsPopup.innerText = "Level 1 cleared";
    pointsPopup.classList.add("levelClearedPopup");
    this.canvas.appendChild(pointsPopup);
    for(let i = 0; i < this.siEnemies.length; i++) {
      for(let j = 0; j < this.siEnemies[i].length; j++) {
        let enemy = this.siEnemies[i][j];
        if(enemy.moveAnimationId) {
          cancelAnimationFrame(enemy.moveAnimationId);
          clearTimeout(enemy.moveAnimationId);
        }
        enemy.elem.style.display = "none";
        this.canvas.removeChild(enemy.elem);
      }
    }
    this.siEnemies = [];
    setTimeout(() => {
      this.canvas.removeChild(pointsPopup);
      player.responsive = true;
      this.moveBackgroundDown();
      this.scrollVerticalEnemiesMovements();
    }, 3000);
  }
  playerWins() {
    /*
    Parar movimientos: enemigos, bonus, ¿player?
    Mensaje "Has ganado! tu puntuación fue de :...." 
    resetear vidas y puntos.
    volver al menú.
    */
    this.cancelAllEnemiesMovement();
    this.bonus.cancelAnimation();
    this.bonus.resetPosition();
    this.stopAllPlayerMovements();
    player.responsive = false;

    setTimeout(() => {
      alert(`You Won Crack! Your points are: ${this.pointsCounter.showedPoints}`);
      player.resetLives();
      this.pointsCounter.reset();
      document.getElementById("menu").style.display = "block";
      document.getElementById("background").style.display = "none";
      this.reset();
    }, 2000);
  }
  moveBackgroundDown() {
    this.backgroundBottom -= 0.9;
    this.background.style.bottom = `${this.backgroundBottom}px`
    window.requestAnimationFrame(() => { this.moveBackgroundDown();});
  }
  DELETEME_instaScrollVertical() {
    this.gameState = "SV";
    this.stopAllPlayerMovements();
    player.responsive = true;
    this.moveBackgroundDown();
    this.startScrollVerticalEnemiesMovements();
  }
  start() {
    player.responsive = true;
    player.collisionable = true;
    game.createEnemies();
    game.moveSpaceInvadersEnemies();
    game.createBonusEnemy();
    //this.startScrollVertical();
    //this.DELETEME_instaScrollVertical();
  }
}