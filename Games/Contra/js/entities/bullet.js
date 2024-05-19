
game.Bullet = me.Entity.extend({

    init : function (x, y, config) {

        this.bid  = config.bid;
        this.pid  = config.pid;
        this.team = config.team;

        this.bulletVelo = game.constants.Bullet_velo;

        this._super(me.Entity, "init", [x, y, {width: game.constants.Bullet_diameter, height: game.constants.Bullet_diameter}]);

        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;

        var mag = (Math.abs(config.dirX) + Math.abs(config.dirY)) || 1;
        this.body.vel.x = (config.dirX / mag) * this.bulletVelo;
        this.body.vel.y = (config.dirY / mag) * this.bulletVelo;
        this.body.gravity = 0;

        this.type = "bullet";
        this.initRenderable();
        this.alwaysUpdate = true;
    },

    initRenderable : function () {

        var color = '#FFFFFF'; //0000'; // game.commons.getColorForTeam(this.team) || '#FFFF00';

        this.renderable = new (me.Renderable.extend({
            init : function () {
                this._super(me.Renderable, "init", [0, 0, game.constants.Bullet_radius, game.constants.Bullet_radius]);
                this.teamColor = color;
            },
            destroy : function () {},
            draw : function (renderer) {
                var rcolor = renderer.getColor();
                renderer.setColor(this.teamColor);
                renderer.fillArc(0, 0, this.width, 0, 6.28);
                renderer.setColor(rcolor);
            }
        }));
    },

    update : function (time) {

        if (this.pos.y + this.height <= 0) {
            me.game.world.removeChild(this);
        }
        else if(this.pos.x - this.width <= 0){
            me.game.world.removeChild(this);
        }

        this.body.update();
        //me.collision.check(this); if i want bullets to destroy each other
        return true;
    },

    onCollision : function (response, other) {

        if (other.type == 'bullet'){
          other.onTargetHit(this);
          me.game.world.removeChild(this);
        }
        return false;
    },

    onTargetHit(target){
      commons.game.effect_ExplodeOnTarget(target);
      me.game.world.removeChild(this);
    }
});
