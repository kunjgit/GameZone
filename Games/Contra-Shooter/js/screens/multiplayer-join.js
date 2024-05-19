game.MultiplayerJoinScreen = me.ScreenObject.extend({

    /* -------------------------------------------
     * Lifecycle
     *-------------------------------------------*/
    onResetEvent : function () {

        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

        this.startState_1();
    },
    onDestroyEvent : function () {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler_state1);
    },


    /* -------------------------------------------
     * State 1 -> get user name
     *-------------------------------------------*/
    startState_1: function() {

        this.htmlspace = new game.HtmlSpace(2);
        new game.HtmlHeader3(this.htmlspace.$htmlspace, "Contra Multiplayer");
        this.input = new game.HtmlTextInput(this.htmlspace.$htmlspace, "name", "text", 12);

        var that = this;
        this.handler_state1 = me.event.subscribe(me.event.KEYDOWN,
            (action, keycode, edge) => action == "enter" && that.doState_1());
    },
    doState_1: function() {

        var nameVal = this.input.getInputValue() || "bob";

        game.constants.playerName = nameVal;
        me.event.unsubscribe(this.handler_state1);
        this.input.destroy();
        this.startState_2();
    },

    /* -------------------------------------------
     * State 2 -> Set up loading, and trial level
     *-------------------------------------------*/
    startState_2 : function() {
        this.doState_2();
    },
    doState_2 : function(){
        this.startState_3();
    },


    /* -------------------------------------------
     * State 3 -> Try to find a game
     *-------------------------------------------*/
    startState_3 : function() {

        var options = {
                url : game.constants.Server_url,
                playerName : game.constants.playerName,
                onGameOver : (e)  => me.state.change("state-splash"),
            };

        this.mpg = new GameManager_Multiplayer(options);
        var that = this;
        this.mpg.joinGame(() => that.finishState_3());
    },
    finishState_3 : function(){

        this.htmlspace.destroy();
        me.state.change("state-multiplayer-play", {mpg : this.mpg});
    }
});
