class Star extends Element{
    
    setup() {
        const { w, h } = config.game;
        super.setup('star');
        const size = this.img.width > 100 ? random(10,30)*0.01 : 1;
        this.w = this.img.width * size;
        this.h = this.img.height * size;
        this.speed = -this.w * 0.05;
        this.x = w + this.w;
        this.y = random(0, h - this.h);
        // this.rotateState = true;
        // this.rotateSpeed = -0.4;
    }

    move() {
        this.x += this.speed;
    }

    update() {
        this.move();
        super.update();
    }
}