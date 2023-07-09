//from introduction to canvas http://simonsarris.com/blog/510-making-html5-canvas-useful
// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Bullet(x, y, w, dx, dy, fill) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.dx = dx || 0.5;
  this.dy = dy || 0.5;
  this.speed = 10;
  this.fill = fill || '#AAAAAA';
}

// Draws this shape to a given context
Bullet.prototype.draw = function(ctx, num) {
    //ctx.save();

    ctx.fillStyle = this.fill;
    ctx.beginPath();
    //ctx.translate(game.tower.x, game.tower.y);
    //ctx.rotate(this.angle);
    ctx.arc( this.x, this.y, this.w, 0, Math.PI * 2, true );
    ctx.closePath();
    ctx.fill();
    // ctx.restore();

    //ctx.fillStyle = 'rgba(0,245,245, 0.4 )';
    //context.fillRect(this.x-this.w, this.y-this.w, this.w*2, this.w*2);


    //ctx.fillStyle = 'red';
    //ctx.font = "10pt Calibri";
    //ctx.fillText(num, this.x-this.w, this.y-this.w);

    this.updatePosition(ctx);
  //ctx.fillRect(this.x, this.y, this.w, this.h);
};

Bullet.prototype.updatePosition = function(ctx) {
    this.x = this.x + (this.dx * this.speed);
    this.y = this.y + (this.dy * this.speed);
};