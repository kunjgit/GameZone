import Bullet from "./bulletorigin.js";
export default class bulletControl{
    bullets=[];
    nextBullet=0;

    constructor(canvas,maxBullets , bulletColor , soundEnabled)
    {
        this.canvas = canvas;
        this.maxBullets = maxBullets;
        this.bulletColor = bulletColor;
        this.soundEnabled = soundEnabled;

        this.shootSound = new Audio("sounds/shoot.wav")
        this.shootSound.volume = 0.2;
    }

    draw(ctx) {
        this.bullets = this.bullets.filter(bullet => bullet.y +bullet.width >0 && bullet.y <= this.canvas.height)
        this.bullets.forEach((bullet) => bullet.draw(ctx));
        if(this.nextBullet>0)
        {
            this.nextBullet--;
        }
    }

    collideWith(sprite){
        const bulletHit = this.bullets.findIndex(bullet => bullet.collideWith(sprite));

        if(bulletHit>=0){
            this.bullets.splice(bulletHit, 1);
            return true;
        }
    }

    shoot(x,y,velocity,nextBullet=0){
       if(this.nextBullet<=0 && this.bullets.length < this.maxBullets )
       {
        const bullet = new Bullet(this.canvas,x,y,velocity,this.bulletColor);
        this.bullets.push(bullet);
        if(this.soundEnabled)
        {
            this.shootSound.currentTime =0;
            this.shootSound.play();
        }
        this.nextBullet = nextBullet;
       }
    }
}