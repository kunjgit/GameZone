function AI_UserInput(player){

    /*--------------------------------
    * Input to Track
    *--------------------------------*/
    this.player = player;

    /*--------------------------------
    * Get Input
    *--------------------------------*/
    this.getInput = function(){

      //read input from user controls
      const input = new PlayerInput();
      input.jump     = me.input.isKeyPressed('jump') ? 1 : 0;
      input.left     = me.input.isKeyPressed('left') ? 1 : 0;
      input.right    = me.input.isKeyPressed('right') ? 1 : 0;
      input.up       = me.input.isKeyPressed('up') ? 1 : 0;
      input.down     = me.input.isKeyPressed('down') ? 1 : 0;
      input.shooting = me.input.isKeyPressed('shoot') ? 1 : 0;

      //set direction flag
      if(input.left) this.player.flags.setFlag('direction', -1);
      if(input.right) this.player.flags.setFlag('direction', 1);

      //return ai results as input
      return input;
    };
}
