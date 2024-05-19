game.Platform = me.Entity.extend({

    init : function (x, y, settings) {

        this._super(me.Entity, 'init', [x, y, settings]);

        this.type = "platform";
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.collisionMask = me.collision.types.ENEMY_OBJECT;
    },

    onCollision : function (response, other) {
        return false;
    }
});

