const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let selectedTowerType = null;
let towers = [];
let enemies = [];
let projectiles = [];
let frame = 0;
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;

// Set the selected tower type
function setTowerType(type) {
    selectedTowerType = type;
    console.log(`Selected Tower Type: ${selectedTowerType}`);
}

// Handle canvas click for placing towers
canvas.addEventListener('click', (event) => {
    if (selectedTowerType) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        towers.push(new Tower(x, y, selectedTowerType));
        console.log(`Placed ${selectedTowerType} at (${x}, ${y})`);
        selectedTowerType = null; // Reset the selected tower type after placing
    }
});

// Show slide
function showSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    document.getElementById(`slide-${slideNumber}`).classList.add('active');
}

// Start game and hide slides
function startGame() {
    document.getElementById('slides').style.display = 'none';
    document.getElementById('game-info').style.display = 'flex';
    init();
}

// Restart game
function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    score = 0;
    lives = 3;
    level = 1;
    gameOver = false;
    towers = [];
    enemies = [];
    projectiles = [];
    frame = 0;
    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;
    document.getElementById('level').innerText = level;
    init();
}

// Tower Types
const towerTypes = {
    BASIC: 'Basic Tower',
    SNIPER: 'Sniper Tower',
    RAPID_FIRE: 'Rapid Fire Tower',
    SPLASH_DAMAGE: 'Splash Damage Tower'
};

// Enemy Types
const enemyTypes = {
    BASIC: 'Basic Enemy',
    FAST: 'Fast Enemy',
    TANK: 'Tank Enemy',
    FLYING: 'Flying Enemy'
};

// Tower class
class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.range = 100;
        this.attackSpeed = 60; // Frames per attack
        this.damage = 10;
        this.lastAttackFrame = 0;

        if (type === towerTypes.SNIPER) {
            this.range = 200;
            this.damage = 30;
            this.attackSpeed = 120;
        } else if (type === towerTypes.RAPID_FIRE) {
            this.range = 80;
            this.damage = 5;
            this.attackSpeed = 20;
        } else if (type === towerTypes.SPLASH_DAMAGE) {
            this.range = 100;
            this.damage = 20;
            this.attackSpeed = 90;
        }
    }

    draw() {
        if (this.type === towerTypes.BASIC) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === towerTypes.SNIPER) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
        } else if (this.type === towerTypes.RAPID_FIRE) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - 15);
            ctx.lineTo(this.x + 15, this.y + 15);
            ctx.lineTo(this.x - 15, this.y + 15);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === towerTypes.SPLASH_DAMAGE) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    attack() {
        if (frame - this.lastAttackFrame >= this.attackSpeed) {
            this.lastAttackFrame = frame;
            let target = null;

            for (let enemy of enemies) {
                const distance = Math.hypot(this.x - enemy.x, this.y - enemy.y);
                if (distance <= this.range) {
                    target = enemy;
                    break;
                }
            }

            if (target) {
                projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.type));
            }
        }
    }
}

// Enemy class
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = 100;
        this.speed = 1;
        this.radius = 10;

        if (type === enemyTypes.FAST) {
            this.health = 50;
            this.speed = 2;
        } else if (type === enemyTypes.TANK) {
            this.health = 300;
            this.speed = 0.5;
        } else if (type === enemyTypes.FLYING) {
            this.health = 70;
            this.speed = 1.5;
            this.radius = 5;
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.x += this.speed;

        // Check if the enemy reaches the end of the canvas (or designated exit point)
        if (this.x >= canvas.width) {
            this.x = canvas.width;
            lives -= 1;
            this.health = 0;
            if (lives <= 0) {
                endGame();
            }
        }
    }
}

// Projectile class
class Projectile {
    constructor(x, y, target, damage, type) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.type = type;
        this.speed = 4;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += this.speed * Math.cos(angle);
        this.y += this.speed * Math.sin(angle);

        // Check if the projectile hits the target
        const distance = Math.hypot(this.x - this.target.x, this.y - this.target.y);
        if (distance < this.target.radius) {
            this.target.health -= this.damage;
            if (this.target.health <= 0) {
                const index = enemies.indexOf(this.target);
                if (index > -1) {
                    enemies.splice(index, 1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                }
            }
            const index = projectiles.indexOf(this);
            if (index > -1) {
                projectiles.splice(index, 1);
            }
        }
    }
}

function init() {
    updateGameInfo();
    spawnEnemies();
    animate();
}

function updateGameInfo() {
    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;
    document.getElementById('level').innerText = level;
}

function endGame() {
    gameOver = true;
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('game-over').classList.add('visible');
}

function spawnEnemies() {
    const spawnInterval = 60; // Adjust this value for difficulty
    if (frame % spawnInterval === 0) {
        const type = Object.values(enemyTypes)[Math.floor(Math.random() * Object.values(enemyTypes).length)];
        enemies.push(new Enemy(0, Math.random() * canvas.height, type));
    }
}

function animate() {
    if (gameOver) return;
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update towers
    towers.forEach(tower => {
        tower.draw();
        tower.attack();
    });

    // Draw and update enemies
    enemies.forEach(enemy => {
        enemy.draw();
        enemy.update();
    });

    // Draw and update projectiles
    projectiles.forEach(projectile => {
        projectile.draw();
        projectile.update();
    });

    // Check for next level
    if (enemies.length === 0) {
        level++;
        document.getElementById('level').innerText = level;
        spawnEnemies();
    }

    requestAnimationFrame(animate);
}
