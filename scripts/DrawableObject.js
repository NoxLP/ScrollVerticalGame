import { game } from "./main.js";

/**
 * All objects that should be draw in the DOM, must inherit from this class
 */
export class DrawableObject {
  constructor(domElement, x, y, width, height) {
    this.elem = domElement;
    this.width = width;
    this.height = height;
    this._x = x;
    this._y = y;

    this.update();
    game.canvas.appendChild(this.elem);
  }
  get x() { return this._x; }
  set x(value) { 
    this._x = value;
    this.updateX();
  }
  get y() { return this._y; }
  set y(value) {
    this._y = value;
    this.updateY();
  }
  get centerX() { return this._x + (this.width / 2); }
  get centerY() { return this._y + (this.height / 2); }

  updateX() { this.elem.style.left = `${this._x}px`; }
  updateY() { this.elem.style.top = `${this._y}px`; }
  /**
   * Update DOM position and size
   */
  update () {
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;

    this.elem.style.left = `${this._x}px`;
    this.elem.style.top = `${this._y}px`;
  }
}
/*
var coordinate = obj.x; => get x()
obj.x = 4 => set x()
*/