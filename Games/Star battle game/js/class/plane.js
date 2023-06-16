class Plane extends Element{ 
    constructor(scene) {
        super(scene);
    }

    setup(obj) {
        super.setup(obj);
        this.bulletCooldown = new Cooldown(config[obj].bulletCooldown);
        this.deathAnimation = new Animation(config.planeDeathAnimation,this.scene);
        this.canFire = true;
    }

    initBullet(bulletType,bulletArray) {
        this.bullet = class bullet extends Bullet{
            setup() {
                super.setup(bulletType);
            }
        }
        this.bullets = bulletArray;
    }

    update() {
        super.update();
        this.bulletCooldown.update().active(() => {
            this.canFire = true;
        });
    }

    move() {
        this.x += this.speed;
    }

    fire() {
        if (!this.canFire) {
            return;
        }
        this.canFire = false;
        const bullet = this.scene.factory(this.bullet);
        const isPlayer = this instanceof Player;
        bullet.x = isPlayer ? this.x + this.w : this.x;
        bullet.y = this.y + this.h/2 - bullet.h/2;
        this.bullets.push(bullet);
    }

    deathing() {
        this.deathAnimation.play({
            x: this.x,
            y: this.y,
            w: this.w,
            h : this.h,
        }).end(() => {
            this.isDeath = true;
        });
    }
}