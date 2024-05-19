

function GameManager() {

    /* -------------------------------------------
     * Set Up / Start game
     *-------------------------------------------*/
    this.gameState = {gameId : 0,  fpu : {}, entities : {}};

    this.startGame = function (options, onStart) {
    };

    /* -------------------------------------------
     * Lifecycle
     *-------------------------------------------*/
    this.onUpdate = function(){
    };

    this.onDestroy = function() {
    };


    /* -------------------------------------------
     * Post Activity
     *-------------------------------------------*/
    this.postPlayerUpdate = function(player){
    };
    this.postBullet = function (playerId, team, fromX, fromY, velX, velY) {
    };
    this.postBulletDamage = function (target, bullet) {
    };
};
