const STEP = 30;

class Canvas {
  constructor(){
    this.elem = document.getElementById('game');
    this.width = 1100;
    this.height = 800;

    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;
  }
}

class Game {
  constructor() {
    this.elem = document.getElementById("game");
    this.enemies = [];
  }
}

class Player {
  constructor() {
    this.elem = new Image(); //document.getElementById('player');
    this.elem.src = "../assets/images/spaceships/player1.png";
    this.elem.id = "player";
    
    this.width = 80;
    this.height = 80;
    this.x = Math.round((canvas.width / 2) - (this.width / 2));
    this.y = 60;
    
    this.update();
    game.elem.appendChild(this.elem);
  }
  update = function() {
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;
    this.elem.style.left = `${this.x}px`;
    this.elem.style.bottom = `${this.y}px`;
  }
  moveLeft = function() {
    if (this.x > STEP) {    
      this.x -= STEP;
      this.update();
    }
  }
  moveRight = function() {
    if (this.x + this.width < canvas.width - STEP) {
      this.x += STEP;
      this.update();
    }
  }
}

const canvas = new Canvas();
const game = new Game();
const player = new Player();

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft") { player.moveLeft() }
  if (e.key === "ArrowRight") { player.moveRight() }
});