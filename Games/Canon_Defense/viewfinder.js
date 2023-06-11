
function Viewfinder(x, y, w, h, fill) {
  // This is a very simple and unsafe constructor. 
  // All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
}
 
// Draws this shape to a given context
Viewfinder.prototype.draw = function(ctx, mouse) {
  
    if(typeof mouse !== "undefined"){
        ctx.strokeStyle = this.fill;
        context.beginPath();
        context.arc( mouse.x, mouse.y, this.w, 0, Math.PI * 2, true );
        context.closePath();
        context.stroke();
    }
    
    
  //ctx.fillRect(this.x, this.y, this.w, this.h);
};