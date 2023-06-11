(function(root) {

/*
 * Basic physics movement minus collision detection.
 * Extend to add collision detection.
 */
var Physics = Class.extend({

    // public properties
    entity: null,
    mr: 0,
    mx: 0,
    my: 0,
    thrust:0.25,
    gravity:0.1,
    speed:0,
    boost:0,

    // constructor
    init: function(entity)
    {
        this.entity = entity;
    },

    update: function()
    {
        //this.entity.getBody().x += this.velocityX;
        //this.entity.getBody().y += this.velocityY;

        //this.velocityX *= this.drag;
        //this.velocityY += this.drag;

    },

    limitSpeed : function(x, y) {
        var maxSpeed = this.boost ? 4.5 : 3;
        var r = Math.atan2(this.mx, this.my);

        var speed = Math.sqrt(Math.pow(x - (x + this.mx), 2)
                            + Math.pow(y - (y + this.my), 2));

        if (speed > maxSpeed) {
            speed = maxSpeed;
        }
        this.mx = Math.sin(r) * speed;
        this.my = Math.cos(r) * speed;
        this.speed = speed;
    },

});

root.HelicopterGame.Physics = Physics;

})(window);