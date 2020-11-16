import { Game } from "./Game.js";
import { Player } from "./Player.js";

export const normalizeVector = arr => {
  var length = Math.sqrt((arr[0] ** 2) + (arr[1] ** 2));
  return [arr[0] / length, arr[1] / length];
}

export const game = new Game(4);
export const player = new Player();
console.log(game);

document.addEventListener("keydown", function (e) {
  if (!player.responsive)
    return;

  /*
  key Left => -1,  0
  right =>     1,  0
  up =>        0, -1
  down =>      0,  1
  */

  switch(e.key) {
    case "ArrowLeft":
      player.playerDirection[0] = -1;
      break;
    case "ArrowRight":
      player.playerDirection[0] = 1;
      break;
    case "ArrowUp":
      if(game.gameState !== "spaceInvaders")
        player.playerDirection[1] = -1;
      break;
    case "ArrowDown":
      if(game.gameState !== "spaceInvaders")
        player.playerDirection[1] = 1;
      break;
  }
  if(!player.movementAnimationId)
    player.move();

  console.log(e.key)
  if (e.key === " " && !player.shooting) {
    console.log("SPACE")
    player.shooting = true;
    player.shoot();
  }
});

document.addEventListener("keyup", e => {
  if (!player.responsive)
    return;

  switch(e.key) {
    case "ArrowLeft":
      player.playerDirection[0] = 0;
      break;
    case "ArrowRight":
      player.playerDirection[0] = 0;
      break;
    case "ArrowUp":
      player.playerDirection[1] = 0;
      break;
    case "ArrowDown":
      player.playerDirection[1] = 0;
      break;
  }
  
  if (e.key === " ") {
    player.shooting = false;
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