import { DrawableObject } from "./DrawableObject.js";

export class CollisionableObject extends DrawableObject {
  constructor(domElement, x, y, width, height, topBottom = "top", leftRight = "left") {
    super(domElement, x, y, width, height, topBottom, leftRight);
    this.collisionable = true;
    this.collision = false;
    this.collisionCallback = undefined;
  }
  /**
   * Check if this collides with other. Does NOT check if other is a ColisionableObject.
   * @param {CollisionableObject} other ColisionableObject to check if it collide with this. Does NOT check if movingObject is a ColisionableObject.
   * @todo Esto tendría que diferenciar entre tipos de objetos, por ejemplo dos disparos no deberían colisionar entre sí. ¿White/blacklist?
   */
  collideWith(other) {
    console.log("collideWith", this.x, other.x)
    if (other && other.collisionable &&
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y) {
      console.log("collides")
      this.collision = true;
    } else {
      this.collision = false;
    }

    return this.collision;
  }
}