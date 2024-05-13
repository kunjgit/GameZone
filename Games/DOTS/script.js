const canvas=document.querySelector('canvas'); 
// selecting our canvas element 

canvas.width=innerWidth;    // 
canvas.height=innerHeight;


const context=canvas.getContext('2d');   // canvas context is our canvas api that allows us
                                        // to draw on the canvas to actully get art work on our canvas


const scoreEl=document.querySelector('#scoreEl');
console.log(scoreEl);
const startGameBtn=document.querySelector('#startGameBtn');

const modalEl=document.querySelector('#modalEl');
const bigScore=document.querySelector('#bigScore');


// creating a player class which has certain propeties like size, color, position 

class Player{          // in order to create properties we need and specify them to our class we need  constructor
constructor(x,y,radius,color){          //constructor is called each time you intiate a new version of the player of the class 
    this.x=x
    this.y=y
    this.radius=radius
    this.color=color     //when we pass the arguments it forms an instance of class with these properties
}
//draw function inside the class to reflect these properties on screen

draw(){
    context.beginPath();
   const ans= context.arc(this.x,this.y,this.radius,0,Math.PI*2,false); // creates circles
   context.fillStyle=this.color;  // for color
    context.fill();
}              
}
class Projectile{
    constructor(x,y,radius,color,velocity){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
    }
    draw(){
        context.beginPath();
       const ans= context.arc(this.x,this.y,this.radius,0,Math.PI*2,false); // creates circles
       context.fillStyle=this.color;  // for color
        context.fill();
    }    
    update(){
        this.draw(); // combining two functions together in class 
        this.x=this.x+this.velocity.x
        this.y=this.y+this.velocity.y
    }
}


class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
    }
    draw(){
        context.beginPath();
       const ans= context.arc(this.x,this.y,this.radius,0,Math.PI*2,false); // creates circles
       context.fillStyle=this.color;  // for color
        context.fill();
    }    
    update(){
        this.draw(); // combining two functions together in class 
        this.x=this.x+this.velocity.x
        this.y=this.y+this.velocity.y
    }
}


const friction=0.99
class Particle{
    constructor(x,y,radius,color,velocity){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
        this.alpha=1 // it gives opacity to particles which we will reduce further 
    }
    draw(){
        context.save()
        context.globalAlpha = this.alpha
        context.beginPath();
       const ans= context.arc(this.x,this.y,this.radius,0,Math.PI*2,false); // creates circles
       context.fillStyle=this.color;  // for color
        context.fill();
        context.restore()   // here save restore our statements use to hit those set of statements between them so which 
    }    
    update(){
        this.draw(); // combining two functions together in class 
        this.velocity.x *=friction   
        this.velocity.y *=friction  // to add slow effect when particles fade away
        this.x=this.x+this.velocity.x
        this.y=this.y+this.velocity.y
        this.alpha -= 0.01
    }
}



const x=canvas.width/2 // to get center of the page
const y=canvas.height/2 

let player= new Player(x,y,12,'white'); // creating an object
// player.draw();    // we need to add this animate function cause to get particle effect we clear the screen with each click so it also gets removed



// const projectile= new Projectile(      // creating a moving object for our projectile
//     canvas.width/2,
//     canvas.height/2,
//     5,
//     'black',
//     {x:1,y:1}
//     ); // the x,y coordinates are in the from where our projectile starts

                                                    // we need to genrate multiple projectile with each click that goes inside our array which
                                                    //then furhter get projected using forEach function in our animate function
let projectiles=[]    // array for holding each instance of click for each projectile 

let enemies=[]
let particles=[]

function init(){

    player= new Player(x,y,12,'white'); 
    projectiles=[]    // array for holding each instance of click for each projectile 

 enemies=[]
 particles=[]
 score=0
 scoreEl.innerHTML=score
 bigScore.innerHTML=score
}

function spwanEnemies(){
setInterval(()=>{

    const radius=Math.random() * (60-8)+8     // here the range is 30 - 6 using Math.random in this specific way
    let x,y
if(Math.random()<0.5){                              //creating randomness for enemies 
 x=Math.random()<0.5? 0-radius : canvas.width +radius
 y=Math.random()*canvas.height
}else{
    x=Math.random()*canvas.width
    y=Math.random()<0.5? 0-radius : canvas.height +radius
}


const color= `hsl(${Math.random()*360}, 50%, 50%)`  // hue staturation and lightness(here we use a template literal `` so that we can compute)
                                                // to randomize the color(adding $ to input computation in a string)

const angle=Math.atan2(canvas.height/2-y,canvas.width/2-x)  // here we are subtracting the border form the middle to project our enemies towrads the center

const velocity={              
    x: Math.cos(angle)*2,    
    y: Math.sin(angle)*2
}  

enemies.push(new Enemy(x,y,radius,color,velocity))
},1000)  // creating enemies with an interval of 1sec
}

