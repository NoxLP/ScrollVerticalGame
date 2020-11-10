import { DrawableObject } from "./drawableObject.js";
//const game = new Game(5);
//game.enemiesPerRow === 5 => true
//game.createEnemies();
class Game {
  constructor(enemiesPerRow) {
    this.step = 50;
    this.bulletStep = 15;

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
    this.playerInitialCoords = [Math.round((this.width / 2) - (this.playerSize[0] / 2)), 60];
    this.bulletSize = [60, 50];

    this.enemiesPerRow = enemiesPerRow;
    this.enemies = new Array(5).fill(new Array(this.enemiesPerRow));
    /*
    new Array(5) === [null, null, null, null, null]
    for(i=0;i<length;i++)
      array[i] = ...
    
    [
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
      ((parseInt(this.canvas.style.height) - this.enemiesSize[2][1] - this.playerInitialCoords[1] - 20) / 5) * row
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
          this.enemies[0][j] = new Enemy(type, coords[0], coords[1]);
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
            this.enemies[i][j] = new Enemy(type, coords[0], coords[1]);
          }
        }
      }
    }
  }
}

class Enemy extends DrawableObject {
  constructor(type, x, y) {
    let elem = new Image();
    elem.src = `../assets/images/spaceships/enemy${type}.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("enemy");
    //constructor(domElement, x, y, width, height, topBottom = "top", leftRight = "left")
    super(elem, x, y, game.enemiesSize[type][0], game.enemiesSize[type][1]);

    this.type = type;
  }
}

class PlayerBullet extends DrawableObject {
  constructor(x, y) {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/playerBullet.png";
    elem.classList.add("bullet");
    super(elem, x, y, game.bulletSize[0], game.bulletSize[1], "bottom");
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
    if(this.y - this.height < game.height) {
      //console.log("Bala subiendo");
      this.y += game.bulletStep;
      this.update();
      window.requestAnimationFrame(() => { this.move(); });
    }
  }
}

class Player extends DrawableObject {
  constructor() {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/player1.png";
    elem.id = "player";
    super(elem, game.playerInitialCoords[0], game.playerInitialCoords[1], game.playerSize[0], game.playerSize[1], "bottom");
  }
  moveLeft = function () {
    if (this.x > game.step) {
      this.x -= game.step;
      this.update();
    }
  }
  moveRight = function () {
    if (this.x + this.width < game.width - game.step) {
      this.x += game.step;
      this.update();
    }
  }
  shoot() {
    console.log("Function player.shoot")
    console.log("bullet x", this.x + (this.width / 2) - (game.bulletSize[0] / 2))
    console.log("bullet y", this.y + game.bulletSize[1])
    const bullet = new PlayerBullet(
      this.x + (this.width / 2) - (game.bulletSize[0] / 2), 
      this.y + (game.bulletSize[1] * 1.5));
    console.log(bullet);
    /*
    Para mover la bala hacia arriba:
    1.- window.requestAnimationFrame(bullet.move)
    */
    bullet.move();
  }
}

export const game = new Game(5);
game.createEnemies();
const player = new Player();
console.log(game);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") { player.moveLeft(); }
  if (e.key === "ArrowRight") { player.moveRight(); }
  if (e.key === " ") { console.log("SHOOT"); player.shoot(); }
});
