game.GoodGuyServerNpc = me.Entity.extend({

    /*--------------------------------
    * Init
    *--------------------------------*/
    init : function (x, y, config) {

        //initialization
        //variables
        this.mpid = config.mpid;
        this.name = this.mpid;
        this.team = config.team;
        this.character  = config.character || game.constants.Character_Lance;
        this.lives = config.startlives || game.constants.Player_startlives;
        this.score = 0;

        //from server
        //variables
        this.serverCommands = [];

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
        this.ai = new AI_ServerCommands(this);
        this.movement = new MovementInput(this);
        this.gun = new Gun(this);
        this.displayHandler = new Display_BillLance(this, this.character.sprite_prefix);
    },



    /*--------------------------------
    * Game Loop / Manage
    *--------------------------------*/
    update : function (dt) {

      //step 1...
      //delegate updates
      this.input = this.ai.getInput(dt, this.serverCommands);
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
      return false;
    },

    removeIt : function() {
        this.displayHandler.cleanUp();
        me.game.world.removeChild(this);
    },

    /*--------------------------------
    * Server Commands
    *--------------------------------*/
    applyServerRemoveCommand : function(command){
      this.removeIt();
    },
    applyServerCommands : function (serverCommands){
        this.serverCommands = serverCommands;
    },

});
