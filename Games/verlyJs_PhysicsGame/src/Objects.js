class Box extends Entity {
  constructor(x, y, width, height, interation, verlyInstance) {
    super(interation, verlyInstance);
    this.x = x;
    this.y = y;
    // this.x = x;
    // this.y = y;
    this.width = width;
    this.height = height;

    // this._box = new Entity(16);
    this.addPoint(this.x, this.y, 0, 0);
    this.addPoint(this.x + this.width, this.y, 0, 0);
    this.addPoint(this.x + this.width, this.y + this.height, 0, 0);
    this.addPoint(this.x, this.y + this.height, 0, 0);
    this.addStick(0, 1);
    this.addStick(1, 2);
    this.addStick(2, 3);
    this.addStick(3, 0);
    this.addStick(3, 1);
  
  }
}