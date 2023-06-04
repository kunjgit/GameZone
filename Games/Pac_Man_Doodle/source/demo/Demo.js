/**
 * The Demo Class
 */
class Demo {
    
    /**
     * The Demo constructor
     */
    constructor() {
        this.canvas  = Board.screenCanvas;
        this.ctx     = this.canvas.context;
        
        this.step    = -1;
        this.name    = "";
        this.bigBlob = new BigBlob();
        this.food    = new DemoFood();
        
        this.nextAnimation();
    }
    
    
    /**
     * Destroys the current Demo and leaves it ready for the next start
     */
    destroy() {
        this.step    = -1;
        this.bigBlob = new BigBlob();
        
        this.canvas.clear();
        this.nextAnimation();
    }
    
    
    /**
     * Calls the animation the demo is at
     * @param {number} time
     * @param {number} speed
     */
    animate(time, speed) {
        switch (this.name) {
        case "title":
            this.titleAnimation(time);
            break;
        case "chase":
            this.chaseAnimation(speed);
            break;
        case "frighten":
            this.frightenAnimation(time, speed);
            break;
        case "present":
            this.presentAnimation(time, speed);
            break;
        }
    }
    
    /**
     * Jumps to the next animation in the demo
     */
    nextAnimation() {
        this.step  = this.step === DemoData.animations.length - 1 ? 1 : this.step + 1;
        this.name  = DemoData.animations[this.step];
        this.timer = 0;
        
        switch (this.name) {
        case "chase":
            this.initChase();
            break;
        case "frighten":
            this.initFrighten();
            break;
        case "present":
            this.initPresent();
            break;
        }
    }
    
    
    /**
     * The Title Animation
     * @param {number} time
     */
    titleAnimation(time) {
        this.timer += time;
        let alpha   = 1 - Math.round(10 * this.timer / DemoData.title.endTime) / 10;
        
        this.canvas.clear();
        this.bigBlob.animate(time);
        this.canvas.fill(alpha);
        
        if (this.timer > DemoData.title.endTime) {
            this.canvas.clear();
            this.drawTitle();
            this.bigBlob.endAnimation();
            this.nextAnimation();
        }
    }
    
    /**
     * Draws the Pacman title
     */
    drawTitle() {
        var left  = Board.tileToPos(DemoData.title.leftText),
            right = Board.tileToPos(DemoData.title.rightText);
        
        this.ctx.save();
        this.ctx.font      = "6em 'Whimsy TT'";
        this.ctx.textAlign = "right";
        this.ctx.fillText("Pa", left.x, left.y);
        this.ctx.textAlign = "left";
        this.ctx.fillText("man", right.x, right.y);
        this.ctx.restore();
    }
    
    
    /**
     * Initializes the Players for the Chase animation
     */
    initChase() {
        let size = Board.tileSize,
            yPos = DemoData.chase.playersY * size,
            dir  = DemoData.chase.playersDir;
        
        this.createPlayers();
        this.blob.chaseDemo(dir,       -size, yPos);
        this.blinky.chaseDemo(dir, -4 * size, yPos);
        this.pinky.chaseDemo(dir,  -6 * size, yPos);
        this.inky.chaseDemo(dir,   -8 * size, yPos);
        this.clyde.chaseDemo(dir, -10 * size, yPos);
        
        this.endPos = DemoData.chase.endTile * Board.tileSize;
    }
    
    /**
     * Creates the Blob and the Ghosts
     */
    createPlayers() {
        this.blob   = new DemoBlob();
        this.blinky = new DemoGhost(Blinky.name, Blinky.color);
        this.pinky  = new DemoGhost(Pinky.name, Pinky.color);
        this.inky   = new DemoGhost(Inky.name, Inky.color);
        this.clyde  = new DemoGhost(Clyde.name, Clyde.color);
        
        this.ghosts = [ this.blinky, this.pinky, this.inky, this.clyde ];
    }
    
