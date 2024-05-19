function GameManager_LocalTest(options) {

    this.id = 1000;
    this.gameState = {gameId : 0,  fpu : {}, entities : {}};

    /* -------------------------------------------
     * Set Up / Start game
     *-------------------------------------------*/
    this.startGame = function (options, onStart, onGameOver) {

        this.onGameOver = onGameOver;
        this.gameState.gameId = this.id++;

        var fpu = me.pool.pull("goodguy-bill", 50, 220, {mpid: this.id++, team: "B", character : game.constants.Character_Lance});
        me.game.world.addChild(fpu);
        me.game.viewport.follow(fpu, me.game.viewport.AXIS.BOTH);
        this.gameState.fpu = fpu;
        this.gameState.entities[fpu.mpid] = fpu;
        onStart(this.gameState);

        this.spawner = new Random_Spawner();
        me.game.world.addChild(this.spawner);
        this.spawner.addBadGuyRed();
        this.spawner.addPowerUp();
    };
    this.buildPathGraph = function(){

        var options = {
            standables : me.game.world.getChildByType(game.Platform),
            g : 0.98,
            jumpVel : game.constants.Player_veloYmax,
            xVel : game.constants.Player_veloXmax
        };
        game.pathgraph = new rb.paths.PathGraph(options);
        game.pathgraph.buildGraph();
        var pathHL = new HL_PATHGRAPH();
        pathHL.show(game.pathgraph);
    };


    /* -------------------------------------------
     * Lifecycle
     *-------------------------------------------*/
    this.onUpdate = function () {
    };

    this.onDestroy = function () {
        if (this.spawner){
            this.spawner.stop();
            me.game.world.removeChild(this.spawner);
        }
    };


    /* -------------------------------------------
     * Post Activity
     *-------------------------------------------*/
    this.postBullet = function (player, fromX, fromY, dirX, dirY) {

        var config = {
            bid: this.id++,
            pid: player.mpid,
            team: player.team,
            dirX: dirX,
            dirY: dirY
        };

        var bullet = me.pool.pull("bullet", fromX, fromY, config);
        me.game.world.addChild(bullet, 20);
        this.gameState.entities[config.bid] = bullet;
    };

    this.postBulletDamage = function (target, bullet) {
        var chartype = target.chartype || "BadGuy";

        if(chartype == "BadGuy") {
          this.gameState.fpu.score++;
          this.spawner.heatup();
          bullet.onTargetHit(target);
        }
        if(chartype == "GoodGuy") {
          bullet.onTargetHit(target);
        }
    }
    this.postPlayerUpdate = function (player) {
    };
}
