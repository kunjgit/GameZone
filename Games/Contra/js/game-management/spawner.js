function Random_Spawner() {

    this.gameState = game.manager.gameState;
    this.id = 10;

    this.nbrSpawns = 0;
    this.lastSpawn = 0;
    this.nextSpawn = -1;

    this.heat = 0;
    this.ratemin = 1400;
    this.ratemax = 4000;

    this.spawnon = true;

    this.platforms = me.game.world.getChildByType(game.Platform);

    var r = me.game.viewport.width - 2;
    var m = Math.floor(r / 2);
    this.robotspawns = [
        [2, 0], [2, 80], [2, 120],
        [m, 0], [m + 17, 75],
        [r, 5], [r, 60], [r, 175]]

    this.update = function (dt) {

        if (!this.spawnon) return;

        this.lastSpawn += dt;
        if (this.nbrSpawns == 0 && this.lastSpawn < 4000) return;
        if (this.lastSpawn < this.nextSpawn) return;

        this.lastSpawn = 0;
        this.nextSpawn = commons.calc.randomInt(this.ratemin, this.ratemax);
        this.spawnOne();
    };
    this.heatup = function () {

        this.nextSpawn -= 1000;
        this.ratemin--;
        this.ratemax--;

        if (this.heat % 5 == 1) {
            this.spawnOne()
            this.ratemax -= 2;
        }
    };
    this.spawnOne = function () {
        this.nbrSpawns % 5 == 1 ? this.addBadGuyRed() : this.addBadGuyRunbot();
        this.nbrSpawns++;
    };

    this.addPowerUp = function(){

        var powerUp = me.pool.pull("powerup", 0, 334);
        me.game.world.addChild(powerUp, 18);
    };
    this.addBadGuyRed = function(){

        var spawnnbr = commons.calc.randomInt(0, this.platforms.length-1);
        var spawnOn = this.platforms[spawnnbr];
        var posX = commons.calc.randomInt(spawnOn.pos.x , spawnOn.pos.x + spawnOn.width);
        var badGuy = me.pool.pull("badguy-red", posX, spawnOn.pos.y, {mpid: this.id++});
        me.game.world.addChild(badGuy, 12);
        this.gameState.entities[badGuy.mpid] = badGuy;
    };
    this.addBadGuyRunbot = function(){

        var spawnnbr = commons.calc.randomInt(0, this.robotspawns.length-1);
        var spawnpos = this.robotspawns[spawnnbr];

        var badGuy = me.pool.pull("badguy-runbot", spawnpos[0], spawnpos[1], {mpid: this.id++});
        me.game.world.addChild(badGuy, 12);
        this.gameState.entities[badGuy.mpid] = badGuy;
    };
    this.stop = function(){

    }
};
