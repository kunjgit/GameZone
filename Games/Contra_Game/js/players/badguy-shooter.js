game.BadguyRed = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = "BadGuy Red";
        this.chartype = "BadGuy";

        var settings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(0, game.constants.Player_veloYmax);


        //composition
        //delegates for stuff
        this.flags = new Flags(this);
        this.lifecyle = new PlayerLifeState(this);
        this.input = new PlayerInput();
        this.movement = new MovementInput(this);
        this.ai = new AISniper(this);
        this.gun = new Gun(this, {reloadTime : 1220});
        this.displayHandler = new Display_BadGuyRed(this);
    },

    update : function (dt) {

        this.lifecyle.update(dt);
        this.input = this.ai.getInput(dt);
        this.gun.fire(dt);

        //step...
        //clear dx/dy then move
        //this.input.clear();
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
