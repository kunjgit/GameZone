/** @type {HTMLCanvasElement} */


let localData = [];
let info = undefined;
let highscore = {};

class Game {
    constructor(ctx, player, canvas, playerSpeed, enemySpeed, shot, magazine, reload){

        this.ctx = ctx;
        this.player = player;
        this.canvas = canvas;
        this.intervalId = null;
        this.intervalSpritesId = null;
        this.frames = 0;
        this.enemies = [];
        this.highScores = [];
        this.playerSpeed = playerSpeed;
        this.enemySpeed = enemySpeed;
        this.shot = shot;
        this.magazine = magazine;
        this.reload = reload;
        this.score = 0;
        
       
       
    }

    start(){

        const playerName = document.getElementById('player-name').value;
        const endWindow = document.querySelector('.end-screen');
        endWindow.style.display = 'none';
        

        if(!playerName || playerName == '' || playerName == ' '){
            this.player.name = 'Jacinto'
        }else{
            this.player.name = playerName;
        }
        this.intervalId = setInterval(this.update, 1000 / 60);
        this.intervalSpritesId = setInterval(this.updateSprites, 1000 / 10);
        
        localData = JSON.parse(localStorage.getItem('playerScore'));
        console.log(localData)
        if (!(localData == null)) {
            console.log('nao exite')
            
            localData = JSON.parse(localStorage.getItem('playerScore'));
            
        }   else localData = [];
        
    }

    update = () => {

        //Function responsbile for updating the game
        this.frames++; 
        this.updateScore();                                //frames passed, used for time and score
        this.clear();         
        this.checkGameOver();                       
        this.player.newPos();
        this.player.draw();
        this.updateEnemies();   
        this.magazine.forEach((shot) =>{
            shot.shotEnd();
            shot.draw();
              })
        reload.reloading();
        for(let i = 0; i < this.enemies.length; i++){ //for loop to update all enemies position in the array
            this.enemies[i].newPos();         
            } 
        this.player.healthBar();      
    }

    updateSprites = () => {

        //PLayer Sprite
        if(this.player.dx >= 260)this.player.dx = 0;
        else this.player.dx += 45;
       
        //Enemies sprites
          for(let i = 0; i < this.enemies.length; i++){
            
            if(this.enemies[i].enemyType == 'Enemy'){
                if(this.enemies[i].dx >= 600)this.enemies[i].dx = 0;
                else this.enemies[i].dx += 40;  
            }  
              
            if(this.enemies[i].enemyType == 'Boss') {                                          
                if(this.enemies[i].dy >= 174)this.enemies[i].dy = 0;
                else this.enemies[i].dy += 58;   
                 } 
            
    }
}

    stop(){
     
       
        const endWindow = document.querySelector('.end-screen');
        endWindow.style.display = 'block';
        endWindow.style.position = 'absolute'
        clearInterval(this.intervalId);  
        gameStarted = false;
/*         document.getElementById('first-place-score').innerHTML = this.score;
 */        

        highscore = {name: this.player.name, score: this.score};
       

        localData.push(highscore);
        localStorage.setItem("playerScore", JSON.stringify(localData)); 
        
        
        localData.sort(( {score: a }, {score: b}) => a - b)
        
        localData.reverse();
        console.log(localData)

    }

