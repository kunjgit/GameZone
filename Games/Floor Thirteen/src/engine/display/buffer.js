/**
 * @param  {HTMLCanvasElement} canvas
 * @param  {int} width
 * @param  {int} height
 * @param  {int} scale
 */
function Buffer(canvas, width, height, scale) {
  var ctx = canvas.getContext('2d');
  var renderer = new Renderer(width, height);
  var textureCanvas;
  var textureCtx;
  var texture;

  // Resize canvas
  var w = canvas.width = scale * width;
  var h = canvas.height = scale * height;

  // Disable smoothing
  ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;

  // Generate overlay texture
  textureCanvas = createCanvas();
  textureCanvas.width = textureCanvas.height = scale;
  textureCtx = textureCanvas.getContext('2d');
  textureCtx.fillStyle = 'rgba(255,255,255,.02)';
  textureCtx.fillRect(1, 0, scale - 2, 1);
  textureCtx.fillRect(0, 1, 1, scale - 2);
  textureCtx.fillStyle = 'rgba(0,0,0,.05)';
  textureCtx.fillRect(1, scale - 1, scale - 2, 1);
  textureCtx.fillRect(scale - 1, 1, 1, scale - 2);
  texture = ctx.createPattern(textureCanvas, 'repeat');

  /**
   * Render game.
   *
   * @param  {Stage} stage
   */
  this.r = function render(stage) {
    // Draw game
    renderer.r(stage);
    ctx.drawImage(renderer.c, 0, 0, renderer.w, renderer.h, 0, 0, w, h);

    // Draw pixel filter
    ctx.fillStyle = texture;
    ctx.fillRect(0, 0, w, h);
  };
}
