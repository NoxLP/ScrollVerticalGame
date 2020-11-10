export class DrawableObject {
  constructor(domElement, x, y, width, height, topBottom = "top", leftRight = "left") {
    this.elem = domElement;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.topBottom = topBottom;
    this.leftRight = leftRight;
    this.update();
  }
  update = function () {
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;

    if(this.leftRight === "left")
      this.elem.style.left = `${this.x}px`;
    else
      this.elem.style.right = `${this.x}px`;

    if(this.topBottom === "top")
      this.elem.style.top = `${this.y}px`;
    else
      this.elem.style.bottom = `${this.y}px`;
  }
}