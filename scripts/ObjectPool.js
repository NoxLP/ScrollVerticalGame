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
    obj.elem.style.display = "none";
    let index = this.showingObjects.findIndex(x => x.id === obj.id);
    this.hiddenObjects.push(this.showingObjects.splice(index, 1)[0]);
    obj.x = this.hiddenCoords[0];
    obj.y = this.hiddenCoords[1];
  }
}