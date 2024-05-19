
function AIRunner(npc, options){

    /*--------------------------------
    * Vars
    *--------------------------------*/
    options = options || {},
    this.npc = npc;
    this.input = new PlayerInput();

    this.direction = this.npc.pos.x < (me.game.viewport.width / 2) ? 1 : -1;
    this.input.left = this.direction < 0 ? 1 : 0;
    this.input.right = this.direction > 0 ? 1 : 0;

    /*--------------------------------
    * Get Input from AI
    *--------------------------------*/
    this.getInput = function(dt){
      this.npc.flags.setFlag('direction', this.direction);
      return this.input;
    }
}

function AISniper(npc, options){

    /*--------------------------------
    * Vars
    *--------------------------------*/
    options = options || {},
    this.npc = npc;
    this.target = options.target || game.manager.gameState.fpu;
    this.input = new PlayerInput();

    this.waitToFire = 1000;
    this.waitDt = 0;
    this.fireSeq = 0;

    /*--------------------------------
    * Get Input from AI
    *--------------------------------*/
    this.getInput = function(dt){
      if(!this.target) return;

      this.input.clear();
      this.getInput_directions(dt);
      return this.input.clone();
    };

    this.getInput_directions = function(dt){

      const dx =  commons.calc.dxToThing(this.npc, this.target);
      const dy =  commons.calc.upOrDownToThing(this.npc, this.target);

      if(dx > 0){
        this.input.right = 1;
        this.npc.flags.setFlag('direction', 1);
      }
      else if(dx < 0){
        this.input.left = 1;
        this.npc.flags.setFlag('direction', -1);
      }

      if(dy < this.npc.height){
        //this.input.up = 1;
      }
      else if(dy > this.npc.height){
        //this.input.down = 1;
      }
    };
}
