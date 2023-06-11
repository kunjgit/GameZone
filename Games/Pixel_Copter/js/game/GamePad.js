(function(root) {

var GamePad = Class.extend({

    keys: {},

    // constructor
    init: function()
    {
        console.log("GamePad.init()");
    },

    checkInput: function()
    {
        for(var i in that.keys) {

            if (that.keys[i] === 2) {
                that.keys[i] = 0;
            }
           //console.log(i+ " :: "+that.keys[i]);
        }
        this.keys = {
            SPACE: {keyCode:32, keyPressed:0},
            ENTER: {keyCode:13, keyPressed:0},
            RIGHT: {keyCode:39, keyPressed:0},
            LEFT: {keyCode:37, keyPressed:0}
        }
        for(var i in this.keys) {
            this.keys[i].keyPressed = that.keys[this.keys[i].keyCode];
        }
    },
    isKeyPressed: function(key){
        return this.keys[key].keyPressed;
    }

});

 // Input
var that = this;
this.keys = {};


// This is for the mobile touch // if the user touches the screen it will simulate like the space bar has been pressed and the same like releasing the space bar with touchend;
window.addEventListener('touchstart', function(event) {
    that.keys[32] = 1;
}, false);
window.addEventListener('touchend', function(event) {
    that.keys[32] = 0;
}, false);


// THis is for the desktop keypads
window.onkeydown = window.onkeyup = function(e) {

    var key = e.keyCode;
    if (key !== 116 && !e.shiftKey && !e.altKey && !e.ctrlKey) {
        if (e.type === "keydown") {
            that.keys[key] = 1;
        } else {
            that.keys[key] = 0;
        }
        if (that.playing) {
             e.preventDefault();
            return false;
        }
    }

};

// static var
root.HelicopterGame.GamePad = GamePad;

})(window);