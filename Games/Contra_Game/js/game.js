
/* Game namespace */
var game = {

    onload : function () {
        if (!me.video.init(1280, 960, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.audio.init("mp3,ogg");
        me.sys.pauseOnBlur = false;
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    loaded : function () {

        this.texture = {};
        this.texture.badguys = new me.video.renderer.Texture(
            me.loader.getJSON("bad-guys"),
            me.loader.getImage("bad-guys")
        );
        this.texture.goodguys = new me.video.renderer.Texture(
            me.loader.getJSON("bill-lance"),
            me.loader.getImage("bill-lance")
        );


        game.constants.hydrate();

        me.pool.register("goodguy-bill", game.GoodGuyBill);
        me.pool.register("goodguy-server-npc", game.GoodGuyServerNpc);
        me.pool.register("badguy-red", game.BadguyRed);
        me.pool.register("badguy-runbot", game.BadguyRunbot);
        me.pool.register("bullet", game.Bullet);
        me.pool.register("platform", game.Platform);
        me.pool.register("powerup", game.Powerup);
        me.pool.register("explosion-1", game.Explosion1);

        me.state.set("state-splash", new game.ScreenSplash());
        me.state.set("state-multiplayer-play", new game.MultiplayerPlayScreen());
        me.state.set("state-multiplayer-join", new game.MultiplayerJoinScreen());
        me.state.set("state-test-play", new game.TestPlayScreen());

        me.state.transition("fade", "#CCCCCC", 250);
        me.state.change("state-splash");
    }
};

game.constants = {

    Server_url          :     "localhost",
    //Server_url          :     "50.112.50.11",

    Player_width        : 40,
    Player_height       : 40,
    Player_veloXmax     : 2,
    Player_veloYmax     : 13,
    Player_reloadtime   : 400,

    Bullet_radius   : 4,
    Bullet_diameter : 8,
    Bullet_velo     : 8,

    Player_spawnDuration : 75,
    Player_dyingDuration : 3500,
    Player_deadDuration : 100,
    Player_startlives : 8,

    Character_Bill : {name : "Bill", sprite_prefix : "Bill"},
    Character_Lance : {name : "Lance", sprite_prefix : "Lance"},

    Game_modes : [
        {title: "Survive", options : {}, toState : "state-test-play"},
        {title: "Multiplayer", options : {}, toState : "state-multiplayer-join"}
    ],

    hydrate : function(){

        this.font1 = new me.Font("Arial", 42, '#FFFFFF');
        this.font1.textAlign = "center";
    }
};