let animationId   // created so that we kill the requestAnimation functionallity 
let score=0
function animate(){
    animationId=requestAnimationFrame(animate)   // this funtions creates a loop it infinitly calls the animate function 
                                    // it will keep calling the update funtion for us   

   context.fillStyle= 'rgba(0,0,0,0.1)'     // here this aplha=0.1 changes the opacity making it transparent so we get our fade effect look

   context.fillRect(0,0,canvas.width,canvas.height)  // while looping through the loop it clears the screen to get that particle effect
   player.draw();

   particles.forEach((particle,index)=>{  // to get the particle effect

    if(particle.alpha<=0){
        particles.splice(index,1)  // to remove the particles
    }else{
        particle.update();
    }
   })

    projectiles.forEach((projectile,index)=>{  // this function will go through each projectile inside our array 
        projectile.update(); 
        
        
        if(projectile.x + projectile.radius < 0 ||                 // conditions for specifying edges of our canvas
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height){


            setTimeout(()=>{ // to remove the flash effect its having every time we remove somthing from array
                // what it does is it wait for the very next frame to start removing form the array

                projectiles.splice(index,1) // to remove the projectiles whixh go beyond the screen from our array
                                           // we do that to avoid computations
               },0) 
        }
    })

    enemies.forEach((enemy,index)=>{ // this funciton will go through each enemy inside our enemies array
                                    // here index will give us particular index of the enemy object inside the enemies array 
        
        const distance=Math.hypot(player.x-enemy.x,player.y-enemy.y) // to calculate the distance between player and enemy

        if(distance - enemy.radius - player.radius < 1){ 
            cancelAnimationFrame(animationId) // it kills our requestAnimation loop
            console.log("game ends");
            modalEl.style.display='flex'
            bigScore.innerHTML=score
        }

        enemy.update();
        projectiles.forEach((projectile,projectileIndex)=>{
            const distance=Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y) // calcultes the distance between projetile and distance 
                                                            // with every frame we do this to eleminate the enemy

            if(distance - enemy.radius - projectile.radius < 1){ // we cancel there raduis so that whenever it touches the circumference it becomes less than 1

                score+=100
                console.log(score)
                scoreEl.innerHTML=score
        
                for(let i=0;i<enemy.radius/2;i++){    // creates particles when ever we hit the enemy just like we created enemy 
                    particles.push(new Particle(
                        projectile.x,
                        projectile.y,
                        Math.random()*2,   // to get expolsion effect
                        enemy.color,{
                            x: (Math.random()-0.5)*(Math.random()*6),
                            y: (Math.random()-0.5)*(Math.random()*6)
                        }
                    ))
                }


                if(enemy.radius-10> 15){ // why we add -10 so when we subtract 10 it doesnt becomes to small

                   

                    setTimeout(()=>{ // to remove the flash effect its having every time we remove somthing from array
                        // what it does is it wait for the very next frame to start removing form the array
                        gsap.to(enemy,{
                            radius: enemy.radius -10
                        })
                        console.log(radius)
        
                        enemies.splice(index,1) // removes that particular index when the projectile touches the enemy removing 
                                               // 1 signifies to remove one element from the array enemy
                        projectiles.splice(projectileIndex,1)
                       },0) 
                }else{

                    setTimeout(()=>{ // to remove the flash effect its having every time we remove somthing from array
                        // what it does is it wait for the very next frame to start removing form the array
        
                        enemies.splice(index,1) // removes that particular index when the projectile touches the enemy removing 
                                               // 1 signifies to remove one element from the array enemy
                        projectiles.splice(projectileIndex,1)
                       },0) 
                }
            }                                               
        })
    })   
}


window.addEventListener('click',(event)=>{  // click is the input which is listen from window using event listner(window is by default)
                                            // event object receives the value of all coordinates or we can say the details of our click
// console.log(event.clientX) ;             //here we can get all the values our event holds and get exact x,y coordinates of our click

//const projectile= new Projectile(event.clientX,event.clientY,5,'black',null); // whereever we click will create a projectile dot
   

// To calculate the velocity using the coordinates
const angle=Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2)  // it helps us to calculte the angle for the triangle
                                                                                    // in radians (0-360)= 0-6.28 radian
const velocity={              
    x: Math.cos(angle) *7,    // here we *4 to increase the speed of our projectile
    y: Math.sin(angle) *7
}                       

projectiles.push(new Projectile(
    canvas.width/2,
    canvas.height/2,
    5,
    'white',
    velocity
))

})


startGameBtn.addEventListener('click',()=>{ // to fire the game
    init();// to reset all the arrays to zero
    animate();
    spwanEnemies();
    modalEl.style.display='none'
})



console.log("Hi this game is working fine");