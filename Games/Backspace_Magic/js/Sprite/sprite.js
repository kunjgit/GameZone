var spriteModule = (function() {
    "use strict";
    
    // Sprite ====================
    class Sprite {
        constructor(x, y, width = 0, height = 0) {
            // x and y is relative to its parent
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.tag = 0; // For Particle System
            this.rotateAngle = 0; // Degree
            this.opacity = 1;
            this.isVisible = true;
            this.isAnchorCenter = false;
            this.behaviorList = [];
            this.subSpriteList = [];
            this.parentSprite = null;
            this.behaviorBackup = [];
            this.autoRestart = false;
            this.isPauseBehavior = false;
            this.restartWaitTime = 0;
            this.restartWaitedTime = 0;
            this.blinkOpacity = 0;
            this.blinkBehvaior = null;
            this.clickListener = null;
            this.hoverListener = null;
            this.swipeListener = null;
            this.isHovered = false;
            this.isEnabled = true;
            this.cacheCanvas = document.createElement("canvas");
            this.cacheCanvas.width = width;
            this.cacheCanvas.height = height;
            this.isDrawFromCache = false;
            this.drawOnce = false;
            this.drawn = false;
            this.hasUpdate = false;
        }
        draw(ctx) {

            // if (this.drawOnce && this.drawn) {
            //     return;
            // }

            // if (this.drawOnce && !this.drawn) {
            //     this.drawn = true;
            // }

            if (this.isDrawFromCache) {
                ctx.drawImage(this.cacheCanvas, 0, 0);
                return;
            }
            
            ctx.save();
            this.drawItself(ctx);
            ctx.restore();
            this.drawSubsprite(ctx);
        }
        drawFromCache() {
            let cacheCtx = this.cacheCanvas.getContext("2d");
            this.isDrawFromCache = false;
            this.draw(cacheCtx);
            this.isDrawFromCache = true;
        }

        drawItself(ctx) {
            // Draw itself, to be implemented by the "subclass".
        }

        drawSubsprite(ctx) {

            if (this.subSpriteList.length > 0) {
            
                ctx.save();
            
                if (this.parentSprite === null) {
                    // Translate the root sprite
                    ctx.translate(this.x, this.y);
                }

                this.subSpriteList.forEach(function(element) {
                    // Note: This works for sprites in a layer, which is also just a sprite itself 
                    // It does not work for the "layer"
                    if (element.isVisible) {

                        ctx.save();
    
                        // Before drawing, set the position, rotation and opacity
                        ctx.translate(element.x, element.y);
                        ctx.rotate(element.rotateAngle * Math.PI / 180);
                        if (element.isAnchorCenter === true) {
                            ctx.translate(-element.width / 2, -element.height/2);
                        }
    
                        ctx.globalAlpha = ctx.globalAlpha * element.opacity;
    
                        element.draw(ctx);
                        ctx.restore();
                    }
                }, this);
                
                ctx.restore();
            }
        }
        
        update(timeLapsed) {

            let isAnythingChanged = false;

            let subSpriteCount = this.subSpriteList.length;
            if (subSpriteCount > 0) {
                // Update sub sprites
                // this.subSpriteList.forEach(function(element) {
                //     element.update(timeLapsed);
                // }, this);

                for (let i = 0; i < subSpriteCount; i++) {
                    const subSprite = this.subSpriteList[i];
                    let isSubspriteChanged = subSprite.update(timeLapsed);
                    if (isSubspriteChanged) {
                        isAnythingChanged = true;
                    }
                }
            }
            
            let behaviorCount = this.behaviorList.length;
            if (behaviorCount > 0) {

                // Update the sprite according to the behavior list
                // this.behaviorList.forEach(function(element) {
                //     element.execute(timeLapsed);
                // }, this);
        
                isAnythingChanged = true;
                
                for (let i = 0; i < behaviorCount; i++) {
                    const behvaior = this.behaviorList[i];
                    behvaior.execute(timeLapsed);
                }
                
                this.behaviorList = this.behaviorList.filter(function (element) {
                    return (!element.finished);
                });
    
                if (this.isBehaviorDone() && this.autoRestart) {
                    if (this.restartWaitedTime < this.restartWaitTime) {
                        this.restartWaitedTime += timeLapsed;
                    }
                    else {
                        this.restartBehavior();
                    }
                }
            }

            if (this.hasUpdate) {
                isAnythingChanged = true;
                this.hasUpdate = false;
            }

            return isAnythingChanged;
        }

        clearBehavior(recursive = false) {
            this.behaviorList = [];

            if (recursive) {
                this.subSpriteList.forEach(function(element) {
                    element.clearBehavior(recursive);
                }, this);
            }
        }
        
        addBehavior(behavior) {
            if (behavior instanceof SpriteBehavior) {
                this.behaviorList.push(behavior);
                this.behaviorBackup.push(behavior);
            }
        }

        addBehaviorWithDelay(behaviorClass, variableName, changeFunction, interval, delay = 0, config) {
            
            setTimeout((() => {
                let behavior = new behaviorClass(this, variableName, changeFunction, interval, config);
                this.addBehavior(behavior);
            }).bind(this), delay);

            //return behavior;
        }

        stopBehavior(behavior) {
            if (this.behaviorList.includes(behavior)) {
                behavior.stop(false);
            }
        }

        stopAllBehavior(isToEnd) {
            this.behaviorList.forEach(function(element) {
                element.stop(isToEnd);
            }, this);
        }

        isBehaviorDone() {
            return this.behaviorList.length === 0;
        }
        
        addSubSprite(sprite, isExpand = true) {
            if (sprite instanceof Sprite) {
                sprite.parentSprite = this;
                this.subSpriteList.push(sprite);

                if (isExpand) {
                    if (this.width < sprite.x + sprite.width) {
                        this.width = sprite.x + sprite.width;
                        this.cacheCanvas.width = this.width;
                    }
    
                    if (this.height < sprite.y + sprite.height) {
                        this.height = sprite.y + sprite.height;
                        this.cacheCanvas.height = this.height;
                    }
                }
            }
        }

        removeSubSprite(sprite) {
            let index = this.subSpriteList.indexOf(sprite);
            this.subSpriteList.splice(index, 1);
        }

        clearSubSprite(recursive = false) {
            this.subSpriteList = [];

            if (recursive) {
                this.subSpriteList.forEach(function(element) {
                    element.clearSubSprite(recursive);
                }, this);
            }

            this.hasUpdate = true;
        }

        placeSubSpriteTopToBottom() {
            this.subSpriteList.push(this.subSpriteList.shift());
        }
        
        clear(isRecursive = true) {
            this.clearSubSprite(isRecursive);
            this.clearBehavior(isRecursive);
        }

        //===========================

        setPos(x, y) {
            this.x = x;
            this.y = y;
            this.hasUpdate = true;
        }
        
        setSize(width, height) {
            this.width = width;
            this.height = height;
            this.hasUpdate = true;
        }
        
        isPointInside(globalPos) {
            let localPos = this.getRelativePos(globalPos);
            let pointX = localPos.x;
            let pointY = localPos.y;

            /*
            let isX = (pointX > this.x && pointX < this.x + this.width);
            let isY = (pointY > this.y && pointY < this.y + this.height);
            */
            let isX = (pointX > 0 && pointX < this.width);
            let isY = (pointY > 0 && pointY < this.height);
            return isX && isY;
        }

        setVisible(isVisible) {
            this.isVisible = isVisible;
        }
        
        isVisible() {
            return this.isVisible;
        }

        setTop() {
            if (this.parentSprite !== null) {
                let index = this.parentSprite.subSpriteList.indexOf(this);
                if (index !== this.parentSprite.subSpriteList.length - 1) {
                    this.parentSprite.subSpriteList.splice(index, 1);
                    this.parentSprite.subSpriteList.push(this);
                }
            }
        }

        setFadeIn(fromOpacity, beforeTime, fadeTime, dx = 0, dy = 0) {
            let opacityDelta = 1 - fromOpacity;
            
            setTimeout(() => {
                this.opacity = fromOpacity;
                this.addBehaviorWithDelay(EaseInOutBehavior, "opacity", opacityDelta, fadeTime, 0);
            }, beforeTime);

            if (dx !== 0) {
                this.x -= dx;
                this.addBehaviorWithDelay(EaseInOutBehavior, "x", dx, fadeTime, beforeTime);
            }

            if (dy !== 0) {
                this.y -= dy;
                this.addBehaviorWithDelay(EaseInOutBehavior, "y", dy, fadeTime, beforeTime);
            }
        }

        blink(blinkInterval) {

            let config = {};
            if (blinkInterval !== undefined) {
                config.repeatInterval = blinkInterval;
            }
            this.blinkBehvaior = this.addBehaviorWithDelay(spriteModule.BlinkBehavior, "blinkOpacity", 0.5, -1, 0, config);
        }

        stopBlink() {
            if (this.blinkBehvaior !== null) {
                this.stopBehavior(this.blinkBehvaior);
                this.blinkBehvaior = null;
                this.blinkOpacity = 0;
            }
        }

        getRelativePos(globalPos) {
            let relativePos = {
                x: globalPos.x - this.x,
                y: globalPos.y - this.y,
            };
            
            // Recursion
            if (this.parentSprite !== null) {
                relativePos = this.parentSprite.getRelativePos(relativePos);
            }

            return relativePos;
        }

        getGlobalPos() {
            let globalPos = {
                x: this.x,
                y: this.y,
            };
            
            let parent = this.parentSprite;
            while (parent !== null) {
                globalPos.x += parent.x;
                globalPos.y += parent.y;
                parent = parent.parentSprite;
            }

            return globalPos;
        }
    }
    
    // SpriteBehavior ====================
    class SpriteBehavior {
        constructor(sprite, variableName, changeFunction, interval) {
            
            this.sprite = sprite;
            this.variableName = variableName;
            this.changeFunction = changeFunction;
            this.isChangeFunctionIncremental = false;
            this.interval = interval;
            this.originalValue = this.sprite[this.variableName];
            this.passedTime = 0;
            this.started = false;
            this.finished = false;
            this.lastChange = 0;
            this.checkUnfinished = this.getCheckUnfinished().bind(this);
        }
        execute(timeLapsed) {
            if (this.finished) {
                return;
            }

            this.passedTime += timeLapsed;

            if (this.checkUnfinished()) {
                // TODO: Review the structure
                if (this.isChangeFunctionIncremental) {
                    this.sprite[this.variableName] += this.changeFunction(timeLapsed);
                }
                else {
                    let currentChange = this.changeFunction(this.passedTime);
                    this.sprite[this.variableName] += (currentChange - this.lastChange);
                    this.lastChange = currentChange;
                }
            }
            else {
                this.stop(true);
            }
        }
        stop(isToEnd) {
            this.finished = true;

            if (isToEnd) {
                this.toEndValue();
            }
        }
        toEndValue() {
            // Only meaningful to those with limited time interval
            if (this.interval > 0) {
                this.sprite[this.variableName] = this.originalValue + this.changeFunction(this.interval);
            }
        }
        getCheckUnfinished() {
            if (this.interval >= 0) {
                return function() {
                    return this.passedTime < this.interval;
                }
            }
            else {
                return function() {
                    return true;
                }
            }
        }
        replay() {
            this.sprite[this.variableName] = this.originalValue;
            this.passedTime = 0;
            this.finished = false;
        }
    }

    // class LinearBehavior extends SpriteBehavior{
    //     constructor(sprite, variableName, changeAmount, interval) {

    //         let changeFunctionInteval = (interval !== undefined && interval > 0) ? interval : 1000;
    //         let changeFunction = function (time) {
    //             return (time / changeFunctionInteval) * changeAmount;
    //         };
    //         super(sprite, variableName, changeFunction, interval);
    //         this.isChangeFunctionIncremental = true;
    //     }
    // }
    
    class BlinkBehavior extends SpriteBehavior{
        constructor(sprite, variableName, changeAmount, interval, config) {
            // if (!(this instanceof BlinkBehavior)) {
            //     throw new Error("BlinkBehavior(sprite, variableName, changeAmount, interval) can only be called as a constructor.");
            // }
            let repeatInterval = 2000;
            if (config !== undefined && config.repeatInterval !== undefined) {
                repeatInterval = config.repeatInterval;
            }
            let changeFunctionInteval = (interval !== undefined && interval > 0) ? interval : repeatInterval;
            let changeFunction = function (time) {
                let tRatio = time / changeFunctionInteval;
                tRatio = tRatio % 1;
                return (1 - Math.cos(2 * Math.PI * tRatio)) / 2 * changeAmount;
            };
            super(sprite, variableName, changeFunction, interval);
        }
    }

    // class BlinkBehavior2 extends SpriteBehavior{
    //     constructor(sprite, variableName, changeAmount, interval, config) {
    //         let repeatInterval = 1000;
    //         if (config !== undefined && config.repeatInterval !== undefined) {
    //             repeatInterval = config.repeatInterval;
    //         }
    //         let changeFunctionInteval = (interval !== undefined && interval > 0) ? interval : repeatInterval;
    //         let changeFunction = function (time) {
    //             let tRatio = time / changeFunctionInteval;
    //             tRatio = tRatio % 1;
    //             return (tRatio < 0.5) ? 0 : changeAmount;
    //         };
    //         super(sprite, variableName, changeFunction, interval);
    //     }
    // }

    class SineBehavior extends SpriteBehavior{
        constructor(sprite, variableName, changeAmount, interval, config) {

            let freq = 1.0 / config.period;
            let peakAmount = changeAmount;
            let changeFunction = function (time) {
                if (time >= interval) {
                    // Return 0, avoid any rounding error
                    return 0;
                }
                else {
                    return Math.sin(time * freq * 2 * Math.PI) * peakAmount;
                }
            };
            super(sprite, variableName, changeFunction, interval);
        }
    }
    
    // let EaseBehavior = function(sprite, variableName, changeAmount, interval) {
    //     if (!(this instanceof EaseBehavior)) {
    //         throw new Error("EaseBehavior(sprite, variableName, changeAmount, interval) can only be called as a constructor.");
    //     }
        
    //     let changeFunction = function(time) {
    //         if (time >= interval) {
    //             // Return finalAmount, avoid any rounding error
    //             return changeAmount;
    //         }
    //         else {
    //             return Math.pow(time/interval, 0.5) * changeAmount;
    //         }
    //     };
        
    //     SpriteBehavior.call(this, sprite, variableName, changeFunction, interval);
    // };
    // EaseBehavior.prototype = Object.create(SpriteBehavior.prototype);

    class EaseInOutBehavior extends SpriteBehavior {
        constructor(sprite, variableName, changeAmount, interval) {

            let changeFunction = function (time) {
                if (time >= interval) {
                    // Return finalAmount, avoid any rounding error
                    return changeAmount;
                }
                else {
                    // Use the polynomial 3x^2 - 2x^3
                    let x = time / interval;
                    let y = Math.pow(x, 2) * (3 - 2 * x);
                    return y * changeAmount; //Math.pow(time/interval, 0.5) * changeAmount;
                }
            };
            super(sprite, variableName, changeFunction, interval);
        }
    }
    
    // Expose Public Classes ====================
    return {
        Sprite: Sprite,
        //SpriteBehavior: SpriteBehavior,
        //LinearBehavior: LinearBehavior,
        SineBehavior: SineBehavior,
        //EaseBehavior: EaseBehavior,
        EaseInOutBehavior: EaseInOutBehavior,
        BlinkBehavior: BlinkBehavior,
        //BlinkBehavior2: BlinkBehavior2
    };
})();