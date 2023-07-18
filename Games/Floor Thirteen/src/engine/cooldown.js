/**
 * Manage entity cooldowns.
 */
function Cooldown() {
  var cooldowns = {};
  var name;

  __mixin(this, {
    /**
     * Get the remaining time of the specified cooldown.
     *
     * @param  {String} name
     * @return {float}
     */
    g: function get(name) {
      return cooldowns[name];
    },
    /**
     * Set a cooldown.
     *
     * @param  {String} name
     * @param  {float} duration
     */
    s: function set(name, duration) {
      cooldowns[name] = duration;
    },
    /**
     * Update all cooldowns.
     *
     * @param  {float} elapsed
     */
    u: function update(elapsed) {
      for (name in cooldowns) {
        if ((cooldowns[name] -= elapsed) <= 0) {
          delete cooldowns[name];
        }
      }
    }
  });
}
