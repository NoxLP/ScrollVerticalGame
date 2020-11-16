import { Game } from "./Game.js";
import { Player } from "./Player.js";

export const normalizeVector = arr => {
  var length = Math.sqrt((arr[0] ** 2) + (arr[1] ** 2));
  return [arr[0]/length, arr[1]/length];
}

export const game = new Game(9);
export const player = new Player();
console.log(game);

document.addEventListener("keydown", function (e) {
  if(!player.responsive)
    return;

  if (e.key === "ArrowLeft" && !game.keysDown.ArrowRight && !game.keysDown.ArrowLeft) {
    game.keysDown.ArrowLeft = true;
    player.moveLeft();
  }
  if (e.key === "ArrowRight" && !game.keysDown.ArrowLeft && !game.keysDown.ArrowRight) {
    game.keysDown.ArrowRight = true;
    player.moveRight();
  }
  if (e.key === "ArrowUp" && game.gameState !== "spaceInvaders" && !game.keysDown.ArrowUp && !game.keysDown.ArrowDown) {
    game.keysDown.ArrowUp = true;
    player.moveUp();
  }
  if (e.key === "ArrowDown" && game.gameState !== "spaceInvaders" && !game.keysDown.ArrowUp && !game.keysDown.ArrowDown) {
    game.keysDown.ArrowDown = true;
    player.moveDown();
  }
  if (e.key === " " && !game.keysDown.Space) {
    console.log("SPACE")
    game.keysDown.Space = true;
    player.shoot();
  }
});

document.addEventListener("keyup", e => {
  if(!player.responsive)
    return;
    
  if (e.key === "ArrowLeft") {
    game.keysDown.ArrowLeft = false;
  }
  if (e.key === "ArrowRight") {
    game.keysDown.ArrowRight = false;
  }
  if (e.key === "ArrowUp" && game.gameState !== "spaceInvaders") {
    game.keysDown.ArrowUp = false;
  }
  if (e.key === "ArrowDown" && game.gameState !== "spaceInvaders") {
    game.keysDown.ArrowDown = false;
  }
  if (e.key === " ") {
    game.keysDown.Space = false;
  }
});

window.onload = () => {
  document.getElementById("startButton").onclick = () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("background").style.display = "block";
    player.responsive = false;
    setTimeout(() => { game.start(); }, 300);
  };
};