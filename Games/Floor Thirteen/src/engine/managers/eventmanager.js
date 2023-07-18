/**
 * Manager game events.
 */
function EventManager() {
  // Methods variables
  var handlers = {};

  __mixin(this, {
    /**
     * Unregister all event listeners.
     */
    c: function clear() {
      handlers = {};
    },
    /**
     * Add an event handler.
     *
     * @param  {String} type
     * @param  {Function} func
     * @param  {Object} ctx
     */
    a: function add(type, func, ctx) {
      handlers[type] || (handlers[type] = []);
      handlers[type].push({f: func, c: ctx});
    },
    /**
     * Remove an event handler.
     *
     * @param  {String} type
     * @param  {Function} func
     */
    r: function remove(type, func) {
      if (func) {
        var list = handlers[type] || [];
        for (var i = list.length; i--;) {
          func == list[i].f && list.splice(i, 1);
        }
      } else {
        delete handlers[type];
      }
    },
    /**
     * Emit an event.
     *
     * @param  {String} type
     * @param  {...} arguments
     */
    e: function emit() {
      var args = argumentsToArray(arguments);
      var list = handlers[args.shift()] || [];
      for (var i = list.length; i--;) {
        list[i].f.apply(list[i].c, args);
      }
    }
  });
}
