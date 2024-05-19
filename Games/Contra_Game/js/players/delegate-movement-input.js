
function MovementInput(player){

    this.player = player;

    this.update = function (dt) {

        const input = this.player.input;

        //get acceleration changes of player for x-axis
        //apply change in X velocity
        const uX = input.left == 1 ? -1 : (input.right == 1 ? 1 : 0);
        this.player.body.vel.x = uX * this.player.body.accel.x * me.timer.tick;

        //if jump is pressed
        //and player is not currently in air
        //jump player up
        if(input.jump){ //&& !commons.playerUtils.isAirborne(this.player)){
          this.player.body.vel.y = -1 * 14 * this.player.body.maxVel.y * me.timer.tick;
          this.player.body.jumping = true;
        }
    }
}
