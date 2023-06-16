class Element{
    constructor(scene) {
        this.scene = scene;
        this.run = true;
        this.enter = false;
        this.isDeath = false;
        this.life = 1;
        this.deg = 0;
        this.rotateState = false;
        this.rotateSpeed = 2;
        this.textRise = 15;
        this.text = "text";
    }

    setup(obj) {
        const _obj = config[obj];
        Object.keys(_obj).map((key) => {
            if (key === 'img') {
                if (isArray(_obj[key])) {
                    this.img = res.imageBy(randomArrayItem(_obj[key]));
                    return;
                }
                this.img = res.imageBy(_obj[key]);
                return;
            }
            this[key] = _obj[key]; 
        });
        if (this.animation){

            this.animation = Object.assign({
                img : this.img,
            },this.animation);

            this.runAnimation = new Animation(this.animation,this.scene,true);
        }
    }

    update() {
        this.run ? this.draw() : this._deathing();
        this.limitDetection();
    }

    limitDetection() {
        if (this.isEnter()) {
            this.enter = true;
        }
        if (this.enter) {
            if (this.isOut()) {
                this.isDeath = true; 
            } 
        }
    }

    getDrawInfo(isRotate=false) {
        return [
            this.img,
            isRotate ? -this.w/2 :this.x,
            isRotate ? -this.h/2 :this.y,
            this.w,
            this.h,
        ]
    }

    draw() {
        if (this.rotateState) {
            return this.rotate();
        }
        if (this.runAnimation){
            return this.runAnimation.play({
                x: this.x,
                y: this.y,
                w: this.w,
                h : this.h,
            });
        }
        this.scene.draw(this.getDrawInfo());
    } 

    drawText(callback) {
        this.setInitY();
        this.scene.setFontStyle();
        this.y--;
        this.scene.drawText({
            text: this.text,
            x: this.x,
            y : this.y,
        })
        if (this.initY - this.y > this.textRise) {
            callback && callback();
        }
    }

    rotate() {
        this.deg+=this.rotateSpeed;
        this.scene.rotateDraw({
            deg: this.deg,
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
            data: this.getDrawInfo(true),
        })
    }

    reduceLife() {
        this.life--;
        if (this.life <= 0) {
            this.death();
        }
    }

    death() {
        this.run = false; 
    }

    _deathing() {
        if (this.deathing) {
            this.deathing();
            return;
        }
        this.isDeath = true;
    }

    setInitY() {
        if (this.initY) {
            return;
        }
        this.initY = this.y;
    }

    isEnter() {
        const { w, h } = config.game;
        return (
            this.x > 0 &&
            this.y > 0 &&
            this.x < w &&
            this.y < h
        );
    }

    isOut() {
        const { w, h } = config.game;
        return (
            this.x < -this.w ||
            this.y < -this.h ||
            this.x > w ||
            this.y > h
        );
    }
    
}