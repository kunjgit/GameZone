game.ScreenSplash = me.ScreenObject.extend({

    onResetEvent : function () {

        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);
        this.selected = 0;

        var bg = new me.Sprite(0, 0, {image: me.loader.getImage('img_splashpage')});
        bg.anchorPoint.set(0, 0);
        bg.scale(me.game.viewport.width / bg.width, me.game.viewport.height / bg.height);
        me.game.world.addChild(bg, 1);

        this.optionsMenu = this.newOptionsMenu();
        me.game.world.addChild(this.optionsMenu, 2);

        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.DOWN, "down", true);
        me.input.bindKey(me.input.KEY.UP, "up", true);

        var that = this;
        this.handler = me.event.subscribe(me.event.KEYDOWN, (action, keycode, edge) => that.onInput(action));

        this.zoomer = new Zoomer();
        this.zoomer.enable();
    },

    onDestroyEvent : function () {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindPointer(me.input.pointer.LEFT);
        me.event.unsubscribe(this.handler);
    },

    onInput : function(action){

        switch (action) {

            case "enter" :
                me.audio.play("cling");
                me.state.change(game.constants.Game_modes[this.selected].toState);
                break;

            case "down" :
                if (this.selected < (game.constants.Game_modes.length - 1)) {
                    this.selected++;
                    this.optionsMenu.updateselected(this.selected);
                }
                break

            case "up" :
                if (this.selected > 0) {
                    this.selected--;
                    this.optionsMenu.updateselected(this.selected);
                }
                break
        }
    },
    newOptionsMenu : function (){

        var closure = {
            x :  me.game.viewport.width * .2,
            y :  (me.game.viewport.height / 2 ) * 1.1,
            w :  me.game.viewport.width * .3,
            h :  me.game.viewport.height / 2,
            selected : this.selected,
        };

        return new (me.Renderable.extend ({

            init : function () {
                this.selected = 0;

                this._super(me.Renderable, 'init', [closure.x, closure.y, closure.w, closure.h]);

                this.selIcon = new me.Sprite(0, 0, {image: me.loader.getImage('icon_select_30_25')});
                this.selIcon.anchorPoint.set(0, 0);
                me.game.world.addChild(this.selIcon, 5);

                this.iconX = this.pos.x;
                this.textX = this.iconX + this.selIcon.width * 1.5;
                this.centerX = this.pos.x + this.width / 2;
                this.incY  = 55;
                this.updateselected(closure.selected);
            },

            updateselected : function(sel){
                this.selected = sel;
                this.selIcon.pos.x = this.iconX;
                this.selIcon.pos.y = this.getYForOptionNumber(this.selected) + this.selIcon.height / 2;
            },
            update : function (dt) {
                return true;
            },

            draw : function (renderer) {

                game.constants.font1.textAlign = "left";
                game.constants.font1.draw(renderer, "PLAY SELECT", this.iconX, this.pos.y);

                for(var i = 0; i<game.constants.Game_modes.length; i++){
                    var opt = game.constants.Game_modes[i];
                    game.constants.font1.draw(renderer, opt.title, this.textX, this.getYForOptionNumber(i));
                }
            },

            getYForOptionNumber(optnbr){
                var startY = this.pos.y + this.incY * 1.5;
                return startY + (optnbr * this.incY);
            },

            onDestroyEvent : function () {
            }
        }));
    }
});