    /**
     * The Chase Animation
     * @param {number} speed
     */
    chaseAnimation(speed) {
        this.animatePlayers(speed, true);
        
        if (this.blob.getX() >= this.endPos) {
            this.nextAnimation();
        }
    }
    
    
    /**
     * Initializes the Players for the Frighten animation
     */
    initFrighten() {
        var speed = Data.getLevelData("ghostFrightSpeed") * DemoData.frighten.speedMult,
            dir   = DemoData.frighten.playersDir;
        
        this.blob.frightenDemo(dir);
        this.blinky.frightenDemo(dir, speed);
        this.pinky.frightenDemo(dir, speed);
        this.inky.frightenDemo(dir, speed);
        this.clyde.frightenDemo(dir, speed);
        
        this.scores = [];
        this.endPos = DemoData.frighten.endTile * Board.tileSize;
    }
    
    /**
     * The Frighten Animation
     * @param {number} time
     * @param {number} speed
     */
    frightenAnimation(time, speed) {
        this.animatePlayers(speed);
        this.drawScores(time);
        
        if (this.ghosts.length > 0 && this.blob.getX() <= this.ghosts[0].getX()) {
            this.ghosts.shift();
            this.text = this.blob.getX();
            this.scores.push({
                timer : 0,
                size  : 1,
                color : "rgb(51, 255, 255)",
                text  : Data.getGhostScore(4 - this.ghosts.length),
                pos   : {
                    x : this.blob.getX() / Board.tileSize,
                    y : DemoData.frighten.textTile
                }
            });
        }
        if (this.blob.getX() < this.endPos) {
            this.nextAnimation();
        }
    }
    
    /**
     * Draws the Scores in the Canvas
     * @param {number} time
     */
    drawScores(time) {
        this.scores.forEach((score, index) => {
            score.timer += time;
            score.size   = Math.min(0.2 + Math.round(score.timer * 100 / DemoData.chase.scoreInc) / 100, 1);
            
            if (score.timer < DemoData.chase.scoreTime) {
                this.canvas.drawText(score);
            } else {
                this.scores.splice(index, 1);
            }
        });
    }
    
    
    /**
     * Initializes the Players for the Present animation
     */
    initPresent() {
        this.blob = null;
        this.blinky.presentDemo(DemoData.present.dir);
        this.pinky.presentDemo(DemoData.present.dir);
        this.inky.presentDemo(DemoData.present.dir);
        this.clyde.presentDemo(DemoData.present.dir);
        
        this.ghosts   = [ this.blinky ];
        this.others   = [ this.pinky, this.inky, this.clyde ];
        this.count    = 4;
        this.presentX = DemoData.present.tile * Board.tileSize;
        this.exitX    = Board.width + Board.tileSize;
    }
    
    /**
     * The Present Animation
     * @param {number} time
     * @param {number} speed
     */
    presentAnimation(time, speed) {
        if (this.timer <= 0) {
            this.animatePlayers(speed);
            
            if (this.count > 0 && this.ghosts[0].getX() > this.presentX) {
                this.drawName(this.ghosts[0]);
                if (this.others.length) {
                    this.ghosts.unshift(this.others[0]);
                    this.others.shift();
                }
                this.timer  = DemoData.present.timer;
                this.count -= 1;
            
            } else if (this.ghosts[this.ghosts.length - 1].getX() > this.exitX) {
                this.ghosts.pop();
                if (!this.ghosts.length) {
                    this.nextAnimation();
                }
            }
            
        } else {
            this.timer -= time;
        }
    }
    
    /**
     * Draws the Name of the given Ghost
     * @param {Ghost} ghost
     */
    drawName(ghost) {
        this.canvas.drawText({
            size  : 2,
            color : ghost.getBodyColor(),
            text  : "‘" + ghost.getName() + "’",
            pos   : DemoData.present.namePos
        });
    }
    
    
    /**
     * Animates all the players
     * @param {number}   speed
     * @param {?boolean} food
     */
    animatePlayers(speed, food) {
        this.canvas.clearSavedRects();
        
        if (food) {
            this.food.wink();
        }
        this.ghosts.forEach((ghost) => {
            ghost.demoAnimate(speed);
        });
        
        if (this.blob) {
            this.blob.animate(speed);
        }
    }
}
