game.Explosion1 = me.Entity.extend({

    init : function (x, y, config) {

        var settings = {
            image: "explosion-sprite",
            width:  40,
            height: 40
        };

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;

        this.body.collisionType = me.collision.types.WORLD_SHAPE;
        this.body.vel.x = 0;
        this.body.vel.y = 0;
        this.body.gravity = 0;

        this.renderable.addAnimation('explode', [2, 0, 1, 3, 2]);
        var that = this;
        this.renderable.setCurrentAnimation('explode', () => me.game.world.removeChild(that));
    },

    update : function (dt) {
        return (this._super(me.Entity, 'update', [dt]) || true);
    },
    onCollision : function (response, other) {
        return false;
    }
});
