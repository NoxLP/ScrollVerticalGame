import { Enemy } from "./Enemy.js";

export class Game {
  constructor(enemiesPerRow) {
    this.step = 9;
    this.enemyFrameStep = 4;
    this.enemyTotalStepPx = 36;
    this.bulletStep = 15;
    this.bulletTimeout = 250;

    this.canvas = document.getElementById("game");
    this.width = 1100;
    this.height = 900;
    this.canvasRowHeight = this.height / 7;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.enemiesSize = [
      [50, 50],
      [65, 65],
      [80, 80]
    ];
    this.playerSize = [80, 80];
    this.playerInitialCoords = [Math.round((this.width / 2) - (this.playerSize[0] / 2)), this.canvasRowHeight * 6];
    this.bulletSize = [60, 50];

    this.enemiesPerRow = enemiesPerRow;
    this.enemies = [];// = new Array(5).fill(new Array(this.enemiesPerRow));

    this.keysDown = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    }
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
  }
  /**
   * Returns DOM coordinates
   * @param {number} row 
   * @param {number} column 
   */
  _calculateCoordinatesByPosition(row, column) {
    //console.log(this.game.canvas.style.width)
    //console.log(this.enemiesPerRow)
    //margen + ((total ancho / numero de naves) * numero nave actual)
    return [
      (parseInt(this.canvas.style.width) / this.enemiesPerRow) * column,
      this.canvasRowHeight * row
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
    for(let i = 0; i < 5; i++) {
      this.enemies.push([]);
      for(let j = 0; j < this.enemiesPerRow; j++) {
        const coords = this._calculateCoordinatesByPosition(i, j);
        this.enemies[i].push(new Enemy(Math.ceil(i / 2), coords[0], coords[1], i, j));
      }
    }
    console.log(this.enemies)
  }
  removeEnemy(enemy) {
    //Remove enemy image from DOM and object from array. No more references are ever created, so garbage collector should remove it rom memory
    console.log(enemy)
    this.canvas.removeChild(enemy.elem);
    this.enemies[enemy.row][enemy.column] = null;
    
    //****** TODO **************/
    //dar puntos al jugador que haya matado al enemigo
  }
  createExplosion(collidingObject) {
    let explosion = new Image();
    explosion.src = "../assets/images/spaceships/explosion2.gif";
    explosion.classList.add("explosion");
    explosion.style.width = `${collidingObject.width}px`;
    explosion.style.height = `${collidingObject.height}px`;
    explosion.style.top = `${collidingObject.y}px`;
    explosion.style.left = `${collidingObject.x}px`;

    this.canvas.appendChild(explosion);
    setTimeout(() => {
      this.canvas.removeChild(explosion);
    },
    800);
  }
 
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

    for (let i = 0; i < this.enemies.length; i++){
      for(let j = 0; j < this.enemies[i].length; j++){
        this.enemies[i][j].moveEnemyLeftToRight();
      }
    }
  }
}