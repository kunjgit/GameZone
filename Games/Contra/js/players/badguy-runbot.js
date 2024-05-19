game.BadguyRunbot = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = "Run Robot";
        this.chartype = "BadGuy";

        var settings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(game.constants.Player_veloXmax * 1.3, game.constants.Player_veloYmax);

        this.type = "runbot";

        //composition
        //delegates for stuff
        this.flags = new Flags(this);
        this.lifecyle = new PlayerLifeState(this);
        this.input = new PlayerInput();
        this.movement = new MovementInput(this);
        this.ai = new AIRunner(this);
        this.displayHandler = new Display_BadGuyRunbot(this);
    },

    update : function (dt) {

        if (this.pos.y > me.game.viewport.height) {
            return this.removeIt();
        }
        else if(this.pos.x > me.game.viewport.width || this.pos.x < 0){
            return this.removeIt();
        }

        this.input = this.ai.getInput(dt);
        this.movement.update(dt);
        this.displayHandler.update(dt);

        this.body.update(dt);
        me.collision.check(this);

        return this._super(me.Entity, 'update', [dt]) || true;
    },

    onCollision : function (response, other) {

        switch (other.type){

            case 'platform' :
                return commons.collisions.withPlatformDemo(this, response, other);

            case 'bullet' :
                if(other.pid != game.manager.gameState.fpu.mpid){
                    return false;
                }
                if(commons.collisions.withBullet(this, response, other)) {
                    game.manager.postBulletDamage(this, other);
                    this.processDeath();
                }
                return false;


            default :
                return false;
        }
    },
    removeIt(){
      me.game.world.removeChild(this);
    },
    processDeath : function() {
        me.game.world.removeChild(this);
        return false;
    },
});
