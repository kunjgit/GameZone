 export class CollisionAnimation{
    constructor(game,x,y)
    {
        this.game=game;
        this.image=document.getElementById("collision");
        this.spritewidth=100;
        this.spriteheight=90;
        this.sizeModifer=Math.random()+0.5;
        this.width=this.spritewidth*this.sizeModifer;
        this.height=this.spriteheight*this.sizeModifer;
        this.x=x-this.width*0.5;
        this.y=y-this.height*0.5;
        this.framex=0;
        this.maxframe=4;
        this.markfordeletion=false;
        this.fps=Math.random()*10+5;;
        this.frameInterval=1000/this.fps;
        this.frametimer=0;

    }
    draw(context)
    {
        context.drawImage(this.image,this.framex*this.spritewidth,0,this.spritewidth,this.spriteheight,this.x,this.y,this.width,this.height);
    }
    update(deltatime)
    {

        this.x-=this.game.speed;
        if(this.frametimer>this.frameInterval)
        {
            this.framex++;
            this.frametimer=0;
        }
        else{
            this.frametimer+=deltatime;
        }
        
        if(this.framex>this.maxframe)
        this.markfordeletion=true;


    }
}