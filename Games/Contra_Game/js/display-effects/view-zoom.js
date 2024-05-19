function Zoomer(inkey, outkey, delta){

    /* -------------------------------------------
     * Set up / enable / disable
     *-------------------------------------------*/
    this.inkey = inkey || me.input.KEY.Z;
    this.outkey = outkey || me.input.KEY.X;

    this.delta = delta || .02;


    this.enable = function() {

        if(this.listener) return;

        me.input.bindKey(this.inkey, "zoomer-in", true);
        me.input.bindKey(this.outkey, "zoomer-out", true);
        me.input.bindKey(me.input.KEY.Q, "zoomer-reset", true);

        var that = this;

        this.listener = me.event.subscribe(me.event.KEYDOWN,
            (action, keycode, edge) => {
                if (action === "zoomer-in") this.doViewportZoom(1 + this.delta);
                if (action === "zoomer-out")this.doViewportZoom(1 - this.delta);
                if (action === "zoomer-reset")this.doZoomReset();
            }
        );
    };
    this.disable = function(){

        if(!this.listener) return;

        me.input.unbindKey(this.inkey);
        me.input.unbindKey(this.outkey);
        me.event.unsubscribe(this.listener);
        this.listener = null;
    };


    /* -------------------------------------------
     * Zoom Functions
     *-------------------------------------------*/
    this.doViewportZoom = function(delta){

        var viewport = me.game.viewport;
        viewport.currentTransform.translate(
            viewport.width * viewport.anchorPoint.x,
            viewport.height * viewport.anchorPoint.y
        );

        viewport.currentTransform.scale(delta);

        viewport.currentTransform.translate(
            -viewport.width * viewport.anchorPoint.x,
            -viewport.height * viewport.anchorPoint.y
        );

        me.game.viewport.follow(game.manager.gameState.fpu, me.game.viewport.AXIS.BOTH);
    };
    this.doZoomReset = function(){

        me.game.viewport.currentTransform.identity();
    }
}