class Enemy extends Plane{
    
    setup() {
        const { w, h } = config.game;
        super.setup('enemy');
        this.y = random(0, h-this.h);
        this.initBullet('enemyBullet', this.scene.enemyBullets);
    }

    update() {
        if (this.run) {
            this.move();  
            if (this.isEnter()) {
                this.fire();
            }
        }
        super.update();
    }
}