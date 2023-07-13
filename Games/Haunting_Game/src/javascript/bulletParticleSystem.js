
class BulletParticleSystem extends ParticleSystem {
    
    constructor(drawables, playSpeed, playTime) {
        super(drawables, playSpeed, playTime);
    }

    loop() {        
        for (let i = 0; i < this.drawables.length; i++) {                
            this.drawables[i].x += Math.sin(i);
            this.drawables[i].y += Math.cos(i);
        }
    }

    // A method that can be used to create an instance of a bullet particle system,
    // without passing an array of drawables.
    static create(x, y, w, h, playSpeed, playTime, noOfDrawables, colors) {
        const drawables = ParticleSystem.createDrawables(x, y, w, h, noOfDrawables, colors);        
        return new BulletParticleSystem(drawables, playSpeed, playTime);
    }
    
    // A method that can be used to create a collection of instances of bullet particle systems,
    // without passing an array of drawables.
    static createCollection(x, y, w, h, playSpeed, playTime, noOfDrawables, colors, noOfParticles) {
        const particles = [];
        for (let i = 0; i < noOfParticles; i++)
            particles.push(BulletParticleSystem.create(x, y, w, h, playSpeed, playTime, noOfDrawables, colors));
            
        return particles;
    }
}