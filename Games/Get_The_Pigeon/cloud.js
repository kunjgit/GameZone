(()=>{

"use strict";

AFRAME.registerComponent('cloud', {
  schema: {
    velocity: {default: 1}
  },

  init: function () {
    // Do something when component first attached.
    this.pos = this.el.object3D.position;
    this.w = parseInt(this.el.getAttribute('width'));
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
    console.log('remove', this)
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
    this.pos.x += this.data.velocity;
    if (this.pos.x > 1200+this.w) {
      this.pos.x = -1200-this.w;
      this.pos.z = (Math.random() * 2400) - 1200;
    }
  }
});

})();
