

function Display_BillLance(player, spriteName){

    /*--------------------------------
    * Variables
    *--------------------------------*/
    this.player = player;

    const sn = spriteName || game.constants.Character_Bill.sprite_prefix;

    const animationmap = [
        {name : "shooting", frames : [5, 6]},
        {name : "idle",     frames : [5]},
        {name : "walk",     frames : [26, 27, 28, 29, 30]},
        {name : "jump",     frames : [37, 38, 39, 40]},
        {name : "duck",     frames : [36]},
        {name : "aimup",    frames : [8]},
        {name : "aimdownwalk",  frames : [18, 19, 20]},
        {name : "aimupwalk",    frames : [12, 13, 14]},
        {name : "dying",        frames : [46, 47, 48, 49, 50], delay : 500},
        {name : "dead",         frames : [50]}
    ];

    /*--------------------------------
    * Init / Clean UP
    *--------------------------------*/
    this.player.renderable = commons.me.textureSpriteHelper(game.texture.goodguys, sn, animationmap);

    this.highlight = new HL_PlayerWithReload(this.player);
    this.highlight.show();

    this.cleanUp = function(){
        this.highlight && this.highlight.hide();
    };


    /*--------------------------------
    * Update
    *--------------------------------*/
    this.update = function(dt) {

        //step 1..
        //update face direction
        const direction = player.flags.getFlag('direction') || 1;
        (direction == -1) ? this.player.renderable.flipX(true) : this.player.renderable.flipX(false);

        //step 2...
        //get spriteName ... update sprite
        const spriteName = this.update_getSpriteName();
        this.update_Sprite(spriteName);
        this.player.renderable.update(dt);
    };
    this.update_getSpriteName = function(){

        const lifecycle = commons.playerUtils.getLifecycleState(this.player);
        const input = commons.playerUtils.getCurrentInput(this.player);
        const aiming = commons.playerUtils.getAimDirection(this.player);

        const isMoving = commons.playerUtils.isMoving(this.player);
        const isAirborne = commons.playerUtils.isAirborne(this.player);
        const isShooting = commons.playerUtils.isGunShooting(this.player);
        const isInputLeftRight = (input.left || input.right) ? true : false;

        //type 1...
        //states that are forced by lifecycle
        if(lifecycle == 0){
            return "idle";
        }
        if(lifecycle == 2){
            return "dying";
        }
        if(lifecycle == 3){
            return "dead";
        }


        //case...
        //any airborne is just jump
        if(isAirborne){
          return "jump";
        }

        //case...
        //moving l/r .. aimup
        if(isInputLeftRight && aiming==2){
          return "aimupwalk";
        }

        //case...
        //moving l/r .. aimdown
        if(isInputLeftRight && aiming==4){
          return "aimdownwalk";
        }

        //case..
        //moving l/r ... shooting
        if(isInputLeftRight && isShooting){
          return "shooting";
        }

        //case..
        //moving l/r ... running
        if(isInputLeftRight){
          return "walk";
        }

        //case...
        //aiming up ... up
        if(aiming == 3){
          return "aimup";
        }

        //case...
        //input down ... duck
        if(input.down){
          return "duck";
        }

        //case...
        //stand still...isShooting
        if(isShooting){
          return "shooting";
        }

        //default...
        //return idle
        return "idle";
    };

    this.update_Sprite = function(toState, f) {

        if (this.player.renderable.isCurrentAnimation(toState)) {
            return false;
        }
        this.player.renderable.setCurrentAnimation(toState, f);
        return true;
    };

}
