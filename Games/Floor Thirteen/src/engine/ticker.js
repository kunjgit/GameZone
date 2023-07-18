function Ticker() {
  // Private variables
  var requestID = 0;

  // Methods variables
  var time, update;

  __mixin(this, {
    /**
     * Start the game loop.
     *
     * @param  {Function} callback
     */
    r: function run(callback) {
      // Stop previous tick
      requestID && this.s();

      time = +new Date();
      requestID = requestAnimationFrame(update = function() {
        callback(-(time - (time = +new Date())) / 1000);
        requestID = requestAnimationFrame(update);
      });
    },
    /**
     * Stop the game loop.
     */
    s: function stop() {
      if (requestID) {
        cancelAnimationFrame(requestID);
        requestID = 0;
      }
    },
  });
}
