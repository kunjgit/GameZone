var delayer = (function() {

  var delayId;
  var delayerStack = [];
  var delayTime = 75; // in millis

  // --- PUBLIC METHODS ---

  /**
   * @param {Function} callbacks
   * @returns {Function}
   */
  var delay = function(callback) {
    return function() {
      delayerStack.push([callback, arguments]);
      runDelayer();
    }
  };

  // --- PRIVATE METHODES ---

  var runDelayer = function() {
    if (delayId == null) {
      delayId = setTimeout(function() {
        delayId = null;
        var task = delayerStack.shift();
        if (task) {
          task[0].apply(null, task[1]);
          if (delayerStack.length != 0) {
            runDelayer();
          }
        }
      }, delayTime);
    }
  };

  return {
    delay: delay
  };

})();