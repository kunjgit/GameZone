
class ParticleSystem {
    constructor(drawables, playSpeed, playTime) {
        this.drawables = drawables;
        this.playSpeed = playSpeed;
        this.playTime = playTime;        
        this.isActive = false;
    }

    // A method used to draw the particle's drawables.
    draw(ctx) {
        for (let i = 0; i < this.drawables.length; i++)
            this.drawables[i].drawRect(ctx);
    }

    // A method used to play the particle.
    play() {
        if (this.isActive)
            return;

        this.isActive = true;
        this.timer = 0;
        this.interval = setInterval(this.loop.bind(this), this.playSpeed);
        setTimeout(this.end.bind(this), this.playTime);
    }

    // The particle's loop behaviour.
    loop() {        
        console.log('Not implemented yet!');
    }

    // A method used to end the particle's loop.
    end() {
        if (!this.isActive)
            return;

        this.isActive = false;
        clearInterval(this.interval);        
    }

    // A method used to change the particle's position
    setPosition(x, y) {
        for (let i = 0; i < this.drawables.length; i++) {
            this.drawables[i].x = x;
            this.drawables[i].y = y;
        }
    }

    // A method used to create drawables for the particle system
    static createDrawables(x, y, w, h, noOfDrawables, colors) {
        const drawables = [];
        for (let i = 0; i < noOfDrawables; i++) {
            const colorIndex = Math.floor(Math.random() * colors.length);            
            const drawable = new Drawable(x, y, w, h);
            drawable.fillStyle = colors[colorIndex];
            drawable.strokeStyle = colors[colorIndex];
            drawables.push(drawable);
        }
        return drawables;
    }
}
