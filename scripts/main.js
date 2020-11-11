import { Game } from "./Game.js";
import { Player } from "./Player.js";

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

window.onload = () => {
  document.getElementById("enemiesMovB").onclick = () => {
    game.moveEnemies();
  };
};