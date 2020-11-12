import { CollisionableObject } from "../CollisionableObject.js";
import { game } from "../main.js";

/**
 * Class for player bullets
 */
export class PlayerBullet extends CollisionableObject {
  constructor(x, y) {
    let elem = new Image(); //document.getElementById('player');
    elem.src = "../assets/images/spaceships/playerBullet.png";
    elem.classList.add("bullet");
    super(elem, x, y, game.bulletSize[0], game.bulletSize[1]);
  }
  /**
   * Iterates all enemies to see if collides with one of them
   */
  isCollidingWithAnEnemy() {
    //console.log("isCollidingWithAnEnemy", game.enemies)
    //This could be more efficiente storing enemies by their coords in some sort of grid, so one should only check for collisions in the same column of the bullet
    for(let i = 0; i < game.enemies.length; i++) {
      for(let j = 0; j < game.enemies[i].length; j++) {
        //console.log("ENEMY", game.enemies[i])
        if(this.collideWith(game.enemies[i][j])) {
          //console.log(game.enemies[i][j])
          return game.enemies[i][j];
        }
      }
    }
    return null;
  }
  /**
   * move the bullet always up
   */
  move() {
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
      } else {
        window.requestAnimationFrame(() => { this.move(); });
      }
    } else {
      console.log("REMOVE BULLET")
      game.canvas.removeChild(this.elem);
    }
  }
}