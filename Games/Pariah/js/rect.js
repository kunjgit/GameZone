$.Rect = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.b = y + h;
  this.t = y;
  this.l = x;
  this.r = x + w;
};
