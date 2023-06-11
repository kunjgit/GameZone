(function(root) {

var Entity = Class.extend({

    _body: null,
    _physics: null,
    _view: null,
    _canvas: null,

    _eventObj:null,

    init: function()
    {

    },

    destroy: function()
    {
        //PubSub.pub('destroyed', this);

        if ( this._group ) {
            this._group.splice( this._group.indexOf( this ), 1 );
        }
    },

    update: function()
    {
        if ( this._physics ) {
            this._physics.update();
        }
    },

    render: function()
    {
        if ( this._view ) {
            this._view.render();
        }
    },

    getTime: function(){
        var d = new Date();
        return d.getTime();
    },

    timeDiff: function(time){
        return this.getTime()-time;
    },


    // getters/setters
    // @TODO: try with EcmaScript 5 getters/setters
    getBody: function()
    {
        return this._body;
    },

    setBody: function(value)
    {
        this._body = value;
    },

    getPhysics: function()
    {
        return this._physics;
    },

    setPhysics: function(value)
    {
        this._physics = value;
    },

    getHealth: function()
    {
        return this._health;
    },

    getView: function()
    {
        return this._view;
    },

    setView: function(value)
    {
        this._view = value;
    },

});

root.HelicopterGame.Entity = Entity;

})(window);