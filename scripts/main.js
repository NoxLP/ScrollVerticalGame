import { DrawableObject } from "./DrawableObject.js";
import { CollisionableObject } from "./CollisionableObject.js";

//const game = new Game(5);
//game.enemiesPerRow === 5 => true
//game.createEnemies();
class Game {
  constructor(enemiesPerRow) {
    this.step = 9;
    this.bulletStep = 15;
    this.bulletTimeout = 250;

    this.canvas = document.getElementById("game");
    this.width = 1100;
    this.height = 800;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.enemiesSize = [
      [50, 50],
      [65, 65],
      [80, 80]
    ];
    this.playerSize = [80, 80];
    this.playerInitialCoords = [Math.round((this.width / 2) - (this.playerSize[0] / 2)), this.height - this.playerSize[1] - 10];
    this.bulletSize = [60, 50];

    this.enemiesPerRow = enemiesPerRow;
    this.enemies = new Array(5).fill(new Array(this.enemiesPerRow));

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
      ((parseInt(this.canvas.style.height) - this.enemiesSize[2][1] - 20) / 5) * row
    ];
  }
  /**
   * Create all enemies in their initial position
   */
  createEnemies() {
    //roundUp(row / 2)
    //loop per enemy type
    /*
    1.- queremos meter a las naves enemigas cada una en su coordenada
      1.1.- coordenadas(y,x)
        1.1.1.- estamos en las filas 1 y 2 => i = 1 ; i = 2
        1.1.2.- todos los elementos => j = 0 ; ... ; j = 4
      1.2.- crear nave enemiga
        1.2.1.- ¿Dónde la vamos a dibujar?
    */
    for (let type = 0; type < 3; type++) {
      if (type === 0) {
        for (let j = 0; j < this.enemiesPerRow; j++) {
          const coords = this._calculateCoordinatesByPosition(0, j);
          //console.log(coords)
          this.enemies[0][j] = new Enemy(type, coords[0], coords[1], 0, j);
        }
      } else {
        /*
        tipo 1 => row 1, 2
        tipo 2 => row 3, 4
        
        tipo 1 => (tipo * 2) - 1, tipo * 2 => 2 - 1, 2 => 1, 2
        tipo 2 => (tipo * 2) - 1, tipo * 2 => 4 - 1, 4 => 3, 4
        
        row_1 = (tipo * 2) - 1
        row_2 = tipo * 2
        */
        for (let i = (type * 2) - 1; i < (type * 2) + 1; i++) {
          for (let j = 0; j < this.enemiesPerRow; j++) {
            const coords = this._calculateCoordinatesByPosition(i, j);
            //console.log(coords)
            this.enemies[i][j] = new Enemy(type, coords[0], coords[1], i, j);
          }
        }
      }
    }
  }
  removeEnemy(enemy) {
    //Remove enemy image from DOM and object from array. No more references are ever created, so garbage collector should remove it rom memory
    console.log(enemy)
    this.canvas.removeChild(enemy.elem);
    this.enemies[enemy.row][enemy.column] = null;
    
    //****** TODO **************/
    //dar puntos al jugador que haya matado al enemigo
  }
  createExplosion(colW, colH, colY, colX) {
    let explosion = new Image();
    explosion.src = "../assets/images/spaceships/explosion2.gif";
    explosion.classList.add("explosion");
    explosion.style.width = `${colW}px`;
    explosion.style.height = `${colH}px`;
    explosion.style.top = `${colY - (colH / 2)}px`;
    explosion.style.left = `${colX}px`;
    return explosion;
  }
}

