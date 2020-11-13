import { Game } from "./Game.js";
import { Player } from "./Player.js";

export const game = new Game(10);
game.createEnemies();
export const player = new Player();
console.log(game);


document.addEventListener("keydown", function (e) {
  if(player.elem.style.display === "none")
    return;

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
  if(player.elem.style.display === "none")
    return;
    
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

window.onload = () => {
  document.getElementById("start").onclick = () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("background").style.display = "block";
    
    setTimeout(() => {
      game.moveEnemies();
      game.createBonusEnemy();
    }, 3000);
  };
};