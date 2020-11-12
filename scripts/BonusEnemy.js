import { CollisionableObject } from "./CollisionableObject.js";
import { game } from "./main.js";

export class BonusEnemy extends CollisionableObject {

  constructor(x, y) {
    let elem = new Image();
    elem.src = `../assets/images/spaceships/bonus.png`;// "../assets/images/spaceships/enemy" + type + ".png"
    elem.classList.add("bonusEnemy");
    super(elem, x, y, game.bonusSize[0], game.bonusSize[1]);
  }

 






}