class Enemy extends CollisionableObject {
  constructor(type, x, y, row, column) {
    let elem = new Image();
    elem.src = `../assets/images/spaceships/enemy${type}.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("enemy");
    //constructor(domElement, x, y, width, height, topBottom = "top", leftRight = "left")
    super(elem, x, y, game.enemiesSize[type][0], game.enemiesSize[type][1]);

    this.type = type;
    this.row = row;
    this.column = column;
  }
}

class PlayerBullet extends CollisionableObject {
  constructor(x, y) {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/playerBullet.png";
    elem.classList.add("bullet");
    super(elem, x, y, game.bulletSize[0], game.bulletSize[1]);
  }
  collideWithAnEnemy() {
    console.log("collideWithAnEnemy")
    //This could be more efficiente storing enemies by their coords in some sort of grid, so one should only check for collisions in the same column of the bullet
    for(let i = 0; i < game.enemies.length; i++) {
      for(let j = 0; j < game.enemies[i].length; j++) {
        //console.log("ENEMY", game.enemies[i])
        if(this.collideWith(game.enemies[i][j])) {
          console.log(game.enemies[i][j])
          return game.enemies[i][j];
        }
      }
    }
    return null;
  }
  move() {
    /*
    Aumentas y en x pixeles (game.bulletStep)
    
    Si la bala llega a arriba (game.height)
      para y destruye la bala
    else Si colisiona con enemigo
      para, destruyela bala, destruye enemigo
    de otra forma
      window.requestAnimationFrame(this.move)
    */
    if(this.y + this.height > 0) {
      //console.log("Bala subiendo");
      this.y -= game.bulletStep;
      var enemy = this.collideWithAnEnemy();
      
      if(enemy) {
        console.log("COLLIDES WITH", enemy.row, enemy.column)
        //console.log("enemy")
        let explosion = game.createExplosion(enemy.width, enemy.height, enemy.y,enemy.x);
        game.canvas.appendChild(explosion);
        game.canvas.removeChild(this.elem);
        game.removeEnemy(enemy);
        setTimeout(() => {game.canvas.removeChild(explosion)}, 800)
      } else {
        this.update();
        window.requestAnimationFrame(() => { this.move(); });
      }
    } else {
      console.log("REMOVE BULLET")
      game.canvas.removeChild(this.elem);
    }
  }
}

class Player extends CollisionableObject {
  constructor() {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/player1.png";
    elem.id = "player";
    super(elem, game.playerInitialCoords[0], game.playerInitialCoords[1], game.playerSize[0], game.playerSize[1]);

    this.lastBulletTime = null;
    this.shootTimer;
  }
  moveLeft = function () {
    if (this.x > game.step && game.keysDown.ArrowLeft) {
      this.x -= game.step;
      this.update();
      window.requestAnimationFrame(() => { this.moveLeft(); });
    }
  }
  moveRight = function () {
    if (this.x + this.width < game.width - game.step && game.keysDown.ArrowRight) {
      this.x += game.step;
      this.update();
      window.requestAnimationFrame(() => { this.moveRight(); });
    }
  }
  shoot() {
    if(game.keysDown.Space) {
      //console.log("BULLET")
      const bullet = new PlayerBullet(
        this.x + (this.width / 2) - (game.bulletSize[0] / 2), 
        this.y - (game.bulletSize[1] * 0.5));
      /*
      Para mover la bala hacia arriba:
      1.- window.requestAnimationFrame(bullet.move)
      */
      bullet.move();
      if(!this.shootTimer)
        this.shootTimer = setInterval(() => { this.shoot(); }, game.bulletTimeout);
    } else {
      //console.log("FALSE")
      clearInterval(this.shootTimer);
      this.shootTimer = null;
    }
  }
}

export const game = new Game(5);
game.createEnemies();
const player = new Player();
console.log(game);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && !game.keysDown.ArrowRight && !game.keysDown.ArrowLeft) {
    game.keysDown.ArrowLeft = true;
    player.moveLeft();
  }
  if (e.key === "ArrowRight" && !game.keysDown.ArrowLeft && !game.keysDown.ArrowRight) {
    game.keysDown.ArrowRight = true;
    player.moveRight(); 
  }
  if (e.key === " " && !game.keysDown.Space) {
    console.log("SPACE")
    game.keysDown.Space = true;
    player.shoot();
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") {
    game.keysDown.ArrowLeft = false;
  }
  if (e.key === "ArrowRight") {
    game.keysDown.ArrowRight = false;
  }
  if (e.key === " ") {
    game.keysDown.Space = false;
  }
});