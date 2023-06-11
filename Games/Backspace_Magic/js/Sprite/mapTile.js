var mapModule = (function(module) {
    "use strict";
    
    // Settings that are applicable to all blocks
    let config = {
        // To be changed by the init method
        width: 40,
        height: 40,
        //spacingBetweenH: 10,
        //spacingBetweenV: 10,
        gridWidth: 42,
        gridHeight: 42,
        
        transitionTime: 100,
        
        // Constants
        borderWidth: 5,
        borderColor: "#333333",
        lineJoin: "round",

        character: {
            marginX: 6,
            marginY: 3,
            headHeight: 25,
            eyeFromY: 5,
            eyeToY: 10,
        }
    };

    // MapTile Sprite (Base) ====================
    class MapTile extends spriteModule.Sprite{
        constructor(i, j) {
            super(j * config.gridWidth, i * config.gridHeight, config.width, config.height);
            //this.setSize(config.width, config.height);
            this.setFillColor("#666600");
            this.i = i;
            this.j = j;
        }
        drawItself(ctx) {
            super.drawItself(ctx);
            
            ctx.fillStyle = this.fillColor;
            ctx.beginPath();
            ctx.arc(this.width / 2, this.height / 2, this.height / 2, Math.PI * 0.75, Math.PI * 0.25);
            ctx.fill();
        }
        setFillColor(fillColor) {
            this.fillColor = fillColor;
            // this.calculateShadowColor();
            // this.calculateTintColor();
        }
        // calculateShadowColor() {
        //     let shadowStrength = config.shadowStrength; //this.SHADOW_STRENGTH;
        //     //let rgb = this.fillColor.substring(1, 3);//.subString(0,1)//.match(/\d+/g);
        //     let r = Math.max(parseInt("0x" + this.fillColor.substring(1, 3)) - shadowStrength, 0);
        //     let g = Math.max(parseInt("0x" + this.fillColor.substring(3, 5)) - shadowStrength, 0);
        //     let b = Math.max(parseInt("0x" + this.fillColor.substring(5)) - shadowStrength, 0);
        //     this.shadowColor = "rgb(" + [r, g, b].join(',') + ")";
        // }
        // calculateTintColor() {
        //     let tintStrength = config.tintStrength; //this.tint_STRENGTH;
        //     let r = Math.min(parseInt("0x" + this.fillColor.substring(1, 3)) + tintStrength, 255);
        //     let g = Math.min(parseInt("0x" + this.fillColor.substring(3, 5)) + tintStrength, 255);
        //     let b = Math.min(parseInt("0x" + this.fillColor.substring(5)) + tintStrength, 255);
        //     this.tintColor = "rgb(" + [r, g, b].join(',') + ")";
        // }
        // moveBy(movementI, movementJ) {
        //     this.stopAllBehavior(true);
        //     if (movementJ !== 0) {
        //         this.j += movementJ;
        //         this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior, "x", config.gridWidth * movementJ, config.transitionTime * Math.abs(movementJ), 0);
        //     }
        //     if (movementI !== 0) {
        //         this.i += movementI;
        //         this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior, "y", config.gridHeight * movementI, config.transitionTime * Math.abs(movementI), 0);
        //     }
        // }
        // shake() {
        //     // Cannot add animation if other animation is running
        //     if (!this.isBehaviorDone()) {
        //         return false;
        //     }
        //     // Use sine on x and y to simulate shaking
        //     this.addBehaviorWithDelay(spriteModule.SineBehavior, "x", config.shakeConfig.peak, 100, 0, {
        //         period: config.shakeConfig.periodX
        //     });
        //     this.addBehaviorWithDelay(spriteModule.SineBehavior, "y", config.shakeConfig.peak, 100, 0, {
        //         period: config.shakeConfig.periodY
        //     });
        // }
    }

    class MapBushTile extends MapTile{
        constructor(i, j) {
            super(i, j);
            this.setFillColor("#6A8900");
        }
    }

    class MapStoneTile extends MapTile{
        constructor(i, j) {
            super(i, j);
            this.setFillColor("#5A4D41");
        }
    }

    class MapCloudTile extends MapTile{
        constructor(i, j) {
            super(i, j);
            this.setFillColor("#EEEEEE");
        }
    }

    class MapGoalTile extends MapTile{
        constructor(i, j) {
            super(i, j);
            this.setFillColor("#804080");
        }
        drawItself(ctx) {
            //super.drawItself(ctx);

            ctx.strokeStyle = this.fillColor;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.moveTo(this.width / 4 * 3, this.height / 2);
            ctx.arc(this.width / 2, this.height / 2, this.width / 4, 0, Math.PI * 2);
            //ctx.moveTo(this.width / 2, this.height / 2);
            //ctx.strokeRect(this.width/4, this.height/4, this.width/2, this.height/2);
            //ctx.arc(this.width / 2, this.height / 2, this.height / 2, Math.PI * 0.75, Math.PI * 0.25);
            ctx.stroke();
        }
    }

    // class MapArrowTile extends MapTile{
    //     constructor(i, j) {
    //         super(i, j);
    //         this.setFillColor("#CCCC66");
    //     }
    //     drawItself(ctx) {
    //         ctx.strokeStyle = this.fillColor;
    //         ctx.lineWidth = 2;

    //         ctx.beginPath();
            
    //         ctx.moveTo(0, 0);
    //         ctx.lineTo(this.width / 2, 0);
    //         ctx.lineTo(this.width, this.height / 2);
    //         ctx.lineTo(this.width / 2, this.height);
    //         ctx.lineTo(0, this.height);
    //         ctx.lineTo(this.width / 2, this.height / 2);
    //         ctx.lineTo(0, 0);
    //         ctx.stroke();
    //     }
    // }

    class MapActor extends spriteModule.Sprite{
        //constructor(i, j) {
        constructor(mapActorData) {
            let i = mapActorData.i;
            let j = mapActorData.j;

            super(j * config.gridWidth + config.character.marginX,
                i * config.gridHeight + config.character.marginY,
                config.width - config.character.marginX * 2,
                config.height - config.character.marginY * 2
                );
            

            this.i = i;
            this.j = j;
        }
        moveBy(movementI, movementJ) {
            this.stopAllBehavior(true);
            if (movementJ !== 0) {
                this.j += movementJ;
                this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior, "x", config.gridWidth * movementJ, config.transitionTime * Math.abs(movementJ), 0);
            }
            if (movementI !== 0) {
                this.i += movementI;
                this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior, "y", config.gridHeight * movementI, config.transitionTime * Math.abs(movementI), 0);
            }
        }
    }

    class MapPlayer extends MapActor{
        constructor(mapActorData) {
            super(mapActorData);
        }
        drawItself(ctx) {
            super.drawItself(ctx);

            // Head
            ctx.lineWidth = config.borderWidth;
            ctx.lineJoin = config.lineJoin;
            
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.strokeStyle = config.borderColor;
            ctx.strokeRect(0, 0, this.width, config.character.headHeight);

            ctx.fillStyle = "#EEEEFF";
            ctx.fillRect(0, 0, this.width, config.character.headHeight);

            // Body
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(this.width / 4, config.character.headHeight);
            ctx.lineTo(0, this.height);
            ctx.lineTo(this.width, this.height);
            ctx.lineTo(this.width / 4 * 3, config.character.headHeight);
            //ctx.lineTo(this.width / 4, characterConfig.headHeight);
            ctx.stroke();
            ctx.fill();
            
            // Eyes
            ctx.lineCap = this.lineJoin;
            ctx.beginPath();
            ctx.moveTo(this.width / 4, config.character.eyeFromY);
            ctx.lineTo(this.width / 4, config.character.eyeToY);
            ctx.moveTo(this.width / 4 * 3, config.character.eyeFromY);
            ctx.lineTo(this.width / 4 * 3, config.character.eyeToY);
            ctx.stroke();

            super.drawItself(ctx);
        }
    }

    class MapEnemy extends MapActor{
        constructor(mapActorData) {
            super(mapActorData);

            this.canMove = mapActorData.canMove;
            this.enemyId = mapActorData.id;
        }
        drawItself(ctx) {
            super.drawItself(ctx);

            ctx.fillStyle = "#66666680";
            ctx.strokeStyle = config.borderColor;
            ctx.lineWidth = config.borderWidth;

            ctx.strokeRect(0, 0, this.width, this.height);
            ctx.fillRect(0, 0, this.width, this.height);
            
            ctx.beginPath();
            ctx.moveTo(this.width / 4, config.character.eyeFromY);
            ctx.lineTo(this.width / 4, config.character.eyeToY);
            ctx.moveTo(this.width / 4 * 3, config.character.eyeFromY);
            ctx.lineTo(this.width / 4 * 3, config.character.eyeToY);
            ctx.stroke();
        }
    }

    class MapItemBox extends MapActor{
        constructor(mapActorData) {
            super(mapActorData);

            this.type = mapActorData.type;
            this.spell = mapActorData.spell;
        }
        drawItself(ctx) {
            super.drawItself(ctx);

            ctx.fillStyle = "#FFD700"; // Gold
            ctx.strokeStyle = config.borderColor;
            ctx.lineWidth = config.borderWidth;

            ctx.fillRect(0, 0, this.width, this.height);
            ctx.strokeRect(0, 0, this.width, this.height / 2);
            ctx.strokeRect(1, this.height / 2, this.width - 2, this.height / 2);
        }
    }

    // Expose Public Functions and Classes ====================
    //module.MapTile = MapTile;
    module.MapBushTile = MapBushTile;
    module.MapStoneTile = MapStoneTile;
    module.MapCloudTile = MapCloudTile;
    module.MapGoalTile = MapGoalTile;
    //module.MapArrowTile = MapArrowTile;

    module.MapPlayer = MapPlayer;
    module.MapEnemy = MapEnemy;
    module.MapItemBox = MapItemBox;
    return module;

})(mapModule || {});