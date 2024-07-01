export class UI{
    constructor(game)
    {
        this.game=game;
        this.fontsize=100;
        this.fontfamily='Helvetica';
    }
    draw(context)
    {
        context.save();
        context.shadowOffsetX=2;
        context.shadowOffsetY=2;
        context.shadowColor='white';
        context.shadowBlur=0;
        context.textAlign='left';
        context.fillStyle=this.game.fontcolor;
       // context.font=this.fontsize+'px'+this.fontfamily;
        context.font='50px Helvetica';
        context.fillText('Score: ' +this.game.score,20,50);
        context.font=50*0.7+'px'+this.fontfamily;
        context.fillText('Time:'+(this.game.time*0.001).toFixed(1),20,110);
        // console.log(this.game.gameover);
        
        if(!this.game.gameover)
        {
            
            
            context.textAlign='center';
            context.font=50*2+'px'+this.fontfamily;
        if(this.game.score===100)
        {
            context.fillText('Go Warrior',this.game.width*0.5,this.game.height*0.5-20);
            context.font=50*0.7+'px'+this.fontfamily;
   
            context.fillText('______',this.game.width*0.5,this.game.height*0.5);
            //context.clearRect(this.game.width/2, this.game.height/2, this.game.width*0.5,this.game.height*0.5-20);
        }
        else if(this.game.score>=50 && this.game.score<=70){
            context.fillText('Try once',this.game.width*0.5,this.game.height*0.5-20);
            context.font=50*0.7+'px'+this.fontfamily;
            
        }
        else
        {

        }
           
        }
        else
        {
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("Game Over", canvas.width / 2, 200);
            context.fillStyle = "white";
            context.fillText("Game Over", canvas.width / 2, 202);
             
        }
        context.restore();
    }
}
