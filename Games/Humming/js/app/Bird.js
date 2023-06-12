(function(root) {

    var Bird = function()
    {
        // engine logic
        //
        this.id = root.Utils.getGuid();
        this.zIndex = 9999;

        // flower logic
        //
        this.width = this.originalWidth = 80;
        this.height = this.originalHeight = 80;
        this.sprite = new Image();
        this.sprite.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAABQCAMAAAAQlwhOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMEQ3NzYyRDk1RkNFMTExOTdCOUNCMjM5MkMwQ0Y3OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NzdFMDI4OUZDQTcxMUUxQTVEOUNFRkRCQUMwQTdCMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzdFMDI4OEZDQTcxMUUxQTVEOUNFRkRCQUMwQTdCMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFOUE2RTQzOUJGQ0UxMTE5N0I5Q0IyMzkyQzBDRjc4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIwRDc3NjJEOTVGQ0UxMTE5N0I5Q0IyMzkyQzBDRjc4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Kc9JJwAAAB5QTFRFOzs7is0jQkJCALT/Pj4+MzMzc68VfLobgcAfAAAAJ8LRrQAAAAp0Uk5T////////////ALLMLM8AAADOSURBVHja7NbLDsIgFEXR+mrr//+wyWVCQkrBgUG69og08ciaVJf3xVqAgYGBgYGBgYGBgYGBgYGBgScF36I9ys+p/q8ZZw8YGBj4v8Fr9IjSx/PzetDZBVv2esD1PWBgYOAZwUvRK9qi/LW/ZVWmG/bSuY3dsgcMDAw8Lzgvv85e1P9n/1d7wMDAwFcCl539FNUvOMIeMDAw8Azg1DMqn3x7zRH2gIGBgecB36P6k55G2AMGBgaeBzxjwMDAwMDAwMDAwMDAwMDAF+gjwADrSXDr2PaazQAAAABJRU5ErkJggg==";
        this.frames = 3;
        this.curFrame = 0;
        this.frameLimiter = 2; // new animation frame every this many ticks

        // affects how fast the bird falls
        this.weight = 2;
        // affects how much the bird rises when he flaps his tiny wings
        this.lift = 0.2;
        // affects his left/right movement speed
        this.speed = 1.5;
        // how much nectar birdy eats!
        this.hunger = 2;
        // how much energy birdy has to flap
        this.energy = 100;

        this.x = 0;
        this.y = 0;
        this.xAccel = 0;
        this.yAccel = 0.02;
        // the bird has a limit to it's upward movement
        this.maxYUpAccel = 2.5;

        // game logic
        this.flower = null;
        this.flowerSippingTimer = null;
        this.flowerTargetTimer = null;
        this.drainRate = 2;
        this.lastWeightDisplayed = 0;
    };

    Bird.prototype.setPos = function(pos)
    {
        this.x = pos.x;
        this.y = pos.y;
    };

    Bird.prototype.getPos = function()
    {
        return pos;
    };

    Bird.prototype.update = function()
    {
        // figure out the new rate to fall at based on birdy weight
        this.yAccel += ( this.weight / 100 );

        var newX = this.x + this.xAccel,
            newY = this.y + this.yAccel;

        // bounds checking - vertical top
        if ( ( newY + this.height ) < 0 ) {
            newY = this.y;
            this.yAccel = 0;
        }

        // bounds checking - vertical bottom
        if ( ( newY - this.height ) > root.Canvas.height ) {
            root.Game.end();
        }

        // bounds checking - left
        if ( newX < 0 ) {
            newX = 0;
        }

        if ( newX > ( root.Canvas.width - this.width ) ) {
            newX = ( root.Canvas.width - this.width );
        }

        // finally, update our bird's position
        this.x = newX;
        this.y = newY;

        this._logic();
    };

    Bird.prototype.draw = function()
    {
        var ctx = root.Canvas.context,
            animFrame = Math.floor( this.curFrame / this.frameLimiter );

        ctx.drawImage(this.sprite, this.originalWidth * animFrame, 0, this.originalWidth, this.originalHeight, this.x, this.y, this.width, this.height);

        this.curFrame++;
        if ( this.curFrame >= (this.frames * this.frameLimiter) ) {
            this.curFrame = 0;
        }

        // sipping animation
        if ( this.flower !== null ) {
            ctx.save();
            ctx.fillStyle = "#e61752";
            ctx.fillRect(this.x + 4, this.y + 32, 6, 6);
            ctx.restore();
        }
    };

    Bird.prototype._logic = function()
    {
        // are we near flowers?
        var flowers = root.Flower.flowers,
            currentFlower = null;

        for (var i = 0, l = flowers.length; i < l; i++) {
            var pos = { x: this.x + 10, y: this.y + 32 }; // adjust the suckle point

            if (flowers[i].isNear(pos)) {
                currentFlower = flowers[i];
                this._targetFlower(currentFlower);
                break;
            }
        }

        // if not near any flowers at all clear some flower settings
        if ( currentFlower === null && this.flower !== null ) {
            // unset our flower reference
            this.flower = null;

            // clear all the timeouts for throttling sip rate
            clearTimeout(this.flowerTargetTimer);
            clearTimeout(this.flowerSippingTimer);
        }

        // update the bird's weight in the UI
        if ( this.lastWeightDisplayed + 0.1 < this.weight ) {
            this.lastWeightDisplayed = this.weight;
            root.UI.displayWeight(this.weight);
        }
    };

    // game logic
    Bird.prototype.flap = function()
    {
        // don't flap when too high
        if ( this.y < 0 ) return;

        // consume a bit of energy
        this.energy -= 0.3;
        this._capAndDisplayEnergy();

        // more lift the lower you are down the screen
        // less lift the less energy you have
        var newYAccel = this.yAccel - ( ( this.lift - ( 100 - this.energy ) / 600 ) + ( this.y * 0.001) );

        // hard coded little "jump" of lift
        this.y -= ( this.lift * 5 );
        
        // clamp the upwards acceleration
        if ( newYAccel < -this.maxYUpAccel) {
            return;
        }
        
        this.yAccel = newYAccel;
    };

    Bird.prototype.left = function()
    {
        this.x -= this.speed;
    };

    Bird.prototype.right = function()
    {
        this.x += this.speed;
    };

    Bird.prototype._targetFlower = function(flower)
    {
        var _this = this;

        // if we're already sipping this flower, don't do anything
        if (this.flower === flower) {
            return;
        }

        this.flower = flower;

        // pass the actual sipping to another function that is throttled via a timeout
        // the initial timer makes you hover for a bit before you can sip
        this.flowerTargetTimer = setTimeout(function() { _this._sipFlower(); }, 200);
    };

    Bird.prototype._sipFlower = function() {
        var _this = this;

        if ( this.flower === null ) return;

        // drain the flower
        this.flower.drain(this.drainRate);

        // increase the bird's weight
        this.weight += ( this.drainRate / 800 );

        // give the bird some more energy
        this.energy += 0.6;
        this._capAndDisplayEnergy();

        // adjust the bird's size based on weight
        //this.width = this.height = this.originalWidth + (this.weight * 2);

        this.flowerSippingTimer = setTimeout(function() { _this._sipFlower(); }, 50);
    };

    Bird.prototype._capAndDisplayEnergy = function() {
        if ( this.energy < 0 ) this.energy = 0;
        if ( this.energy > 100 ) this.energy = 100;

        root.UI.displayEnergy(this.energy);
    };

    root.Bird = Bird;

})(window);