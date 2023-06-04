/**
 * The Fruit Class
 */
class Fruit {
    
    /**
     * The Fruit constructor
     */
    constructor() {
        this.ctx   = Board.boardCanvas.context;
        this.timer = 0;
    }
    
    
    /**
     * Try to add a fruit in the board
     * @param {number} dotsLeft
     */
    add(dotsLeft) {
        if (dotsLeft === Data.fruitDots1 || dotsLeft === Data.fruitDots2) {
            this.timer = Data.fruitTime;
            this.draw(Board.fruitTile);
        }
    }
    
    /**
     * Reduces the fruit timer when there is one
     * @param {number} time
     */
    reduceTimer(time) {
        if (this.timer > 0) {
            this.timer -= time;
            if (this.timer <= 0) {
                this.eat();
            }
        }
    }
    
    /**
     * Eats the Fruit
     */
    eat() {
        this.clear();
        this.timer = 0;
    }
    
    /**
     * Returns true if the given tile is at the fruit position
     * @param {{x: number, y: number}}
     * @return {boolean}
     */
    isAtPos(tile) {
        if (this.timer > 0) {
            let rect = Board.getFruitRect(),
                pos  = Board.tileToPos(tile);
            
            return (
                pos.x >= rect.left && pos.x <= rect.right &&
                pos.y >= rect.top  && pos.y <= rect.bottom
            );
        }
        return false;
    }
    
    
    /**
     * Draws a Fruit
     * @param {{x: number, y: number}}
     */
    draw(tile) {
        let pos = Board.tileToPos(tile);
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this["draw" + Data.getFruitName()]();
        this.ctx.restore();
    }
    
