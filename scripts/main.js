import { DrawableObject } from "./drawableObject.js";


class Canvas {
  constructor() {
    this.elem = document.getElementById('game');
    this.width = 1100;
    this.height = 800;
    
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;
  }
}

class Game {
  constructor(enemiesPerRow) {
    this.step = 30;
    this.elem = document.getElementById("game");
    this.enemiesSize = [
      [50,50],
      [65,65],
      [80,80]
    ];
    this.playerSize = [80, 80];
    //console.log(canvas.width)
    this.playerInitialCoords = [Math.round((canvas.width / 2) - (this.playerSize[0] / 2)), 60]
    this.enemiesPerRow = enemiesPerRow;
    this.enemies = new Array(5).fill(new Array(this.enemiesPerRow));
  }
  _calculateCoordinatesByPosition(column, row) {
    //console.log(this.elem.style.width)
    //console.log(this.enemiesPerRow)
    return [
      (parseInt(this.elem.style.width) / this.enemiesPerRow) * column,
      (parseInt(this.elem.style.height - this.playerSize[1] - this.enemiesSize[2] - this.playerInitialCoords[1]) / this.enemiesPerRow) * row
    ];
  }
  createEnemies() {
    //loop per enemy type
    for (let type = 0; type < 3; type++) {
      if (type == 0) {
        for(let i = 0; i < this.enemiesPerRow; i++) {
          const coords = this._calculateCoordinatesByPosition(i, 0);
          //console.log(coords)
          this.enemies[type][i] = new Enemy(type, coords[0], coords[1]);
          this.elem.appendChild(this.enemies[type][i].elem);
        }
      } else {

        //const coords = this._calculateCoordinatesByPosition(i, 0);

      }
    }
  }
}

class Enemy extends DrawableObject {
  constructor(type, x, y) {
    let elem = new Image();
    elem.src = `../assets/images/spaceships/enemy${type}.png`;
    elem.classList.add("enemy");
    super(elem, x, y, game.enemiesSize[type][0], game.enemiesSize[type][1]);

    this.type = type;
  }
}

class Player extends DrawableObject {
  constructor() {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/player1.png";
    elem.id = "player";
    super(elem, game.playerInitialCoords[0], game.playerInitialCoords[1], game.playerSize[0], game.playerSize[1], "bottom")
    
    game.elem.appendChild(this.elem);
  }
  moveLeft = function () {
    if (this.x > game.step) {
      this.x -= game.step;
      this.update();
    }
  }
  moveRight = function () {
    if (this.x + this.width < canvas.width - game.step) {
      this.x += game.step;
      this.update();
    }
  }
}

const canvas = new Canvas();
const game = new Game(11);
game.createEnemies();
const player = new Player();
console.log(game);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") { player.moveLeft() }
  if (e.key === "ArrowRight") { player.moveRight() }
});
