/**
 * Store textures.
 */
function TextureManager() {
  // Private variables
  var image = new Image();
  var textures = {};
  var animations = {};

  // Methods variables
  var ix, iy;

  __mixin(this, {
    /**
     * Define the base spritesheet.
     *
     * @param  {String} spritesheet
     * @param  {Function} callback
     */
    l: function load(spritesheet, callback) {
      image.src = spritesheet;
      image.onload = function() {
        callback();
      };
    },
    /**
     * Slice the spritesheet in order to define textures.
     *
     * @param  {String} name
     * @param  {int} x
     * @param  {int} y
     * @param  {int} width
     * @param  {int} height
     * @param  {int} repeatX
     * @param  {int} repeatY
     */
    s: function slice(name, x, y, width, height, repeatX, repeatY) {
      repeatX = repeatX || 1;
      repeatY = repeatY || 1;

      var frames = textures[name] = [];
      for (iy = 0; iy < repeatY; iy++) {
        for (ix = 0; ix < repeatX; ix++) {
          frames.push({
            s: image,
            f: {
              x: x + ix * width,
              y: y + iy * height,
              w: width,
              h: height
            }
          });

          // DEBUG: Store texture name
          __PW_DEBUG && (frames[frames.length - 1].f.n = name);
        }
      }
    },
    /**
     * Define an animation.
     *
     * @param  {String} name
     * @param  {int[]} frames
     * @param  {float} duration
     */
    d: function defineAnimation(name, frames, duration) {
      animations[name] = {
        f: frames,
        d: duration ? (1 / duration * 1000 | 0) : 0xFFFF
      };

      // DEBUG: Store animation name
      __PW_DEBUG && (animations[name].n = name);
    },
    /**
     * Get the specified texture group.
     *
     * @param  {String} name
     * @return {Object[]}
     */
    g: function getTexture(name) {
      return textures[name];
    },
    /**
     * Get the specified animation.
     *
     * @param  {String} name
     * @return {Object[]}
     */
    a: function getAnimation(name) {
      return animations[name];
    }
  });
}
