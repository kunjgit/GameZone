var Input = (function () {
  // Private variable
  var capture = [];
  var active = [];
  var time = 1;

  // Methods variables
  var events, i, key;

  /**
   * Bind a listener on `document`.
   *
   * @param  {String} event name
   * @param  {Function} listener
   */
  function addDocumentListener(name, listener) {
    events = name.split(' ');
    for (i = events.length; i--;) {
      document.body.addEventListener(events[i], listener);
    }
  }

  // Listen `keydown` events
  addDocumentListener('keydown', function(e) {
    (~capture.indexOf(key = e.keyCode)) && e.preventDefault();
    !active[key] && (active[key] = time);
  });

  // Listen `keyup` events
  addDocumentListener('keyup', function(e) {
    (~capture.indexOf(key = e.keyCode)) && e.preventDefault();
    active[key] = 0;
  });

  /**
   * Manage keyboard events.
   */
  return {
    /**
     * Specify keys to capture.
     * Capturing a key stops the default behavior.
     *
     * @param  {int[]} key codes
     */
    c: function setCapture(codes) {
      capture = codes;
    },
    /**
     * Get the state of the specified key.
     *
     * @param  {int} key code
     * @return {Boolean}
     */
    p: function isPressed(code) {
      return !!active[code];
    },
    /**
     * @param  {int} code
     * @return {Boolean}
     */
    j: function justPressed(code) {
      return active[code] == time;
    },
    /**
     * Update keys state.
     */
    u: function update() {
      time++;
    }
  };
})();
