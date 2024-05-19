game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        this._super(me.Container, 'init');
        this.isPersistent = false;
        this.floating = true;
        this.name = "HUD";

        this.addChild(new game.HUD.fpuInfo(25, 25));
    }
});


game.HUD.fpuInfo = me.Renderable.extend({

    init: function(x, y) {
        this.badge_icon = me.loader.getImage('icon_badge_24_48');
        this._super(me.Renderable, 'init', [x, y, 185, 130]);
        this.lives = 3;
        this.score = 0;
    },

    update : function () {

        var fpu = game.manager.gameState.fpu || null;
        
        if(fpu == null){
            return false;
        }

        if (this.lives !== fpu.lives || this.score !== fpu.score) {
            this.lives = fpu.lives;
            this.score = fpu.score;
            return true;
        }
        return false;
    },


    draw : function (renderer) {

        var color = renderer.getColor();

        renderer.setColor('#000000');
        renderer.setGlobalAlpha(.85);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        renderer.setGlobalAlpha(1);
        renderer.setColor('#FFFFFF');
        renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);

        renderer.setColor(color);

        var imgX = this.pos.x + 15;
        var imgY = this.pos.y + 11;
        for(var i = 0; i<this.lives; i++){
            renderer.drawImage(this.badge_icon, imgX, imgY);
            imgX += this.badge_icon.width + 16;
        }

        game.constants.font1.draw(renderer, this.score, this.pos.x + 15, imgY + this.badge_icon.height + 11);
    }

});
