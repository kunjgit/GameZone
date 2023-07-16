$.RECT = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

$.RECT.prototype.collidesWith = function(anotherRect) {
  return this.x < anotherRect.x + anotherRect.w &&
    this.x + this.w > anotherRect.x &&
    this.y < anotherRect.y + anotherRect.h &&
    this.h + this.y > anotherRect.y;
};