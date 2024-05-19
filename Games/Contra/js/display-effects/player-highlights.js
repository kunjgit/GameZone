

var HL_PlayerWithReload = me.Renderable.extend({

    init : function (target){

        this.target = target;
        this.teamColor = commons.game.getColorForTeam(target.team);
        this._super(me.Renderable, "init", [target.pos.x, target.pos.y, target.width, target.height]);
    },

    show : function () {
        if (!this.visible) {
            me.game.world.addChild(this, 4);
            this.visible = true;
            me.game.repaint();
        }
    },
    hide : function () {
        if (this.visible) {
            me.game.world.removeChild(this, true);
            this.visible = false;
            me.game.repaint();
        }
    },
    destroy : function () {},

    draw : function (renderer) {

        //step 1..
        //figure out draw vars
        const reloadPerc = commons.playerUtils.getGunReloadPercent(this.target) || 0;
        const arcRad = 6.28 * reloadPerc;

        const center = commons.playerUtils.getCenterPosition(this.target) || [0,0];
        const posX = this.target.pos.x;
        const posY = center[1] - .5 * this.target.height;

        const color = renderer.getColor();


        //step 2...
        //do circle render
        renderer.setGlobalAlpha(.4);
        renderer.setColor(this.teamColor);
        renderer.fillArc(posX, posY, this.target.width/2, 0, 6.28);

        renderer.setGlobalAlpha(1);
        renderer.setColor('#FFFFFF');
        renderer.strokeArc(posX, posY, this.target.width/2, 0, arcRad);

        renderer.setGlobalAlpha(1);
        renderer.setColor(color);
    },

    update : function (time) {
        return this.visible;
    }
});
