

var HL_PATHGRAPH = me.Renderable.extend({

    init : function (){
        this._super(me.Renderable, "init", [0, 0, 500, 600]);
    },

    show : function (pathGraph) {

        this.pathGraph = pathGraph;

        if (!this.visible) {
            me.game.world.addChild(this, 4);
            this.visible = true;
            me.game.repaint();
        }
    },
    hide : function () {

        this.pathGraph = null;

        if (this.visible) {
            me.game.world.removeChild(this, true);
            this.visible = false;
            me.game.repaint();
        }
    },
    destroy : function () {},

    draw : function (renderer) {

        var color = renderer.getColor();
        renderer.setColor("#FFFF00");

        for(var surfkey in this.pathGraph.surfaces){
            this.pathGraph.surfaces[surfkey].connections.forEach(con => {
                renderer.strokeLine(con.fromX, con.fromY, con.toX, con.toY);
            });
        }
        renderer.setColor(color);
    },

    update : function (time) {
        return this.visible;
    }
});

var HL_PlayerStateInfo = me.Renderable.extend({

    init : function (target){

        this.target = target;

        this._super(me.Renderable, "init", [target.pos.x, target.pos.y, target.width, target.height]);
        this.alwaysUpdate = true;
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

        var color = renderer.getColor();

        renderer.setGlobalAlpha(.4);
        renderer.setColor('#00FF00');
        renderer.setGlobalAlpha(1);
        renderer.strokeRect(this.target.pos.x, this.target.pos.y, this.target.width, this.target.height);

        var fireValues = this.target.playerState.calcBarrelPosition()
        renderer.setColor('#FF0000');
        renderer.fillArc(fireValues[0]-2, fireValues[1]-2, 4, 0, 6.29);

        var center = this.target.playerState.calcCenterPosition();
        renderer.setColor('#0000FF');
        renderer.fillArc(center[0]-2, center[1]-2, 4, 0, 6.29);

        renderer.setGlobalAlpha(1);
        renderer.setColor(color);
    },

    update : function (time) {
        return this.visible;
    }
});