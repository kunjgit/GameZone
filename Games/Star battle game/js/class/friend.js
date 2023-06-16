class Friend extends Plane{
    
    setup() {
        const { w, h } = config.game;
        super.setup('friend');
        this.y = random(0, h-this.h);
    }

    update() {
        if (this.run) {
            this.move();  
        }
        super.update();
    }
}