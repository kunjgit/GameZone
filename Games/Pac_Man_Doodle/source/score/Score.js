/**
 * The Score Class
 */
class Score {
    
    /**
     * The Score constructor
     */
    constructor() {
        this.canvas = Board.boardCanvas;
        this.ctx    = this.canvas.context;
        
        this.score  = 0;
        this.level  = 1;
        this.lives  = 2;
        this.bonus  = 0;
        this.ghosts = 0;
        
        this.textTop     = 32.5;
        this.scoreLeft   = 3.2;
        this.livesLeft   = 16.3;
        this.scoreMargin = 0.5;
        this.scoreWidth  = 7;
        this.scoreHeight = 2;
        this.scoreColor  = "rgb(255, 255, 51)";
        this.fruitTile   = { x: 26, y: 31.5 };
        
        this.blobs = [ new ScoreBlob(0), new ScoreBlob(1) ];
        this.food  = new Fruit();
    }
    
    
    /**
     * Draws the Score, Blobs and Fruit in the board
     */
    draw() {
        this.drawTexts();
        this.drawScore();
        
        this.blobs.forEach(function (blob) {
            blob.draw();
        });
        this.food.draw(this.fruitTile);
    }
    
    
    /**
     * Increases the game score by the given amount
     * @param {number} amount
     */
    incScore(amount) {
        this.score += amount;
        if (this.score > Data.extraLife * Math.pow(10, this.bonus)) {
            if (this.lives < 4) {
                this.incLife(true);
            }
            this.bonus += 1;
        }
        this.drawScore();
    }
    
    /**
     * Increases/Decreases the game lives depending on the param
     * @param {boolean} isIncrease
     */
    incLife(isIncrease) {
        this.lives += isIncrease ? 1 : -1;
        
        if (isIncrease) {
            let blob = new ScoreBlob(this.lives - 1);
            this.blobs.push(blob);
            blob.draw();
        } else if (this.blobs.length) {
            let blob = this.blobs.pop();
            blob.clear();
        }
    }
    
    
    /**
     * Increases the game level
     */
    newLevel() {
        this.level += 1;
        this.ghosts = 0;
        Data.level  = this.level;
    }
    
    /**
     * The Blob ate a pill/energizer
     * @param {number} value
     */
    pill(value) {
        this.incScore(value * Data.pillMult);
    }
    
    /**
     * The Blob ate a fruit
     * @return {number}
     */
    fruit() {
        let score = Data.getLevelData("fruitScore");
        this.incScore(score);
        return score;
    }
    
    /**
     * The Blob kill a Ghost
     * @param {number} amount
     * @return {number}
     */
    kill(amount) {
        var score = Data.getGhostScore(amount);
        this.incScore(score);
        
        if (amount === 4) {
            this.ghosts += 1;
            if (this.ghosts === 4) {
                this.incScore(Data.eyesBonus);
            }
        }
        return score;
    }
    
    /**
     * The Blob died, decrease the lifes
     * @return {boolean} True on Game Over
     */
    died() {
        this.incLife(false);
        return this.lives >= 0;
    }
    
    
    /**
     * Draws the texts in the board
     */
    drawTexts() {
        this.canvas.drawText({
            text : "Score",
            size : 1.8,
            pos  : { x: this.scoreLeft, y: this.textTop }
        });
        this.canvas.drawText({
            text : "Lives",
            size : 1.8,
            pos  : { x: this.livesLeft, y: this.textTop }
        });
    }
    
    /**
     * Draws the score in the board
     */
    drawScore() {
        let left   = this.ctx.measureText("Score").width,
            margin = this.scoreMargin * Board.tileSize,
            top    = this.textTop     * Board.tileSize,
            width  = this.scoreWidth  * Board.tileSize + margin / 2,
            height = this.scoreHeight * Board.tileSize;
        
        this.ctx.save();
        this.ctx.fillStyle = this.scoreColor;
        this.ctx.textAlign = "left";
        this.ctx.font      = "1.8em 'Whimsy TT'";
        this.ctx.clearRect(left + margin / 2, top - height / 2 - 2, width, height + 2);
        this.ctx.fillText(this.score, left + margin, top);
        this.ctx.restore();
    }
    
    
    /**
     * Returns the current level
     * @return {number}
     */
    getLevel() {
        return this.level;
    }
    
    /**
     * Returns the current score
     * @return {number}
     */
    getScore() {
        return this.score;
    }
}
