var c = document.getElementById("piano");
var context = c.getContext("2d");
var b = document.getElementById("background");
var context_back = b.getContext("2d");
var a = document.getElementById("score_bar");
var context_score = a.getContext("2d");
 

var numOfTiles = 5;
var myScore = 0;
var eachState = [false,false,false,false,false];
var myTiles = [];

var intervalTmp;
var geneTmp;

paintWindow(); 
paintScoreBar();
document.getElementById('btn').addEventListener('click',function(e){
    content = document.getElementById('start_btn');
    if(content.innerHTML == "START" || content.innerHTML == "GG"){
        intervalTmp = window.setInterval(upDate,5);
        geneTmp = window.setInterval(geneBlock,600);
        document.getElementById('music').play();
        content.innerHTML = "PAUSE";
    }
    else{
        document.getElementById('music').pause();
        window.clearInterval(intervalTmp);
        window.clearInterval(geneTmp);
        content.innerHTML = "START";
    }
});
function paintScoreBar(){
    score_gradient = context_score.createLinearGradient(0,0,0,80);
    score_gradient.addColorStop(0,"rgba(74,171,254,0)");
    score_gradient.addColorStop(0.5,"rgba(74,84,254,0)");
    score_gradient.addColorStop(1,"rgba(116,74,254,0)");
    context_score.fillStyle = score_gradient;
    context_score.fillRect(0,0,300,70);    
}
function geneBlock(){
    var myRand = Math.floor(Math.random()*numOfTiles);
    var i;
    var flag = true;
    for( i = 0; i < numOfTiles; ++i){
        if(!eachState[i]){
            flag = false;
        }
    }
    if(flag)return;//if mytiles array didn't have false element, then return

    while(eachState[myRand])
        myRand = Math.floor(Math.random()*numOfTiles);
    myTiles[myRand] = new Block(myRand);
     
}
function paintWindow(){
    my_gradient = context_back.createLinearGradient(0,0,0,600);
    my_gradient.addColorStop(0,"rgba(65,234,246,0.6)");
    my_gradient.addColorStop(1,"rgba(254,74,251,0.5)");

    context_back.fillStyle = my_gradient;
    context_back.fillRect(0,0,300,600);

    context_back.beginPath();
    context_back.moveTo(72,0);
    context_back.lineTo(72,600);
    context_back.strokeStyle = "white";
    context_back.stroke();

    context_back.beginPath();
    context_back.moveTo(148,0);
    context_back.lineTo(148,600);
    context_back.strokeStyle = "white";
    context_back.stroke();

    context_back.beginPath();
    context_back.moveTo(226,0);
    context_back.lineTo(226,600);
    context_back.strokeStyle = "white";
    context_back.stroke();

    context_back.beginPath();
    context_back.moveTo(0,470);
    context_back.lineTo(300,470);
    context_back.strokeStyle = "white";
    context_back.stroke();
}
function Block(index){
    if(!eachState[index])
        eachState[index] = true;

    this.index = index;
    this.appearPos = Math.floor(Math.random()*4);
   
    this.width = 70;
    this.height = 120;
    this.color = "black";
    switch(this.appearPos){
        case 0:
            this.x = 0;
            this.y = -120;
            break;
        case 1:
            this.x = 75;
            this.y = -120;
            break;
        case 2:
            this.x = 152;
            this.y = -120;
            break;
        case 3:
            this.x = 228;
            this.y = -120;
            break;
    }
    context.fillStyle = this.color;
    context.fillRect(this.x,this.y,this.width,this.height);
    this.live = true;

    window.addEventListener('keydown',function(e){
        myTiles[index].keyCode = e.keyCode;
    });
    window.addEventListener('keyup',function(e){
        myTiles[index].keyCode = false;
    });
}
function move(index){
    if(myTiles[index].live){
        myTiles[index].y += 1;
        context.fillStyle = "black";
        context.fillRect(myTiles[index].x,myTiles[index].y,70,120);   
        context.clearRect(myTiles[index].x,myTiles[index].y-1,70,1);
    }
}
function afterRight(index){
    myScore++;
    context.clearRect(myTiles[index].x,myTiles[index].y,70,120);
    myTiles[index].live = false;
    eachState[index] = false;
}
function upDate(){//check keyCode whether correct
    var i;

    var textWidth = context_score.measureText(myScore.toString()).width;
    context_score.clearRect(0,0,300,70);
    context_score.font = "30px Verdana";
    context_score.textAlign = 'center';
    paintScoreBar();
    context_score.fillStyle = "rgba(88,38,255,0.8)";
    context_score.fillText(myScore.toString(),(a.width / 2) - (textWidth / 2)+9,50);
    

    for(i = 0; i < numOfTiles; ++i){
        if(eachState[i]){
            myTiles[i].y += 1;
            context.fillStyle = "black";
            context.fillRect(myTiles[i].x,myTiles[i].y,70,120);   
            context.clearRect(myTiles[i].x,myTiles[i].y-2,70,2);
        }
    }
    for(i = 0; i < numOfTiles; ++i){
        if( eachState[i] ){
            if(myTiles[i].y < 470 && myTiles[i].y >350){
                switch(myTiles[i].keyCode){
                    case 65: //A
                        if(myTiles[i].x == 0)
                            afterRight(i);
                        break;
                    case 83: //S
                        if(myTiles[i].x == 75)
                            afterRight(i);
                        break;
                    case 68: //D
                    if(myTiles[i].x == 152)
                        afterRight(i);
                    break;
                    case 70: //F
                    if(myTiles[i].x == 228)
                        afterRight(i);
                    break;       
                }
            }
            if(myTiles[i].y > 470){
                context.clearRect(myTiles[i].x,myTiles[i].y,70,120);
                context.fillStyle = "rgba(245,13,13,0.8)";
                context.fillRect(myTiles[i].x,myTiles[i].y,70,120);
                myTiles[i].live = false;
                eachState[i] = false;
                document.getElementById('music').pause();
                window.clearInterval(intervalTmp);
                window.clearInterval(geneTmp);
                content.innerHTML = "GG";
            }
        }
        else{//not alive

        }
    }
}
 