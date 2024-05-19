function GameManager_Multiplayer(options) {

    /* -------------------------------------------
     * Set Up / Start game
     *-------------------------------------------*/
    options = options || {};
    this.url = options.url;
    this.playerName = options.playerName;
    this.onGameOver = options.onGameOver || (e => console.log("game over"));

    this.http = new commons.net.Http("http://" + this.url + "/");
    this.ws = new commons.net.Socket("ws://" + this.url + "/live");

    this.gjr = {};
    this.gameState = {gameId : 0,  fpu : {}, entities : {}};

    /* -------------------------------------------
     * Join ... search , hookup , respond
     *-------------------------------------------*/
    this.joinGame = function (onJoin) {

        const joinurl = "game/game-join/" + this.playerName;
        const source = this.http.getJSON(joinurl);

        const that = this;
        source.subscribe(
                response => {that.gjr = response; onJoin();},
                error => console.error(error),
                () => console.log('done')
        );
    };
    this.startGame = function() {

        var mpid = this.gjr.playerId;
        var team = this.gjr.team;
        var x = parseInt(this.gjr.posX);
        var y = parseInt(this.gjr.posY);
        var config = {mpid: mpid, team: team};

        var fpu = me.pool.pull("goodguy-bill", x, y, config);
        me.game.world.addChild(fpu);
        me.game.viewport.follow(fpu, me.game.viewport.AXIS.BOTH);

        this.gameState.fpu = fpu;
        this.gameState.entities[fpu.mpid] = fpu;

        var that = this;
        this.http.eventstream("game/game-events", e => that.handleEvents(e));
        this.ws.subscribe(m => that.handleUpdates(m));
    };



    /* -------------------------------------------
     * Post Activity
     *
     * player update message
     * "PU|GID|PID|PN|POSX|POSY|state.lc|direction|not used|state.aim"
     *
     * player hit and killed
     * "PH|GID|PID|BID|POSX|POSY"
     *
     * new bullet
     * "BN|GID|PID|TID|POSX|POSY|DIRX|DIRY"
     * -----------------------------------------*/
    this.postPlayerUpdate = function(player) {
        const lifecycle = commons.playerUtils.getLifecycleState(player);
        const input = commons.playerUtils.getCurrentInput(player);
        const aiming = commons.playerUtils.getAimDirection(player);
        const direction = player.flags.getFlag('direction') || 1;

        const msg = "PU" + "|"
            + this.gameState.gameId + "|"
            + player.mpid + "|" + player.pos.x + "|" + player.pos.y + "|"
            + lifecycle  + "|"
            + direction  + "|"
            + 'input' + "|"
            + aiming;

        this.ws.send(msg);
    };
    this.postBullet = function (player, fromX, fromY, dirX, dirY) {

        var msg = "BN" + "|"
            + this.gameState.gameId + "|"
            + player.mpid + "|"
            + player.team + "|"
            + fromX + "|" + fromY + "|"
            + dirX + "|" + dirY;

        this.ws.send(msg);
    };
    this.postBulletDamage = function (target, bullet) {

        var msg = "PH" + "|"
            + this.gameState.gameId + "|"
            + target.mpid + "|"
            + bullet.bid + "|"
            + target.pos.x + "|" + target.pos.y;

        this.ws.send(msg);
    };

    /*---------------------------------------
     * game state update
     *
     * will be a single string composed of entity update messages
     * message = "GSD~TS~MSG1~MSG2~...."
     *
     * TS = Timestamp milliseconds number
     *
     * player update
     * message = "KP|PID|TID|POSX|POSY|LIVES|SCORE|DIR|AIM|MOTION"
     *
     * -----------------------------------------*/
    this.handleUpdates = function(gamestateupdate) {

        var gamestateupdateString = gamestateupdate.data;
        var msgs = gamestateupdateString.split("~");

        for (i = 0; i < msgs.length; i++) {

            var msg = msgs[i];
            var msgArray = msg.split("|");
            var msgKey = msgArray[0];

            // Route message
            switch (msgKey) {

                case "KP":
                    this.handleUpdates_player(msgArray);
                    break;
            }
        }
    };
    this.handleUpdates_player = function(msg) {

        var mpid = msg[1];
        var team = msg[2];
        var x = parseInt(msg[3]);
        var y = parseInt(msg[4]);
        var lives = parseInt(msg[5]);
        var score = parseInt(msg[6]);

        if (mpid === this.gameState.fpu.mpid) {
            this.gameState.fpu.lives = lives;
            this.gameState.fpu.score = score;
            return;
        }

        var npc = this.gameState.entities[mpid];
        if (npc == null) {

            var config = {mpid: mpid, team: "R"};
            npc = me.pool.pull("goodguy-server-npc", x, y, config);
            me.game.world.addChild(npc);
            this.gameState.entities[mpid] = npc;
        }
        npc.applyServerCommands(msg);
    };

    /*---------------------------------------
     * game critical events
     *
     * will be a single event message
     * message = "GSD~TS~MSG1"
     *
     * TS = Timestamp milliseconds number
     *
     * player killed
     * message =  "GCU~TS~KPK|PID|BID|SHOOTER-ID"
     *
     * player removed
     * message =  "PR~TS~KPR|PID"
     *
     * bullet shot
     * message = "GCU~TS~KBN|BID|PID|TID|POSX|POSY|DIRX|DIRY"
     * -----------------------------------------*/
    this.handleEvents = function(gameEvent) {

        var pieces = gameEvent.data.split("~");
        var event = pieces[2] || "U";
        var eventA = event.split("|");
        var eventKey = eventA[0];

        // Route message
        switch (eventKey) {
            case "KPK" :
                this.handleEvent_playerKilled(eventA);
                break;
            case "KBN" :
                this.handleEvent_newbullet(eventA);
                break;
            case "KPR" :
                this.handleEvent_playerRemoved(eventA);
                break;
        }
    };
    this.handleEvent_playerRemoved = function(event) {

        const pid = event[1];

        if(pid == this.gameState.fpu.mpid){
            this.onGameOver(this.gameState);
            return;
        }

        const npc = this.gameState.entities[pid];
        if(npc) npc.applyServerRemoveCommand();
    }
    this.handleEvent_playerKilled = function(event) {

        const pid = event[1];
        const bid = event[2];
        const sid = event[3];

        const player = this.gameState.entities[pid]
        const bullet = this.gameState.entities[bid];

        if(player != null){
            player.processDeath(bullet);
        }
        if(bullet != null) bullet.removeIt();
        commons.game.effect_PlayerBulletKill(player, bullet);
    };

    this.handleEvent_newbullet = function(event) {

        var bid = event[1];
        var pid = event[2];
        var team = event[3];
        var fromX = parseInt(event[4]);
        var fromY = parseInt(event[5]);
        var dirX = parseInt(event[6]);
        var dirY = parseInt(event[7]);

        var bullet = this.gameState.entities[bid];

        if(bullet != null) {
            return;
        }

        var config = {
            bid: bid,
            pid: pid,
            team: team,
            dirX: dirX,
            dirY: dirY
        };

        bullet = me.pool.pull("bullet", fromX, fromY, config);
        me.game.world.addChild(bullet, 20);
        this.gameState.entities[bid] = bullet;
    };
}