    /**
     * Clears the Fruit
     */
    clear() {
        let pos = Board.fruitPos;
        this.ctx.clearRect(pos.x - 1, pos.y - 1, Board.fruitSize, Board.fruitSize);
    }
    
    
    /**
     * Draws the Cherries Fruit
     */
    drawCherries() {
        this.ctx.fillStyle = "rgb(255, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(10, 14, 4, 0, 2 * Math.PI);
        this.ctx.arc(4, 10, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(8, 15.5, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(1.5, 11, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(0, 153, 0)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(17, 1);
        this.ctx.quadraticCurveTo(9, 1, 5, 9);
        this.ctx.moveTo(17, 1);
        this.ctx.quadraticCurveTo(12, 3, 10, 12);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgb(222, 151, 81)";
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(17, 1);
        this.ctx.lineTo(16, 2);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Strawberry Fruit
     */
    drawStrawberry() {
        let dots = [ 3, 7, 5, 6, 4, 10, 7, 8, 6, 11, 7, 13, 9, 10, 9, 14, 10, 12, 11, 8, 12, 11, 14, 6, 14, 9 ];
        
        this.ctx.fillStyle = "rgb(222, 0, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(9, 3);
        this.ctx.quadraticCurveTo(17, 3, 17, 7);
        this.ctx.quadraticCurveTo(17, 14, 9, 17);
        this.ctx.quadraticCurveTo(1, 14, 1, 7);
        this.ctx.quadraticCurveTo(1, 3, 9, 3);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(0, 222, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(5, 3);
        this.ctx.lineTo(13, 3);
        this.ctx.lineTo(14, 4);
        this.ctx.lineTo(9, 7);
        this.ctx.lineTo(4, 4);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(8, 0, 2, 4);
        
        for (let i = 0; i < dots.length; i += 2) {
            this.ctx.fillRect(dots[i], dots[i + 1], 1, 1);
        }
    }
    
    /**
     * Draws the Peach Fruit
     */
    drawPeach() {
        this.ctx.fillStyle = "rgb(255, 181, 33)";
        this.ctx.beginPath();
        this.ctx.arc(6, 10, 5, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(12, 10, 5, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(10, 11, 7, 0, 0.5 * Math.PI, false);
        this.ctx.arc(8, 11, 7, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(0, 222, 0)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(6, 5);
        this.ctx.lineTo(14, 4);
        this.ctx.moveTo(14, 0);
        this.ctx.quadraticCurveTo(11, 0, 10, 7);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Apple Fruit
     */
    drawApple() {
        this.ctx.fillStyle = "rgb(222, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(6, 8, 5, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(12, 8, 5, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(10, 11, 7, 0, 0.5 * Math.PI, false);
        this.ctx.arc(13, 15, 3, 0.5 * Math.PI, Math.PI, false);
        this.ctx.arc(6, 15, 3, 0, 0.5 * Math.PI, false);
        this.ctx.arc(8, 11, 7, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(0, 222, 0)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.arc(3, 7, 7, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(13, 4, 4, Math.PI, 1.5 * Math.PI, false);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(7, 9, 4, Math.PI, 1.5 * Math.PI, false);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Grapes Fruit
     */
    drawGrapes() {
        this.ctx.fillStyle = "rgb(0, 222, 0)";
        this.ctx.beginPath();
        this.ctx.arc(9, 11, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(74, 74, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(9, 4);
        this.ctx.lineTo(2, 11);
        this.ctx.lineTo(7, 16);
        this.ctx.moveTo(14, 6);
        this.ctx.lineTo(8, 12);
        this.ctx.lineTo(14, 18);
        this.ctx.moveTo(9, 6);
        this.ctx.lineTo(15, 12);
        this.ctx.lineTo(10, 17);
        this.ctx.moveTo(10, 14);
        this.ctx.lineTo(4, 18);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgb(222, 148, 74)";
        this.ctx.beginPath();
        this.ctx.moveTo(4, 0);
        this.ctx.lineTo(5, 1);
        this.ctx.lineTo(12, 1);
        this.ctx.moveTo(9, 1);
        this.ctx.lineTo(9, 4);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Galaxian Fruit
     */
    darwGalaxian() {
        this.ctx.fillStyle   = "rgb(255, 250, 55)";
        this.ctx.strokeStyle = "rgb(255, 250, 55)";
        this.ctx.beginPath();
        this.ctx.moveTo(1, 4);
        this.ctx.lineTo(17, 4);
        this.ctx.lineTo(9, 11);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(9, 11);
        this.ctx.lineTo(9, 18);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(1, 1);
        this.ctx.lineTo(1, 6);
        this.ctx.lineTo(8, 12);
        this.ctx.moveTo(17, 1);
        this.ctx.lineTo(17, 6);
        this.ctx.lineTo(10, 12);
        this.ctx.stroke();
        
        this.ctx.fillStyle   = "rgb(255, 0, 0)";
        this.ctx.strokeStyle = "rgb(255, 0, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(3, 5);
        this.ctx.lineTo(9, 0);
        this.ctx.lineTo(15, 5);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(9, 3);
        this.ctx.lineTo(9, 6);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Bell Fruit
     */
    drawBell() {
        this.ctx.fillStyle = "rgb(255, 255, 33)";
        this.ctx.beginPath();
        this.ctx.moveTo(1, 15);
        this.ctx.quadraticCurveTo(1, 1, 9, 1);
        this.ctx.quadraticCurveTo(17, 1, 17, 15);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(0, 222, 222)";
        this.ctx.fillRect(3, 14, 12, 3);
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(9, 14, 3, 3);
        
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(8, 4);
        this.ctx.quadraticCurveTo(4, 4, 4, 13);
        this.ctx.stroke();
    }
    
    /**
     * Draws the Key Fruit
     */
    drawKey() {
        this.ctx.fillStyle = "rgb(0, 222, 222)";
        this.ctx.beginPath();
        this.ctx.arc(6, 3, 3, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(12, 3, 3, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(12, 5, 3, 0, 0.5 * Math.PI, false);
        this.ctx.arc(6, 5, 3, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        this.ctx.clearRect(6, 2, 6, 2);
        
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(8, 8);
        this.ctx.lineTo(8, 15);
        this.ctx.arc(9.5, 13.5, 1.5, Math.PI, 0, true);
        this.ctx.lineTo(11, 8);
        this.ctx.moveTo(11, 10);
        this.ctx.lineTo(14, 10);
        this.ctx.moveTo(11, 13);
        this.ctx.lineTo(14, 13);
        this.ctx.stroke();
    }
}
