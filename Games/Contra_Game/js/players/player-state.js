
/* ----------------------------------------
 * Players have a pretty finite set of states
 * and can be described across a couple parameters
 *
 * state ->      0 = spawning
 *               1 = alive
 *               2 = dying
 *               3 = dead
 * -------------------------------------------------*/

function PlayerLifeState(player){

    this.player = player;
    this.state = 0;
    this.stateTimer = 0;

    /*--------------------------------
     * Send Change Requests
     *--------------------------------*/
    this.setState = function(state, forceTime){
        this.state = state;
        this.stateTimer = 0;
    };

    /*--------------------------------
     * Update state per timer as appropriate
     *--------------------------------*/
    this.update = function(dt){

        this.stateTimer += dt;

        if(this.state == 0 && (this.stateTimer > game.constants.Player_spawnDuration)){
            this.state = 1;
            this.stateTimer = 0;
        }
        else if(this.state == 2 && (this.stateTimer > game.constants.Player_dyingDuration)){
            this.state = 3;
            this.stateTimer = 0;
        }
        else if(this.state == 3 && (this.stateTimer > game.constants.Player_deadDuration)){
            this.state = 0;
            this.stateTimer = 0;
        }
    }
}
