var GameCtrl = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check GameCtrl.orientated in internal loops to know if it should pause or not */
    orientated: false

};

(function(){
'use strict';

GameCtrl.Boot = function () {
};

GameCtrl.Boot.prototype = {

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('starsmenu', 'assets/images/stars.png');
        this.load.image('preloaderBackground', 'assets/images/progress_bar_background.png');
        this.load.image('preloaderBar', 'assets/images/progress_bar.png');

        this.load.spritesheet('clown', 'assets/images/CircusCharlieSheet1.gif',16,24,10);
        

    },

    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.scale.minWidth = 480;
        this.game.scale.minHeight = 260;
        this.game.scale.maxWidth = 1024;
        this.game.scale.maxHeight = 768;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.setScreenSize(true);
        this.game.state.start('Preloader');

    },

    gameResized: function () {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.

    },

    enterIncorrectOrientation: function () {

/*        GameCtrl.orientated = false;

        document.getElementById('orientation').style.display = 'block';
*/
    },

    leaveIncorrectOrientation: function () {
/*
        GameCtrl.orientated = true;

        document.getElementById('orientation').style.display = 'none';
*/
    }

};

})();