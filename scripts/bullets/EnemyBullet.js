import { CollisionableObject } from "../base/CollisionableObject.js";
import { game, player } from "../main.js";

/**
 * Class for enemy bullets
 */
export class EnemyBullet extends CollisionableObject {
  constructor(x, y) {
    let elem = new Image();
    elem.src = "assets/images/bullets/enemyBullet.png"
    elem.classList.add("bullet");
    super(elem, x, y, game.bulletSize[0], game.bulletSize[1]);
  }
  collidesWithPlayer() {
    return this.collideWith(player);
  }
  /**
   * 
   * @param {array} direction Direction of movement in an (x, y) array
   */
  move(direction) {
    /*
    Aumentas y en x pixeles (game.bulletStep)
    
    Si la bala llega a arriba (game.height)
      para y destruye la bala
    else Si colisiona con enemigo
      para, destruyela bala, destruye enemigo
    de otra forma
      window.requestAnimationFrame(this.move)
    */
    if(this.y + this.height > 0) {
      //console.log("Bala subiendo");
      this.y -= game.bulletStep;
      var collidingEnemy = this.isCollidingWithAnEnemy();
      
      if(collidingEnemy) {
        console.log("COLLIDES WITH", collidingEnemy.row, collidingEnemy.column)
        //console.log("collidingEnemy")
        game.createExplosion(collidingEnemy);
        game.canvas.removeChild(this.elem);
        game.removeEnemy(collidingEnemy);
      } else if(this.collideWith(game.bonus)) {
        game.removeBonusEnemy();
        game.canvas.removeChild(this.elem);
      } else {
        window.requestAnimationFrame(() => { this.move(); });
      }
    } else {
      console.log("REMOVE BULLET")
      game.canvas.removeChild(this.elem);
    }
  }
}