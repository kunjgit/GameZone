
//sin wave equation = y(t) = Amplitude * sin(2PI * Frequency * t)
//
//where frequency = how many milliseconds it takes to do a cycle
//      amplitude = dy during cycle
game.Powerup = me.Entity.extend({

    init : function (x, y, config) {

        config = config || {};
        this.t = 0;
        this.yprime = y;

        this.dirX = config.dirX || 1;
        this.velX = config.velX || 2.2;
        this.waveamp = config.waveamp || 70;
        this.wavefreq = config.wavefreq || 2000;
        this.status = 1;
        this.prize = "prize-S";

        var settings = {
            width: 27,
            height: 19,
            image: 'power-ups-sprite'
        };
        this._super(me.Entity, "init", [x, y, settings]);
        //this.body.collisionType = me.collision.types.ACTION_OBJECT;

        this.body.vel.x = this.dirX * this.velX;
        this.body.vel.y = 0;
        this.body.gravity = 0;

        this.renderable.addAnimation('floating', [6, 7, 8], 250);
        this.renderable.addAnimation('prize-S', [3], 99999999);
        this.renderable.setCurrentAnimation('floating');

        this.renderable.currentTransform.scale(2);
        this.alwaysUpdate = true;
    },

    removeIt : function() {
        me.game.world.removeChild(this);
    },

    update : function (dt) {

        if(!this.inViewport){
          this.pos.x = 10;
        }
        if(this.status == 1) {
            if(!this.renderable.isCurrentAnimation('floating')){
                this.renderable.setCurrentAnimation('floating');
            }

            this.t += dt;
            const y = this.waveamp * Math.sin(2 * Math.PI * this.t / this.wavefreq) + this.yprime;
            this.body.update();
            this.pos.y = y;
        }
        else if(this.status == 2){

            if(!this.renderable.isCurrentAnimation(this.prize)){
                this.renderable.setCurrentAnimation(this.prize);
            }
            this.body.update();
        }
        me.collision.check(this);
        return true;
    },

    onCollision : function (response, other) {

        if(this.status == 1 && other.type == 'bullet'){
            this.body.gravity = 0.8;
            this.body.vel.x = 0;
            this.body.vel.y = 0;
            this.status = 2;
            return false;
        }
        if(this.status == 2 && other.type == 'platform') {
            return true;
        }
        return false;
    }
});
