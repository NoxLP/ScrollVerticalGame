export class PointsCounter {
  constructor(msPerChange) {
    this.msPerChange = msPerChange;
    this._counter = document.getElementById("pointsCounter");
    this._pointsQueue = []; //FIFO => first in first out
    this._currentShowedPoints = 0;
    this._timerId = null;
  }
  get showedPoints() { return this._currentShowedPoints; }
  set showedPoints(total) {
    this._pointsQueue.push(total);

    if(!this._timerId) {
      let msPerNumber = this.msPerChange / (this._pointsQueue[0] - this._currentShowedPoints);
      let number = msPerNumber >= 1 ? 1 : 1 / msPerNumber;
      this._timerId = setInterval(() => { this._animatePoints(number); }, msPerNumber);
    }
  }
  _buildString() {
    let str = "" + this._currentShowedPoints;
    return str.length < 5 ? "0".repeat(5 - str.length) + str : "0" + str;
  }
  _animatePoints(number) {
    if(this._pointsQueue.length === 0)
      return;

    if(this._currentShowedPoints <= this._pointsQueue[0]) {
      this._currentShowedPoints = Math.round(this._currentShowedPoints + number);
      this._counter.innerText = this._buildString();
    } else {
      this._currentShowedPoints = this._pointsQueue[0];
      this._counter.innerText = this._buildString();
      this._pointsQueue.shift();

      if(this._pointsQueue.length === 0) {
        clearInterval(this._timerId);
        this._timerId = null;
      }
    }
  }
  reset() {
    this._pointsQueue = [];
    clearInterval(this._timerId);
    this._timerId = null;
    this._currentShowedPoints = 0;
    this._counter.innerText = "00000";    
  }
}