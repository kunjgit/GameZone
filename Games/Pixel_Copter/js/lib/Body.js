(function(root) {

/*
 * Filling an entity's Body slot enables it to take physical form
 * in the simulation. The entity will still need a View to be rendered.
 */
var Body = Class.extend({

    // public properties
    entity: null,
    x: 0,
    y: 0,
    rotation: 0,
    radius: 20,

    // constructor
    init: function(entity)
    {
        this.entity = entity;
    },

    testCollision: function(otherEntity)
    {
        var dx = 0,
            dy = 0;

        dx = this.x - otherEntity.getBody().x;
        dy = this.y - otherEntity.getBody().y;

        return Math.sqrt((dx * dx) + (dy * dy)) <= this.radius + otherEntity.getBody().radius;
    },
    //-------o positioning functions o-------//

    //@TODO: Ask Matt, how to use setters so that when I set rotation, I could call private wrapAngle function? Also how I could make the function private
    wrapAngle : function(mr) {
        var r = this.rotation + mr;
        if (r > Math.PI) {
            r -= Math.PI * 2;
        }
        if (r < 0 - Math.PI) {
            r += Math.PI * 2;
        }
        return r;
    },
    //@TODO: How to put the context, width,height,fullWidth, fullHeight to a public valueobject to read it from there?
    wrapPosition : function() {

        if (this.x < -16) {
            this.x += fullWidth;
        } else if (this.x> fullWidth - 16) {
            this.x -= fullWidth;
        }

        if (this.y < -16) {
            this.y += fullHeight
        } else if (this.y> fullHeight - 16) {
            this.y -= fullHeight;
        }

    }

});

root.HelicopterGame.Body = Body;

})(window);