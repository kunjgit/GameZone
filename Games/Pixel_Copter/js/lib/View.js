(function(root) {

    var View = HelicopterGame.BaseView.extend({

    // public properties
    scale: 1,
    a: 0,
    sprite: null,

    // constructor
    init: function()
    {

    },

    render: function()
    {
        //@TODO: Think about if we should render the our entities inside here instead of rendering inside them?
    }

});

root.HelicopterGame.View = View;

})(window);