import { DrawableObject } from "./DrawableObject.js";

/**
 * All objects that can collide with other obects must inherit from this. If an object collides with others, it must be draw too, therefore this object inherits from DrawableObject.
 */
export class CollisionableObject extends DrawableObject {
  constructor(domElement, x, y, width, height) {
    super(domElement, x, y, width, height);
    this.collisionable = true;
  }
  /**
   * Check if this collides with other.
   * @param {CollisionableObject} other ColisionableObject to check if it collide with this. Does NOT check if movingObject is a ColisionableObject.
   * @todo Esto tendría que diferenciar entre tipos de objetos, por ejemplo dos disparos no deberían colisionar entre sí. ¿White/blacklist?
   */
  collideWith(other) {
    if (other && other.collisionable &&
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y) {
      return true;
    } 
    
    return false;
  }
  /**
   * Check if this collides with other using both elements bounding rect's top and left, instead of the object x and y variables(used when animation is CSS-driven).
   * @param {CollisionableObject} other ColisionableObject to check if it collide with this. Does NOT check if movingObject is a ColisionableObject.
   * @todo Esto tendría que diferenciar entre tipos de objetos, por ejemplo dos disparos no deberían colisionar entre sí. ¿White/blacklist?
   */
  collideWithByBoundingRect(other) {
    let thisRect = this.elem.getBoundingClientRect();
    let otherRect = other.elem.getBoundingClientRect();
    if (other && other.collisionable &&
      thisRect.left < otherRect.left + other.width &&
      thisRect.left + this.width > otherRect.left &&
      thisRect.top < otherRect.top + other.height &&
      thisRect.top + this.height > otherRect.top) {
      return true;
    } 
    
    return false;
  }
}