    clear() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }
    
    updateEnemies = () =>{

        //Bala 1
        let shotEnemyBullet0 = {};
        let enemy0Shot = false;
        for(let i = 0; i < this.enemies.length; i++){
            if (this.magazine[0].crashWith(this.enemies[i])){
                shotEnemyBullet0 = this.enemies[i];
                enemy0Shot = true;   
            }
        }
        if(enemy0Shot){
             this.magazine[0].shotFired = false;
             shotEnemyBullet0.receiveDamage();
        }


        //Bala 2
        let shotEnemyBullet1 = {};
        let enemy1Shot = false;
        for(let i = 0; i < this.enemies.length; i++){
            if (this.magazine[1].crashWith(this.enemies[i])){
                shotEnemyBullet1 = this.enemies[i];
                enemy1Shot = true;      
            }
        }
            if(enemy1Shot){
             this.magazine[1].shotFired = false;
             shotEnemyBullet1.receiveDamage();
        }


        //Bala 3
        let shotEnemyBullet2 = {};
        let enemy2Shot = false;
        for(let i = 0; i < this.enemies.length; i++){
            if (this.magazine[2].crashWith(this.enemies[i])){
                shotEnemyBullet2 = this.enemies[i];
                 enemy2Shot = true;           
                    }
                }
         if(enemy2Shot){
             this.magazine[2].shotFired = false;
             shotEnemyBullet2.receiveDamage();
                }
        
        //Bala 4
        let shotEnemyBullet3 = {};
        let enemy3Shot = false;
        for(let i = 0; i < this.enemies.length; i++){
            if (this.magazine[3].crashWith(this.enemies[i])){
                shotEnemyBullet3 = this.enemies[i];
                 enemy3Shot = true;         
                    }
                }
         if(enemy3Shot){
             this.magazine[3].shotFired = false;
             shotEnemyBullet3.receiveDamage();
                }
        
         //Bala 5
         let shotEnemyBullet4 = {};
         let enemy4Shot = false;
         for(let i = 0; i < this.enemies.length; i++){
             if (this.magazine[4].crashWith(this.enemies[i])){
                shotEnemyBullet4  = this.enemies[i];
                  enemy4Shot = true;          
                     }
                 }
          if(enemy4Shot){
              this.magazine[4].shotFired = false;
              shotEnemyBullet4 .receiveDamage();
                 }
                 
         //Bala 6
         let shotEnemyBullet5 = {};
         let enemy5Shot = false;
         for(let i = 0; i < this.enemies.length; i++){
             if (this.magazine[5].crashWith(this.enemies[i])){
                  shotEnemyBullet5 = this.enemies[i];
                  enemy5Shot = true;
                         
                     }
                 }

          if(enemy5Shot){
              this.magazine[5].shotFired = false;
              shotEnemyBullet5.receiveDamage();
                 }
               
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].draw();                                                     //fazer aparecer os enemies
            if(this.enemies[i].enemyType == 'Boss' && this.enemies[i].hp <= 0){        //caso o Boss morra,acabar o jogo
                this.score += 200;
                const windowTitle = document.querySelector('#end-game-condition');
                windowTitle.innerHTML = `${this.player.name} saved this world from the nazi zombies and nuns`
                this.stop()    

            }else if(this.enemies[i].enemyType == 'Enemy' && this.enemies[i].hp <= 0){  //caso seja um enemy a morrer, retirar do array
                this.enemies.splice(i, 1)
                this.score += 10;
            }            
        }

        //criação de X e Y random
        //colocar posições random na border do canvas
        //decidir aleatoriamente de que border apareça o enemy    
        let randomX = Math.floor(Math.random() * this.canvas.width); 
        let randomY = Math.floor(Math.random() * this.canvas.height) ; 
        let randomArray = [{x : 0, y : randomY}, {x :this.canvas.width, y: randomY},{x: randomX,y:0},{x:randomX, y:this.canvas.height}];  
        let randomIndex = Math.floor(Math.random() * randomArray.length);
        let spritesArray = ['docs/assets/images/nun_sprite.png', 'docs/assets/images/zombies_sprite.png']
        let randomSprite = Math.floor(Math.random() * spritesArray.length)
        let bossDirection = '';
        let bossPosX = 0;
        let bossPosY = 0;
        

        if(this.frames % 300 === 0){               //criação de enemies após x tempo                              
                  
            this.enemies.push(new Enemy(randomArray[randomIndex].x, randomArray[randomIndex].y, 30, 30, 10, this.ctx, spritesArray[randomSprite],this.shot, 'Enemy', this.player));
        }

         if (this.frames === 2000) {             //criação do boss após x tempo

            this.enemies.push(new Boss(randomArray[randomIndex].x, randomArray[randomIndex].y, 10, 100, 80, this.ctx, 'docs/assets/images/Boss_Sprite.png', this.shot, 'Boss', this.player));
            

           
            }

            if((this.frames > 2000 && (this.frames  % 600) == 0) ){

                console.log('tem de sair')
                this.enemies.forEach((enemy) => {
                    if(enemy.enemyType == 'Boss'){
                        bossPosX = enemy.x;
                        bossPosY = enemy.y;
                        bossDirection = enemy.actualDirection;
                        


                    }
                })
                console.log(bossDirection)
                this.enemies.push(new SpecialAttack(bossPosX , bossPosY + 35, 30, 30, 100, this.ctx, bossBulletImg ,this.shot, 'SpecialAttack',this.player, this.player.x, this.player.y, bossDirection, bossBullet2Img));
                //this.enemies[this.enemies.length - 1].direction();
                //console.log(this.enemies.length);
        
        }

    }

    updateScore(){


        this.score ++;
        document.getElementById('end-score').innerHTML = this.score;


    }

    restart(){

        this.player.hp = 100;
        this.enemies = [];
        this.frames = 0;
        this.score = 0;
        this.reload.countShots = 0;
        gameStarted = true;
        clearInterval(this.intervalSpritesId);
        this.start();
        
    }

    checkGameOver(){
        const crashed = this.enemies.some((enemy) =>{    //.some vai verificar o array dos enemies, correr a função crashWith com todos os enemies
            return this.player.crashWith(enemy);
        });
        if(crashed){                                     //se for detedada colisão player perder vida
            this.player.hp -= 1;           
        } 

        if(this.player.hp <= 0) {                        //se a vida for menor ou igual a zero, perde o jogo
            const windowTitle = document.querySelector('#end-game-condition');
            windowTitle.innerHTML = 'The world was taken by the nazi zombies and nuns'
            this.stop();
            
        }
    }

   
}

// index.js

