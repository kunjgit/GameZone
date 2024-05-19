game.MultiplayerPlayScreen = me.ScreenObject.extend({

    onResetEvent: function(args) {

        me.levelDirector.loadLevel("contra-lvl-1");

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");

        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.D,     "shoot");
        me.input.bindKey(me.input.KEY.F,     "shoot");

        game.manager = args.mpg;
        game.manager.startGame();
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    onDestroyEvent: function() {

        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindKey(me.input.KEY.DOWN);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.game.world.removeChild(this.HUD);
    }
});
