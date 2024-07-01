(function(root) {

    var Game = (function()
    {
        var _canvas,
            canvas,
            _toUpdate = [],
            _toDraw = [],
            _ended = false;

        // game logic
        var _maxFlowers = 15,
            _createNewFlowerTimer = null,
            _startTime = null;

        // game objects
        var _bird = null;

        // background visuals
        var _sunGradient = null;

        var _useCanvas = function(id)
        {
            _canvas = document.getElementById(id);
            
            canvas = {
                context : _canvas.getContext('2d'),
                width : _canvas.width,
                height : _canvas.height
            };

            _sunGradient = canvas.context.createRadialGradient(140, 140, 20, 100, 100, 100);
            _sunGradient.addColorStop(0, 'rgba(240,217,19,1)');
            _sunGradient.addColorStop(0.98, 'rgba(240,196,19,.9)');
            _sunGradient.addColorStop(1, 'rgba(240,196,19,0)');

            root.Canvas = Game.getCanvas();
        };

        var _renderLoop = function(once)
        {
            if ( _ended ) return;

            // request a new frame
            requestAnimFrame(_renderLoop);

            // if we only want to run the render loop once
            if ( once === true ) _ended = true;

            // logic to be calculated on every frame
            _logic();

            // render everything
            _updateAll();
            _drawAll();
        };

        var _logic = function()
        {
            // keyboard events
            if (Key.isDown(Key.LEFT)) _bird.left();
            if (Key.isDown(Key.RIGHT)) _bird.right();
            if (Key.isPreserved(Key.SPACE)) _bird.flap();

            if ( _createNewFlowerTimer === null ) {
                _createNewFlowerTimer = setTimeout(function() {
                    clearTimeout(_createNewFlowerTimer);
                    _createNewFlowerTimer = null;

                    // only a create a flower one in three times
                    if ( root.Utils.getRandomInt(1, 3) !== 1 ) return;

                    if ( root.Flower.flowers.length < _maxFlowers ) {
                        var newFlower = new root.Flower();

                        addToUpdate(newFlower);
                        addToDraw(newFlower);
                    }
                }, root.Utils.getRandomInt(200, 1000));
            }

        };

        var _updateAll = function()
        {
            for (var i = 0, l = _toUpdate.length; i < l; i++) {
                var updateItem = _toUpdate[i];
                
                if ( updateItem === null || typeof updateItem === 'undefined' ) continue;

                updateItem.update();
            }
        };

        var _drawAll = function()
        {
            var ctx = canvas.context;

            // clear screen
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // draw the sun
            // smaller sun "shadow"
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'rgba(225,157,12,.5)';
            ctx.arc(105, 105, 100, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();

            // large gradient sun
            ctx.save();
            ctx.fillStyle = _sunGradient;
            ctx.fillRect(0, 0, 300, 300);
            ctx.restore();

            // draw everything else
            for (var i = 0, l = _toDraw.length; i < l; i++) {
                var drawItem = _toDraw[i];

                if ( drawItem === null || typeof drawItem === 'undefined' ) continue;

                drawItem.draw();
            }
        };

        var _bindEvents = function()
        {
            // keyboard events for game control
            window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
            window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        };

        var addToUpdate = function(obj)
        {
            _toUpdate.push(obj);
            // no need to sort by z-index, don't really care who's updated first
        };

        var removeFromUpdate = function(obj)
        {
            if ( !root.Utils.removeObjFromArray( _toUpdate, obj ) ) {
                throw new Error('Failed to remove an object from the _toUpdate array.');
            }
        };

        var addToDraw = function(obj)
        {
            _toDraw.push(obj);
            // sort the draw array by the zIndex to allow for proper layering
            _toDraw.sort(root.Utils.sortByZIndex);
        };

        var removeFromDraw = function(obj)
        {
            if ( !root.Utils.removeObjFromArray( _toDraw, obj ) ) {
                throw new Error('Failed to remove an object from the _toDraw array.');
            }
        };

        var getCanvas = function()
        {
            return canvas;
        };

        var init = function(justCanvas) {
            _useCanvas('stage');

            _bindEvents();

            _bird = new root.Bird();
            addToUpdate(_bird);
            addToDraw(_bird);
            // shoot the bird up into the air!
            _bird.setPos({ x: 300, y: canvas.height });
            _bird.yAccel = -4;

            root.UI.showIntro();
        };

        var start = function(once)
        {
            once = once || false;
            _ended = false;

            _renderLoop(once);

            _startTime = new Date().getTime();
        };

        var end = function()
        {
            var time = root.Utils.secondsToTime( ( new Date().getTime() - _startTime ) / 1000 );

            _ended = true;

            root.UI.showEnd({
                time: time,
                weight: _bird.weight
            });
        };

        return {
            init: init,
            start: start,
            end: end,
            removeFromDraw: removeFromDraw,
            removeFromUpdate: removeFromUpdate,
            getCanvas: getCanvas
        };
    })();

    root.Game = Game;

})(window);

var Key = {
    _pressed: {},
    _preserved: {},

    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    isPreserved: function(keyCode) {
        if ( typeof this._preserved[keyCode] !== 'undefined' ) {
            delete this._preserved[keyCode];
            return true;
        }

        return false;
    },

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        // we always want to know if this was pressed, even if it is no longer pressed when we check
        // we do this by adding it to a preserved list that is not cleared on keyup
        if ( event.keyCode === Key.SPACE ) {
            this._preserved[event.keyCode] = true;
        }

        delete this._pressed[event.keyCode];
    }
};