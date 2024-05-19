game.GoodGuyBill = me.Entity.extend({

    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = this.mpid;
        this.team = config.team;
        this.character  = config.character || game.constants.Character_Bill;
        this.chartype = "GoodGuy";
        this.lives = config.startlives || game.constants.Player_startlives;
        this.score = 0;

        // melonjs
        // constructor and setup
        this.meSettings = {
            width:  game.constants.Player_width,
            height: game.constants.Player_height
        };
        this._super(me.Entity, 'init', [x, y, this.meSettings]);
        this.alwaysUpdate = true;
        this.body.setVelocity(game.constants.Player_veloXmax, game.constants.Player_veloYmax);


        //composition
        //delegates for stuff
        this.flags = new Flags(this);
        this.lifecyle = new PlayerLifeState(this);
        this.input = new PlayerInput();
        this.ai = new AI_UserInput(this);
        this.movement = new MovementInput(this);
        this.gun = new Gun(this);
        this.displayHandler = new Display_BillLance(this, this.character.sprite_prefix);
    },

    update : function (dt) {

      //step 1...
      //delegate updates
      this.input = this.ai.getInput(dt);
      this.lifecyle.update(dt);
      this.movement.update(dt);
      this.displayHandler.update(dt);

      //step 2...
      //special commands
      if(this.input.shooting){
        this.gun.fire(dt);
      }
      else{
        this.gun.idle(dt);
      }

      //step 2...
      //melon updates / checks
      this.body.update(dt);
      me.collision.check(this);

      //final...
      game.manager.postPlayerUpdate(this);
      return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },


    onCollision : function (response, other) {

        if (other.type == 'platform'){
          return commons.collisions.withPlatformDemo(this, response, other);
        }

        if(!commons.playerUtils.isLifecycleAlive(this)){
          return false;
        }
        else if (other.type == 'runbot' && commons.collisions.withBadguy(this, response, other)){
          this.onCollision_takeDamage(other);
          commons.game.effect_ExplodeOnTarget(this);
        }
        else if(other.type == 'bullet' && commons.collisions.withBullet(this, response, other)){
          this.onCollision_takeDamage(other);
          game.manager.postBulletDamage(this, other);
        }

        return false;
    },

    onCollision_takeDamage(other){
      this.lifecyle.setState(2);
      this.lives--;
      if(this.lives == 0){
        game.manager.onGameOver();
      }
    }
});
