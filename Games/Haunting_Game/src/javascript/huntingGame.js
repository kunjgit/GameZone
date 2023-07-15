
class HuntingGame {
    constructor(canvas, ctx, enemies, weapon, bulletParticleSystems, shootParticleSystems, frameRate, maxActive, enemyMaxY, maxMisses, bggImage) {        
        this.canvas = canvas;
        this.ctx = ctx;
        this.weapon = weapon;
        this.bulletParticleSystems = bulletParticleSystems;
        this.shootParticleSystems = shootParticleSystems;
        this.frameRate = frameRate;
        this.enemies = enemies;
        this.maxActive = maxActive;
        this.enemyMaxY = enemyMaxY;
        this.maxMisses = maxMisses;
        this.bggImage = bggImage;
        this.initialize();               
    }
    
    // A method used to initialize the game.
    initialize() {
        this.gameOver = false;
        this.misses = 0;        
        this.activeEnemies = [];   
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseW = 25;
        this.mouseH = 25;     
        this.score = 0;
    }

    // A method used to start the game.
    start() {
        document.addEventListener('mousemove', this.mousemove.bind(this));
        document.addEventListener('keydown', this.keydown.bind(this));
        setInterval(this.update.bind(this), this.frameRate);
    }
    
    // A method used to track the mouse position
    mousemove(event) {
        this.mouseX = event.pageX;
        this.mouseY = event.pageY;
    }

    // A method used to track keydown events.
    keydown(event) {
        if (event.code == "Space") {
            if (this.gameOver)
                this.initialize();
            else if (this.weapon.shoot()) {
                this.showBulletParticle();
                this.showShootParticle();
                this.hitCheck();
            }
        }
    }

    // A method used to update continuous behavior.
    update() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBggImage();
        this.drawMissesAndScore();
        
        
        this.weapon.draw(this.ctx);

        if (this.gameOver) {
            this.drawGameOver();
        } else {
            this.updateActiveEnemies();
            this.trySpawnEnemy();

            // check if the game should end.
            if (this.misses >= this.maxMisses) {
                this.gameOver = true;
            }
        }

        this.drawReticle();
        this.drawParticles();
    }

    drawBggImage() {
        this.ctx.beginPath();
        this.ctx.drawImage(this.bggImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();
    }

    drawReticle() {
        const x = (this.mouseX - this.mouseW / 2);
        const y = (this.mouseY - this.mouseH / 2);
        this.ctx.beginPath();
        this.ctx.rect(x - this.mouseW / 2, y, this.mouseW, 2);
        this.ctx.rect(x, y - this.mouseH / 2, 2, this.mouseH);
        this.ctx.fill();
        this.ctx.closePath();
    }

    // A method used to draw the game's misses and current score.
    drawMissesAndScore() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(`SCORE: ${this.score}`, 10, 20);
        this.ctx.fillText(`MISSES: ${this.misses}/${this.maxMisses}`, 10, 35);
        this.ctx.closePath();
    }

    // A method used to draw the game over text
    drawGameOver() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("GAME OVER", this.canvas.width/2-30, this.canvas.height/2);
        this.ctx.closePath();
    }

    // A method used to draw the game's particles.
    drawParticles() {
        // draw bullet particles
        for (let i = 0; i < this.bulletParticleSystems.length; i++) {
            if (this.bulletParticleSystems[i].isActive) {
                this.bulletParticleSystems[i].draw(this.ctx);
            }
        }

        // draw shoot particles
        for (let i = 0; i < this.shootParticleSystems.length; i++) {
            if (this.shootParticleSystems[i].isActive) {
                this.shootParticleSystems[i].draw(this.ctx);
            }
        }
    }
    
    // A method used to draw enemies, execute their update behavior,
    // and remove them when they leave the scene.
    updateActiveEnemies() {
        for (let i = this.activeEnemies.length - 1; i > -1; i--) {
            this.activeEnemies[i].draw(this.ctx);
            this.activeEnemies[i].update();
            // If the 'enemy' is not visible within the scene,
            // remove it from the active list.
            const leftBoundary = -this.activeEnemies[i].drawable.w;
            const rightBoundary = this.canvas.width + this.activeEnemies[i].drawable.w;
            if (this.activeEnemies[i].drawable.x < leftBoundary ||
                this.activeEnemies[i].drawable.x > rightBoundary) {
                this.activeEnemies.splice(i, 1);
                this.misses++;
            }
        }        
    }
    
    // A method used to spawn an enemy.
    trySpawnEnemy() {
        // Don't allow to spawn enemies, if the current
        // number of active equals max active.
        if (this.activeEnemies.length == this.maxActive)
            return;

        // Find inactive enemies.
        const inactiveEnemies = [];
        for (let i = 0; i < this.enemies.length; i++)
            if (!this.activeEnemies.includes(this.enemies[i]))
                inactiveEnemies.push(this.enemies[i]);
        
        // If no inactive enemy was found,
        // stop the spawn behaviour.
        if (inactiveEnemies.length == 0)
            return;

        // Get random enemy.
        const index = Math.floor(Math.random() * inactiveEnemies.length);
        const enemy = inactiveEnemies[index];
        
        // Set position
        enemy.drawable.x = -enemy.drawable.w;
        enemy.drawable.y = Math.floor(Math.random() * this.enemyMaxY);        

        // Add to active list.
        this.activeEnemies.push(enemy);
    }

    // A method used to calculate hit position.
    getHitPosition() {
        return {
            x: (this.mouseX - this.mouseW),
            y: (this.mouseY - this.mouseH)
        }
    }

    // A method used to check if one of the active enemies
    // was hit by a bullet, and if it is the case,
    // the 'enemy' is removed from the active list,
    // and the score is increased.
    hitCheck() {        
        const hitPosition = this.getHitPosition();
        for (let i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].overlaps(hitPosition.x, hitPosition.y, this.mouseW, this.mouseH)) {
                this.activeEnemies.splice(i, 1);
                this.score += 1;
            }
        }            
    }

    // A method used to show a bullet particle at the mouse's position.
    showBulletParticle() {
        const x = (this.mouseX - this.mouseW / 2);
        const y = (this.mouseY - this.mouseH / 2);
        for (let i = 0; i < this.bulletParticleSystems.length; i++) {
            if (!this.bulletParticleSystems[i].isActive) {
                this.bulletParticleSystems[i].setPosition(x,y);
                this.bulletParticleSystems[i].play();
                break;
            }
        }
    }

    // A method used to show a bullet particle at the weapon's position.
    showShootParticle() {
        const offset = 20;
        const x = this.weapon.drawable.x + offset;
        const y = this.weapon.drawable.y;
        for (let i = 0; i < this.shootParticleSystems.length; i++) {
            if (!this.shootParticleSystems[i].isActive) {
                this.shootParticleSystems[i].setPosition(x, y);
                this.shootParticleSystems[i].play();
                break;
            }
        }
    }
    
    // A method used to create an instance of a hunting game,
    // without passing a canvas and CanvasRenderingContext2D.
    static create(id, enemies, weapon, bulletParticleSystems, shootParticleSystems, frameRate, maxActive, enemyMaxY, maxMisses, bggSource) {
        const bggImage = new Image();
        bggImage.src = bggSource;
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        return new HuntingGame(canvas, ctx, enemies, weapon, bulletParticleSystems, shootParticleSystems, 
            frameRate, maxActive, enemyMaxY, maxMisses, bggImage);
    }
}