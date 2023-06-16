class Bullet extends Element{
    setup(bulletType) {
        super.setup(bulletType);
        this.deathAnimation = new Animation(config.bulletDeathAnimation, this.scene);
    }

    update() {
        if (this.run) {
            this.move();
        }
        super.update();
    }

    move() {
        this.x += this.speed;
    }

    deathing() {
        this.deathAnimation.play({
            x: this.x,
            y: this.y,
            w: this.w,
            h : this.h * 1.5,
        }).end(() => {
            this.isDeath = true;
        });
    }
}