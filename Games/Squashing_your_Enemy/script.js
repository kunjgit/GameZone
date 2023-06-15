//1. Creating player
//2. Creating Projectiles

const canvas = document.querySelector('canvas');
const score_element = document.querySelector('#score');
const pointscard = document.querySelector('#pointscard');
const startgame = document.querySelector('#startgame');
const pointscardscore = document.querySelector('#pointscardscore');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Getting Canvas Context
const context = canvas.getContext('2d');

class Player {
    //Properties of player : colour, position, radius
    // constructor()
    // {
    //     this.x = canvas.width/2;
    //     this.y = canvas.height/2;
    //     this.radius = 50;
    //     this.color = 'red';
    // }
    constructor(x,y,radius,color)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    //Method to draw player
    draw()
    {
        context.beginPath();
        //context.arc(x,y,radius,startAngle,endAngle,anticlockwise)
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Projectile{
    //Properties of projectile : colour, position, radius, velocity as it's moving
    constructor(x,y,radius,color,velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        /*
        For velocity we need to know the direction of the projectile
        angle is requried to calculate the velocity
        Trigonometry is used to calculate the velocity
         */
    }

    draw()
    {
        context.beginPath();
        //context.arc(x,y,radius,startAngle,endAngle,anticlockwise)
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle = this.color;
        context.fill();
    }
    
    update()
    {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}

class Enemy{
    //Properties of enemy : colour, position, radius, velocity as it's moving
    constructor(x,y,radius,color,velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        /*
        For velocity we need to know the direction of the projectile
        angle is requried to calculate the velocity
        Trigonometry is used to calculate the velocity
         */
    }
    
    draw()
    {
        context.beginPath();
        //context.arc(x,y,radius,startAngle,endAngle,anticlockwise)
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle = this.color;
        context.fill();
    }

    update()
    {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}

const friction = 0.99;
class Particle{
    //Properties of particle : colour, position, radius, velocity as it's moving,alpha value for transparency
    constructor(x,y,radius,color,velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        /*
        For velocity we need to know the direction of the projectile
        angle is requried to calculate the velocity
        Trigonometry is used to calculate the velocity
         */
        this.alpha = 1;
    }
    
    draw()
    {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        //context.arc(x,y,radius,startAngle,endAngle,anticlockwise)
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update()
    {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }

}

//Creating a player object on center of canvas
const x = canvas.width/2;
const y = canvas.height/2;
const radius =10;
const color = 'white';

let player = new Player(x,y,radius,color);

// const projectile1 = new Projectile(canvas.width/2, canvas.height/2,5,'red',{x:1,y:1});
// const projectile2 = new Projectile(canvas.width/2, canvas.height/2,5,'green',{x:-1,y:-1});
// const projectiles = [projectile1,projectile2];
let projectiles = [];
let enemies = [];
let particles = [];

function initialiseGame(){
    player = new Player(x,y,10,'white');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    score_element.innerHTML = score;
    pointscardscore.innerHTML = score;
}

function spawnEnemies(event){
    setInterval(()=>{
        const radius = Math.random()*(30-4)+4;

        let x;
        let y;

        if(Math.random()<0.5){
           x = Math.random()<0.5 ? 0-radius : canvas.width+radius;
           y = Math.random()*canvas.height;
        }
        else
        {
            x = Math.random()*canvas.width;
            y = Math.random()<0.5 ? 0-radius : canvas.height+radius;
        }
        const color = `hsl(${Math.random()*360},50% ,50%)`;
        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x,y,radius,color,velocity));
        
    },1000);
}

let animationId;
let score = 0;
function animate()
{
    animationId = requestAnimationFrame(animate);
    context.fillStyle = 'rgba(0,0,0,0.1)';
    context.fillRect(0,0,canvas.width,canvas.height);
    player.draw();
    // projectile.draw();
    // projectile.update();
    particles.forEach((particle,index)=>{
        if(particle.alpha<=0){
            particles.splice(index,1);
        }
        else{

        particle.update();
            
        }
    });
    projectiles.forEach((projectile,index)=>{
        projectile.update();
        if(projectile.x - projectile.radius<0 || 
           projectile.x - radius>canvas.width || 
           projectile.y + radius<0 ||
           projectile.y - radius>canvas.height){
            setTimeout(()=>{
                projectiles.splice(index,1);
            },0);
        }
    });

    enemies.forEach((enemy,index)=>{
        enemy.update();
        //enemy.draw();
        const dist = Math.hypot(player.x-enemy.x,player.y-enemy.y);
        if(dist-enemy.radius-player.radius<1){
            cancelAnimationFrame(animationId);
            pointscardscore.innerHTML = score;
            pointscard.style.display = 'flex';
        }
        projectiles.forEach((projectile,projectileIndex)=>{
            const dist = Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y);
            //objects touch : Collision is there, detect using distance
            if(dist-enemy.radius-projectile.radius<1){
                score += 10;
                score_element.innerHTML = score;
                for(let i=0;i<enemy.radius*2;i++){
                    particles.push(new Particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{
                        x:(Math.random()-0.5)*(Math.random()*6),
                        y:(Math.random()-0.5)*(Math.random()*6)
                    }));
                }
                if(enemy.radius - 10>5){
                    //increase score
                    score += 10;
                    score_element.innerHTML = score;
                    gsap.to(enemy,{
                        radius: enemy.radius-10
                    });
                setTimeout(()=>{
                    //enemies.splice(index,1);
                    projectiles.splice(projectileIndex,1);
                },0);
               }
               else{
                //increase score
                score += 20;
                score_element.innerHTML = score;
                setTimeout(()=>{
                    enemies.splice(index,1);
                    projectiles.splice(projectileIndex,1);
                },0);
               }
            }
        });
    });
}

window.addEventListener('click',(event)=>{
    const angle = Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,5,'white',velocity));
});

startgame.addEventListener('click',()=>{
    initialiseGame();
    animate();
    spawnEnemies();
    pointscard.style.display = 'none';
});
