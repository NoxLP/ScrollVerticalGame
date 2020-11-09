const STEP = 30;
function Canvas(){
  this.elem = document.getElementById('game');
  this.width = 1100;
  this.height = 800;

  this.elem.style.width = `${this.width}px`;
  this.elem.style.height = `${this.height}px`;
};
const canvas = new Canvas();

function Player() {
  this.elem = document.getElementById('player');
  this.width = 80;
  this.height = 80;
  this.x = Math.round((canvas.width / 2) - (this.width / 2));
  this.y = 60;
  
  this.update = function() {
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;
    this.elem.style.left = `${this.x}px`;
    this.elem.style.bottom = `${this.y}px`;
  }
  
  this.update();
  this.moveLeft = function() {
    if (this.x > STEP) {    
      this.x -= STEP;
      this.update();
    }
  }

  this.moveRight = function() {
    if (this.x + this.width < canvas.width - STEP) {
      this.x += STEP;
      this.update();
    }
  }
}
const player = new Player();

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft") { player.moveLeft() }
  if (e.key === "ArrowRight") { player.moveRight() }
})