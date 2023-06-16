class Fuel extends Plane{
    
    setup() {
        const { w, h } = config.game;
        super.setup('fuel');
        this.x = random(0, w / 2);
        this.rotateState = true;
        this.rotateSpeed = 0.5;
        this.textRise = 20;
        this.text = "+15";
    }

    move() {
        this.y -= this.speed;
    }

    update() {
        if (this.run) {
            this.move();
        }
        super.update();
    }  

    deathing() {
        this.drawText(() => {
            this.isDeath = true;
        }); 
    }
}