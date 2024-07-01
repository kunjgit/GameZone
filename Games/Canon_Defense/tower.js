
function Tower(x, y, w, h, fill) {
  // This is a very simple and unsafe constructor. 
  // All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
}
Tower.prototype.getRotate = function(mouse){
    //Math.atan(2);
    //tg = a/b
    var a = mouse.x - this.x;
   var b = mouse.y - this.y;
   var tg = a/b;
   var atan1 = Math.atan(tg);
   var atan = -Math.PI*2-atan1;
   return atan;
}
Tower.prototype.getDiffs = function(mouse){
    var a = mouse.x - this.x;
   var b = mouse.y - this.y;
   var c = Math.sqrt(a * a + b * b);
   var dx = a/c;
   var dy = b/c;
   return {dx: dx, dy: dy };
}
Tower.prototype.draw = function(ctx, mouse){
    ctx.save();
    
    ctx.fillStyle = this.fill;
    context.beginPath();
    context.arc( this.x, this.y, 10, 0, Math.PI * 2, true );
    context.closePath();
    context.fill();
    if(typeof mouse !== "undefined"){
           //Math.atan(2);
           //tg = a/b
           var atan = this.getRotate(mouse);
           ctx.translate(this.x, this.y);
           ctx.rotate(atan);
           ctx.fillRect(0-this.w/2, 0-this.h, this.w, this.h);
           
    }
    //ctx.fillStyle = '#AA00AA';
    //ctx.fillRect(this.x - this.w /2, this.y - this.h, this.w, this.h);
        
    ctx.restore();
}