function AI_ServerCommands(player){

    /*--------------------------------
    * Input to Track
    *--------------------------------*/
    this.player = player;

    /*--------------------------------
    * Construct
    *--------------------------------*/
    this.getInput = function(dt, serverCommands){

      //set up...
      //parse server commands
      const serverX = parseInt(serverCommands[3]);
      const serverY = parseInt(serverCommands[4]);
      //const serverAction = parseInt(serverCommands[8]);
      const serverAiming = parseInt(serverCommands[9]);

      //step...
      //build the input
      const input = new PlayerInput();

      const dx = serverX - this.player.pos.x;    //if > 0 ... need to go right
      const dy = this.player.pos.y - serverY;    //if > 0 ... need to jump

      input.jump     = dy > 0 ? 1 : 0;
      input.left     = dx < 0 ? 1 : 0;
      input.right    = dx > 0 ? 1 : 0;
      input.up       = 0;
      input.down     = 0;
      input.shooting = 0;

      //set direction flag
      if(input.left) this.player.flags.setFlag('direction', -1);
      if(input.right) this.player.flags.setFlag('direction', 1);

      //finally...
      //return the input
      console.log('server commands : ' + serverX + ' : ' + this.player.mpid + ' : ' + input.left + ' : ' + dx);
      return input;
    };
}
