(function(root) {

    var Flower = function(options)
    {
        // engine logic
        //
        this.id = root.Utils.getGuid();
        this.zIndex = this.id + 15;


        // flower logic
        //
        this.width = this.height = root.Utils.getRandomInt(8, 18);
        this.hsl = {};
        this.hslStringFlower = null;
        this.hslStringPetal = null;
        this.rotate = root.Utils.getRandomInt(1, 180);  // random amount of flower head rotation
        this.originatingX = 0;                          // x pos that the flower grows from, usually not the same x as the flower head
        this.stalkRGB = { r: 79, g: 140, b: 17 };
        this.stalkCurve = { x: root.Utils.getRandomInt(-50, 50), y: root.Utils.getRandomInt(50, 100) };
        this.stalkThickness = this.width / 6;
        this.stalkOpacity = 1;

        this.x = 0;
        this.y = 0;
        this.targetY = 0;
        this.targetX = 0;
        this.positionBuffer = 70; // distance to keep away from edges of stage
        this.growSpeed = 1;
        this.dieSpeed = 3;
        this.dieXRange = 10;
        this.dieAngle = 0;
        this.finalY = 0;


        // game logic
        //
        this.nectar = 100;
        this.decayRate = 0.05;
        this.growing = false;
        this.dying = false;


        // constructing
        //
        this._init();
    };

    Flower.prototype.update = function()
    {
        // animate up into the light!
        if ( this.growing ) {
            if ( this.y > this.targetY ) {
                var diff = this.y - this.targetY;
                this.y -= ( this.growSpeed / 5 ) + ( this.growSpeed * ( diff / 50 ) );
            } else {
                this.finalY = this.targetY;
                this.growing = false;
            }
        } else if ( this.dying ) {
            if ( this.y < ( this.targetY + ( this.height * 2 ) ) ) {
                this.x = this.targetX + Math.sin(this.dieAngle) * this.dieXRange;
                this.y += this.dieSpeed;

                this.dieAngle += 0.1;
            } else {
                this.dying = false;
                this._remove();
            }
        }

        // spin the flower if dying
        if ( this.dying ) this.rotate += 0.05;

        // flowers slowly die over time
        this.drain(this.decayRate);
    };

    Flower.prototype.draw = function()
    {
        var ctx = root.Canvas.context;

        // stalk mound
        if ( !this.dying ) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = '#999b0f';
            ctx.arc(this.originatingX, root.Canvas.height + 2, this.width / 2, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        }

        // stalk
        // save before we set a stroke style for the stalk
        ctx.save();

        // fade out stalk if dying
        var stalkX = this.x,
            stalkY = this.y;

        if ( this.dying ) {
            if ( this.stalkOpacity > 0 ) {
                this.stalkOpacity -= 0.04;

                if ( this.stalkOpacity < 0) {
                    this.stalkOpacity = 0;
                }
            }

            stalkX = this.targetX;
            stalkY = this.finalY;
        }

        ctx.strokeStyle = 'rgba(' + this.stalkRGB.r + ', ' + this.stalkRGB.g + ', ' + this.stalkRGB.b +', ' + this.stalkOpacity + ')';
        ctx.lineWidth = this.stalkThickness;
        ctx.beginPath();

        var stalkBottom = ( this.dying ) ? root.Canvas.height : ( ( root.Canvas.height - this.height / 2 ) + 3 );

        ctx.moveTo(this.originatingX, stalkBottom );
        ctx.quadraticCurveTo(stalkX + this.stalkCurve.x, stalkY + this.stalkCurve.y, stalkX, stalkY);
        ctx.stroke();

        ctx.restore();

        // save before we rotate/transform the canvas for the flower rotation
        ctx.save();

        // the centre point to rotate around
        ctx.translate( this.x + (this.width / 2), this.y + (this.width / 2) );
        ctx.rotate(this.rotate);

        // offset back to the our original point to begin drawing
        ctx.translate( -(this.width / 2), -(this.width / 2) );

        // flower core
        ctx.save();
        ctx.fillStyle = this.hslStringFlower;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();

        // petals
        ctx.save();
        ctx.fillStyle = this.hslStringPetal;
        ctx.fillRect(0, ( -this.height + 1 ), this.width, this.height);
        ctx.fillRect(( this.width - 1 ), 0, this.width, this.height);
        ctx.fillRect(0, ( this.height - 1 ), this.width, this.height);
        ctx.fillRect(( -this.width + 1 ), 0, this.width, this.height);
        ctx.restore();

        // restore from our rotation/transforming
        ctx.restore();
    };

    Flower.prototype._randomPosition = function()
    {
        var x = root.Utils.getRandomInt( this.positionBuffer / 2, root.Canvas.width - this.positionBuffer ), // with a padding buffer
            y = root.Utils.getRandomInt( this.positionBuffer, root.Canvas.height - this.positionBuffer );    // with a padding buffer

        this.x = this.targetX = x;
        this.y = root.Canvas.height;
        this.originatingX = root.Utils.getRandomInt(x - (this.width * 2), x + (this.width * 2));

        return { x: x, y: y };
    };

    Flower.prototype._randomFlowerColor = function()
    {
        this.hsl = root.Utils.getRandomColor(70, 50);
    };

    Flower.prototype._updateColor = function()
    {
        this.hslStringFlower = root.Utils.getHSLString(this.hsl);
        this.hslStringPetal = root.Utils.getHSLString({ hue: this.hsl.hue, lightness: this.hsl.lightness - 10, saturation: this.hsl.saturation });
    };

    Flower.prototype._remove = function()
    {
        // remove from the update list
        root.Game.removeFromUpdate(this);

        // remove from the draw list
        root.Game.removeFromDraw(this);

        // remove from the flower list
        if ( !root.Utils.removeObjFromArray( root.Flower.flowers, this ) ) {
            throw new Error('Failed to remove the flower from the root.Flower.flowers array.');
        }
    };

    Flower.prototype._init = function()
    {
        // set a random color
        this._randomFlowerColor();
        this._updateColor();

        // save to list of flowers
        root.Flower.flowers.push(this);

        // start growing little flower!
        this.grow();
    };

    // compares the nearness of a single point (x,y) to the flower
    Flower.prototype.isNear = function(thing)
    {
        // outside top left corner?
        if ( thing.x < this.x || thing.y < this.y ) {
            return false;
        }

        // outside bottom right corner?
        if ( thing.x > ( this.x + this.width ) || thing.y > ( this.y + this.height ) ) {
            return false;
        }

        return true;
    };

    // game logic
    Flower.prototype.grow = function()
    {
        var targetPos = this._randomPosition();

        this.targetY = targetPos.y;
        this.growing = true;
    };

    Flower.prototype.die = function()
    {
        this.targetY = root.Canvas.height;
        this.dying = true;
    };

    Flower.prototype.drain = function(amount)
    {
        this.nectar -= amount;

        if (this.nectar <= 0) {
            this.die();
        }

        // update the lightness of the flower as it is drained
        var newLightness = 40 + (100 - this.nectar); // lightness won't be under 40 (too dark)
        if ( newLightness > 90 ) newLightness = 90; // cap the lightness under white
        this.hsl.lightness = newLightness;
        this._updateColor();
    };

    Flower.flowers = [];

    root.Flower = Flower;

})(window);