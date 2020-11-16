import { CollisionableObject } from "../base/CollisionableObject.js";
import { game, player } from "../main.js";

var lastId = -1;

/**
 * Class for enemy bullets
 */
export class EnemyBullet extends CollisionableObject {
  constructor(x, y) {
    let elem = new Image();
    elem.src = "assets/images/bullets/enemyBullet.png"
    elem.classList.add("bullet");
    super(elem, x, y, game.bulletSize[0], game.bulletSize[1]);

    this.id = lastId++;
  }
  _getAngle(direction) {
    var angle = Math.atan2(direction[1], direction[0]); //radians
    var degrees = (180*angle/Math.PI);  //degrees
    //return degrees;
    return (Math.round(degrees) + 90) % 360; //counter-clockwise to clockwise
  }
  /**
   * Move enemy bullet in established direction
   * @param {array} direction Direction of movement in an (x, y) array
   */
  move(direction, rotate = true) {
    /*
     x  y
    [0, 1] => abajo
    1, 0 => derecha
    1, 1 => abajo y derecha
    0, -1 => arriba
    ...

    x += direction[0]
    y += direction[1]
    */
    //console.log("*********************** MOVING ENEMY BULLET", this)
    if(rotate)
      this.elem.style.transform = `rotate(${this._getAngle(direction)}deg)`
    if (this.y > 0 && //limite superior
      this.y + this.height < game.height && //limite inferior
      this.x > 0 && //limite izq
      this.x + this.width) //limite der
    {
      //console.log("Bala moviendose");
      this.y += (direction[1] * game.enemyBulletStep);
      this.x += (direction[0] * game.enemyBulletStep);

      var collidingPlayer = this.collideWith(player);

      if (collidingPlayer) {
        //console.log("collidingPlayer")
        game.playerHitted();
        game.canvas.removeChild(this.elem);
      } else {
        window.requestAnimationFrame(() => { this.move(direction, false); });
      }
    } else {
      //console.log("REMOVE BULLET")
      game.canvas.removeChild(this.elem);
    }
  }
}