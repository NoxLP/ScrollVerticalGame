export class ObjectPool {
  constructor() {
    this.hiddenCoords = [-10000, -10000];
    this.showingObjects = [];
    this.hiddenObjects = [];
  }
  getNewObject(objCreationCallback, x, y) {
    if(this.hiddenObjects.length > 0) {
      let obj = this.hiddenObjects.pop();
      this.showingObjects.push(obj);
      obj.elem.style.display = "inline";
      obj.x = x;
      obj.y = y;
      //console.log("// - pool NEW from hidden", obj, this)
      return obj;
    } else {
      let obj = objCreationCallback();
      this.showingObjects.push(obj);
      //console.log("// - pool NEW ", obj, this)
      return obj;
    }
  }
  _hideObject(obj) {
    this.hiddenObjects.push(obj);
    //obj.elem.style.top = getComputedStyle(obj.elem).top;
    //obj.elem.style.left = getComputedStyle(obj.elem).left;
    obj.elem.style.display = "none";
    obj.elem.style.transition = "";
    obj.x = this.hiddenCoords[0];
    obj.y = this.hiddenCoords[1];
  }
  storeObject(obj) {
    //console.log("// - STORED ", obj, this)
    let index = this.showingObjects.findIndex(x => x.id === obj.id);
    this.showingObjects.splice(index, 1);
    this._hideObject(obj);
  }
  storeIfNotStored(obj) {
    let index;
    if((index = this.showingObjects.findIndex(x => x.id === obj.id)) !== -1) {
      this.showingObjects.splice(index, 1);
      this._hideObject(obj);
    }
  }
  storeAllObjects() {
    this.showingObjects.forEach(x => this._hideObject(x));
    this.showingObjects = [];
  }
}