
class ShootParticleSystem extends ParticleSystem {
    
    constructor(drawables, playSpeed, playTime, spread, speed) {
        super(drawables, playSpeed, playTime);
        this.spread = spread;
        this.speed = speed;
    }

    loop() {
        for (let i = 0; i < this.drawables.length; i++) {
            this.drawables[i].x += Math.sin(i) * Math.floor(Math.random() * this.spread - this.spread);
            this.drawables[i].y -= Math.floor(Math.random() * this.speed);
        }
    }

    // A method that can be used to create an instance of a particle system,
    // without passing an array of drawables.
    static create(x, y, w, h, playSpeed, playTime, noOfDrawables, colors, spread, speed) {
        const drawables = ParticleSystem.createDrawables(x, y, w, h, noOfDrawables, colors);            
        return new ShootParticleSystem(drawables, playSpeed, playTime, spread, speed);
    }
    
    // A method that can be used to create a collection of instances of particle systems,
    // without passing an array of drawables.
    static createCollection(x, y, w, h, playSpeed, playTime, noOfDrawables, colors, noOfParticles, spread, speed) {
        const particles = [];
        for (let i = 0; i < noOfParticles; i++)
            particles.push(ShootParticleSystem.create(x, y, w, h, playSpeed, 
                playTime, noOfDrawables, colors, spread, speed));
            
        return particles;
    }
}