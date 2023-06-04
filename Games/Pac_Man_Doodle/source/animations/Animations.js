/**
 * The Animations Manager Class
 */
class Animations {
    
    /**
     * The Animations Manager constructor
     */
    constructor() {
        this.canvas     = Board.screenCanvas;
        this.animations = [];
    }
    
    /**
     * Returns true if there is an animation
     */
    isAnimating() {
        return this.animations.length &&
            this.animations.some((anim) => anim.blocksGameLoop());
    }
    
    /**
     * Animates the current animation, if possible
     * @param {number} time
     */
    animate(time) {
        if (this.animations.length) {
            this.animations.forEach((animation, index, object) => {
                animation.incTimer(time);
                if (animation.isAnimating()) {
                    animation.animate();
                } else {
                    animation.onEnd();
                    object.splice(index, 1);
                }
            });
        }
    }
    
    /**
     * Ends all the Animations
     */
    endAll() {
        this.animations.forEach((anim) => anim.onEnd());
        this.animations = [];
    }
    
    /**
     * Adds a new animation
     * @param {Animation} animation
     */
    add(animation) {
        this.animations.push(animation);
    }
    
    
    
    /**
     * Creates the Ready Animation
     * @param {function} callback
     */
    ready(callback) {
        this.add(new ReadyAnimation(this.canvas, callback));
    }
    
    /**
     * Creates the Paused Animation
     */
    paused() {
        this.add(new PausedAnimation(this.canvas));
    }
    
    /**
     * Creates the Blob's Death Animation
     * @param {Blob}     blob
     * @param {function} callback
     */
    death(blob, callback) {
        this.add(new DeathAnimation(this.canvas, blob, callback));
    }
    
    /**
     * Creates the Game Over Animation
     * @param {function} callback
     */
    gameOver(callback) {
        this.add(new GameOverAnimation(this.canvas, callback));
    }
    
    /**
     * Creates the Ghost Score Animation
     * @param {string} text
     * @param {{x: number, y: number}} pos
     */
    ghostScore(score, pos) {
        this.add(new GhostScoreAnimation(this.canvas, score, pos));
    }
    
    /**
     * Creates the Fruit Score Animation
     * @param {string} text
     * @param {{x: number, y: number}} pos
     */
    fruitScore(score, pos) {
        this.add(new FruitScoreAnimation(this.canvas, score, pos));
    }
    
    /**
     * Creates the End Level Animation
     * @param {function} callback
     */
    endLevel(callback) {
        this.add(new EndLevelAnimation(callback));
    }
    
    /**
     * Creates the New Level Animation
     * @param {number}   level
     * @param {function} callback
     */
    newLevel(level, callback) {
        this.add(new NewLevelAnimation(this.canvas, level, callback));
    }
}
