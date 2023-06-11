var spriteModule = (function(module) {
    
    let moveConfig = {
        smallObjWidth: 20,
        smallObjHeight: 20,
        middleObjSize: 40,
        thinObjHeight: 5,

        fireColor: "rgba(255, 0, 0, 0.5)",//"#FF0000",
        iceColor: "#D4F0FF", // Ice blue
        leafColor: "#7BB661", 
        pulseColor: "#808080", // Grey
        rockColor: "#5A4D41",
        windColor: "rgba(255, 255, 255, 0.5)",
        sparkColor: "#FFFF33",

        lightColor: "rgba(255, 255, 255, 0.2)",

        damageRipple: {
            radiusInit: 10,
            radiusDiff: 10,
            color: "rgba(127, 127, 127, 0.2)",
            interval: 400,
        },

        borderColor: "#333333",

        holdInterval: 200,
        throwInterval: 300,
    }

    // Move Sprite ====================
    class MoveSprite extends spriteModule.Sprite {
        constructor(x, y) {
            super(x, y);
            //this.isAnchorCenter = true;

            this.from = {
                x: x,
                y: y
            };
            this.to = {
                x: x,
                y: y
            };

            this.isDamage = true;
            this.damageRippleColor = moveConfig.damageRipple.color;
        }
        setDestinationSprite(sprite) {
            this.to = {
                x: sprite.x + sprite.width / 2 - this.width / 2,
                y: sprite.y + sprite.height / 2 - this.height / 2
            };
        }
        // setDestination(x, y) {
        //     this.to = {
        //         x: x - this.width / 2,
        //         y: y - this.height / 2
        //     };
        // }
        setAmount(amount, isDamage) {
            if (amount !== null) {
                this.amount = amount;
            }
            this.isDamage = isDamage;
        }
        startAnimation(callback) {
            let dx = this.to.x - this.from.x;
            let dy = this.to.y - this.from.y;

            this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                "x",
                dx,
                moveConfig.throwInterval,
                moveConfig.holdInterval);

            this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                "y",
                dy,
                moveConfig.throwInterval,
                moveConfig.holdInterval);

            setTimeout(() => {
                this.clear();
                this.touchTargetAnimation();

                if (callback !== undefined) {
                    callback();
                }
            }, moveConfig.holdInterval + moveConfig.throwInterval);
        }
        touchTargetAnimation() {
            let ripple = new spriteModule.Circle(moveConfig.smallObjWidth / 2,
                moveConfig.smallObjHeight / 2,
                moveConfig.damageRipple.radiusInit,
                this.damageRippleColor);

            ripple.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                "radius",
                moveConfig.damageRipple.radiusDiff,
                moveConfig.damageRipple.interval,
                0);

            ripple.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                "opacity",
                -1,
                moveConfig.damageRipple.interval,
                0);

            let amountText = new uiModule.TextBlock(0, -50, 50, 20, this.amount.toString());
            if (!this.isDamage) {
                amountText.setTextColor("#CC6666");
            }
            //amountText.opacity = 0;
            amountText.setFadeIn(0, 0, moveConfig.damageRipple.interval, 0, -30);

            this.addSubSprite(ripple);
            this.addSubSprite(amountText);

            setTimeout(() => {
                this.clear();
            }, moveConfig.damageRipple.interval);
        }
    }

    // SquareMove ====================
    class SquareMove extends MoveSprite {
        constructor(x, y, size, color, borderColor = moveConfig.borderColor) {
            super(x, y);
            this.damageRippleColor = color;

            let rect = new spriteModule.Rect(0, 0,
                size,
                size,
                color,
                borderColor);
            rect.hasShadow = true;

            let reflect = new spriteModule.Circle(size / 2, size / 2,
                size / 2,
                moveConfig.lightColor);

            rect.addSubSprite(reflect);
            this.addSubSprite(rect);
        }
    }

    // CircleMove ====================
    class CircleMove extends MoveSprite {
        constructor(x, y, size, color, borderColor = moveConfig.borderColor) {
            super(x, y);
            this.damageRippleColor = color;

            let circle = new spriteModule.Circle(size / 2, size / 2,
                size / 2,
                color,
                borderColor);
                circle.hasShadow = true;

            let reflect = new spriteModule.Circle(size / 2, size / 2,
                size / 4,
                moveConfig.lightColor);

            circle.addSubSprite(reflect);
            this.addSubSprite(circle);
        }
    }

    // Fire ====================
    class Fire extends SquareMove {
        constructor(x, y) {
            super(x, y, moveConfig.smallObjWidth, moveConfig.fireColor);
        }
    }

    // Ice ====================
    class Ice extends SquareMove {
        constructor(x, y) {
            super(x, y, moveConfig.smallObjWidth, moveConfig.iceColor);
        }
    }

    // Snow ====================
    class Snow extends CircleMove {
        constructor(x, y) {
            super(x, y, moveConfig.middleObjSize, moveConfig.iceColor);
        }
    }

    // Rock ====================
    class Rock extends CircleMove {
        constructor(x, y) {
            super(x, y, moveConfig.middleObjSize, moveConfig.rockColor);
        }
    }

    // Wind ====================
    class Wind extends SquareMove {
        constructor(x, y) {
            super(x, y, moveConfig.middleObjSize, moveConfig.windColor, "#00000000");
        }
    }

    // Spark ====================
    class Spark extends SquareMove {
        constructor(x, y) {
            super(x, y, moveConfig.middleObjSize, moveConfig.sparkColor);
        }
    }

    // Leaf ====================
    class Leaf extends MoveSprite {
        constructor(x, y) {
            super(x, y);
            this.damageRippleColor = moveConfig.leafColor;

            let rect = new spriteModule.Rect(0, 0,
                moveConfig.smallObjWidth,
                moveConfig.thinObjHeight,
                moveConfig.leafColor,
                moveConfig.borderColor);

            let rect2 = new spriteModule.Rect(5, 10,
                moveConfig.smallObjWidth,
                moveConfig.thinObjHeight,
                moveConfig.leafColor,
                moveConfig.borderColor);

            rect.hasShadow = true;

            this.addSubSprite(rect);
            this.addSubSprite(rect2);
        }
    }

    // Pulse ====================
    class Pulse extends MoveSprite {
        constructor(x, y) {
            super(x, y);
            this.damageRippleColor = moveConfig.pulseColor;

            let rectRing = new spriteModule.RectRing(0, 0,
                moveConfig.smallObjWidth,
                moveConfig.smallObjHeight,
                moveConfig.pulseColor,
                );
            rectRing.hasShadow = true;

            this.addSubSprite(rectRing);
        }
    }

    // Expose Public Functions and Classes ====================
    module.Fire = Fire;
    module.Ice = Ice;
    module.Leaf = Leaf;
    module.Rock = Rock;
    module.Snow = Snow;
    module.Wind = Wind;
    module.Spark = Spark;
    
    module.Pulse = Pulse;


    return module;
})(spriteModule || {});