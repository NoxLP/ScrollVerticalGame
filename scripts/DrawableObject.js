import { game } from "./main.js";

/**
 * All objects that should be draw in the DOM, must inherit from this class
 */
export class DrawableObject {
  constructor(domElement, x, y, width, height) {
    this.elem = domElement;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.update();
    game.canvas.appendChild(this.elem);
  }
  /**
   * Update DOM position and size
   */
  update () {
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;

    this.elem.style.left = `${this.x}px`;
    this.elem.style.top = `${this.y}px`;
  }
}