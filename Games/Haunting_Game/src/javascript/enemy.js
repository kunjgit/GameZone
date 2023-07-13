
class Enemy {
    constructor(drawable, speed, images) {
        this.drawable = drawable;
        this.speed = speed;
        this.images = images;
        this.index = 0;
    }

    // A method used to draw the enemy.
    draw(ctx) {
        this.drawable.drawImage(ctx, this.images[this.index]);
    }

    // A method used to update the enemy's loop behaviour.
    update() {
        this.updateAnimation();
        this.updateMovement();
    }

    // A method used to update the enemy's animation.
    updateAnimation() {
        this.index = (this.index + 1) % this.images.length;
    }

    // A method used to update the enemy's movement.
    updateMovement() {
        this.drawable.x += this.speed;
    }

    // A method used to check if the enemy overlaps with anything.
    overlaps(x, y, w, h) {
        return this.drawable.x < x + w
            && this.drawable.x + this.drawable.w > x
            && this.drawable.y < y + h
            && this.drawable.y + this.drawable.h > y;
    }

    // A method used to create an instance of an enemy
    // without passing an instance of a drawable and images. 
    static create(x, y, w, h, speed, imageSources) {        
        const drawable = new Drawable(x, y, w, h);        
        const images = [];
        for (let i = 0; i < imageSources.length; i++) {
            const image = new Image();
            image.src = imageSources[i];
            images.push(image);
        }

        return new Enemy(drawable, speed, images);
    }
  
    // A method used to create a collection of enemies
    // without passing an instance of a drawable and images. 
    static createCollection(x, y, w, h, minSpeed, maxSpeed, imageSources, noOfEnemies) {
        const enemies = [];
        for (let i = 0; i < noOfEnemies; i++) {
            const randomSpeed = Math.floor(Math.random() * maxSpeed + minSpeed);
            enemies.push(Enemy.create(x, y, w, h, randomSpeed, imageSources));
        }
            
        return enemies;
    }
}