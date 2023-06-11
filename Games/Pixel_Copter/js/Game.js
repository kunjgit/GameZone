(function(root) {

var Game = Class.extend({

    // public properties
    entities: [],
    isPaused: false,
    that: this,
    counter:0,

    _map: null,
    _powerUps: null,
    _helicopter:null,

    // constructor
    init: function()
    {
        that = this;

        this.addMap();
        this.addPowerUps();
        this.addHelicopter();
        this._map.testCollision(this._helicopter);

        that.update();
        that.render();

        // @TODO: canvas, what goes here?
        // addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
    },

    loop: function()
    {


        that.update();
        that.render();
        requestAnimationFrame(that.loop);
    },



    update: function()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0, l = this.entities.length; i < l; i++) {
            this.entities[i].update();
        }

        if(this._map.isGameOver()){
            console.log('Game Over');
            this.endGame();
            that.isPaused = true;
        }


        if((this.counter%1000===0) && this.counter >1) this._powerUps.addFuelItem(this._map.lastYPos, this._map.lastHeight);

        if(this._helicopter.getBody().testCollision(this._powerUps)){
            this._powerUps.powerUpToken();
            //UI.fillupfuel;
            HelicopterGame.UI.displayFuel(false);
            console.log('powerUp taken');
        }

        if ( !that.isPaused ){
            HelicopterGame.UI.displayFuel(true);
            if(HelicopterGame.UI.getFuel()<1) this._helicopter.endFuel();
        }

        this.counter++;

    },

    render: function()
    {
        this.drawBackground();
        for (var i = 0, l = this.entities.length; i < l; i++) {
            this.entities[i].render();
        }
    },

    onAddedToStage: function()
    {
        // @TODO: canvas, what goes here?
    },

    startGame: function()
    {
        console.log('startGame');
        this.loop();

    },
    stopGame: function()
    {
        for (var i = 0, l = this.entities.length; i < l; i++) {
            var entView = this.entities[i].entity.getView();
            if ( entView) {
                // @TODO: what goes here for canvas?
                // removeChild( entView.sprite );
            }
        }
    },

    endGame: function(){
        if ( that.isPaused ) return;
        this._map.endGame();
        this._powerUps.endGame();
        this._helicopter.endGame();

        HelicopterGame.UI.showEnd();
    },

    addEntity: function(entity)
    {
        this.entities.push(entity);
        // @TODO: do we want to order by z-index here?
        /*
        entity.sub('destroyed', function(destroyedEntity) {
            this.onEntityDestroyed( destroyedEntity );
        });
*/

        if ( entity.getView() ) {
        }

        return entity;
    },

    onEntityDestroyed: function(entity)
    {
        this.entities.splice( entities.indexOf( entity ), 1 );

        if ( entity.getView() ) {
        }
    },

    drawBackground: function(){
        context.fillStyle = '#666666';
        context.fillRect(0,0,fullWidth,fullHeight);
    },

    addMap:function(){
        this._map = new HelicopterGame.Map();
        this.addEntity(this._map);

    },
    addPowerUps:function () {
        this._powerUps = new HelicopterGame.PowerUps();
        this.addEntity(this._powerUps);
    },
    addHelicopter: function(){
        //creating the player's ship
        this._helicopter = new HelicopterGame.Helicopter();
        this.addEntity(this._helicopter);

    }

});

root.HelicopterGame.Game = Game;

})(window);