
function Display_BadGuyRed(player, spriteName){

    /*--------------------------------
    * Vars
    *--------------------------------*/
    this.player = player;
    var sn = spriteName || "BadGuys";

    var animationmap = [
        {name : "horiz",    frames : [2, 3]},
        {name : "up",       frames : [4, 5]},
        {name : "down",     frames : [1]},
    ];

    this.player.renderable = commons.me.textureSpriteHelper(game.texture.badguys, sn, animationmap);
    this.player.renderable.setCurrentAnimation('horiz');

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

        const aiming = commons.playerUtils.getAimDirection(this.player);

        //aim up
        if(aiming == 2 || aiming == 3){
          return 'up';
        }
        //aim down
        if(aiming == 4 || aiming == 5){
          return 'down'
        }
        //else horiz
        return 'horiz';
    };
    this.update_Sprite = function(toState) {
        if (!this.player.renderable.isCurrentAnimation(toState)) {
            this.player.renderable.setCurrentAnimation(toState);
        }
    };
}


function Display_BadGuyRunbot(player, spriteName) {

    /*--------------------------------
    * Vars
    *--------------------------------*/
    this.player = player;
    var sn = spriteName || "BadGuys";

    var animationmap = [
        {name: "run", frames: [17, 18, 19, 20, 21, 22]},
    ];

    this.player.renderable = commons.me.textureSpriteHelper(game.texture.badguys, sn, animationmap);
    this.player.renderable.setCurrentAnimation('run');

    this.update = function (dt) {
      //update face direction
      const direction = player.flags.getFlag('direction') || 1;
      (direction == -1) ? this.player.renderable.flipX(true) : this.player.renderable.flipX(false);
    }
}
