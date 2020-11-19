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
      return obj;
    } else {
      let obj = objCreationCallback();
      this.showingObjects.push(obj);
      return obj;
    }
  }
  storeObject(obj) {
    let index = this.showingObjects.findIndex(x => x.id === obj.id);
    this.showingObjects.splice(index, 1);
    this._hideObject(obj);
  }
  _hideObject(obj) {
    this.hiddenObjects.push(obj);
    obj.elem.style.display = "none";
    obj.elem.style.transition = "";
    obj.x = this.hiddenCoords[0];
    obj.y = this.hiddenCoords[1];
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