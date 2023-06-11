player.s4x = 100;
player.s4y = 120;
//good for x not for y always + 1
// v,h,v,h,v,v,h,v,h
var string = [[13,0,15,12,0],[0,9,9,12,0],[20,5,22,12,0],[0,18,2,21,1],[3,18,12,21,0],[13,12,15,46,0],
            [20,12,22,52,0],[3,43,13,46,0],[34,0,36,38,0],[34,38,36,42,2],[23,42,26,46,3],[27,42,51,46,0],
            [46,0,51,5,4]];
var blocks = {};
var gate1 = [];
var gate2 = [];
var gate3 = [];
var gate4 = [];
var blockGate = [];
var gates = {}
var buttonsSet1 = [];
var gateAccessProhibition1 = true;
var buttonsSet2 = [];
var gateAccessProhibition2 = true;
var buttonsSet3 = [];
var gateAccessProhibition3 = true;
var buttons = {};
var walls = {};

var buttonString = [[6,15,1,0],[8,15,1,1],[10,15,1,2],[12,15,1,3],
                [26,38,2,0],[28,38,2,1],[30,38,2,2],[32,38,2,3],
                [41,1,3,0],[45,1,3,1],[43,3,3,2],[41,5,3,3],[45,5,3,4]];
var wallString = [[13,0,3,46,0],[0,9,10,3,0],[20,5,3,47,0],[0,18,3,3,1],[3,18,9,3,0],[3,43,10,3,0],[34,0,3,38,0],
                [34,38,3,4,2],[23,42,4,4,3],[27,42,24,4,0],[46,0,6,5,4]]
var blockSpeed=20;
var deleteSpeed=60;
var stage4 = function() {
    ctx.save();
    TextS1 = [["Welcome to stage 4"]];
    TextS2 = [["Be sure You have everything",
                ["because You won't be able to go back"],
                ["As I had to work as per the theme"]]];
    if(player.pressingRight == true)
        player.s4x+=player.xspd;
    if(player.pressingLeft == true)
        player.s4x-=player.xspd;
    if(player.pressingTop == true)
        player.s4y-=player.yspd;
    if(player.pressingBottom == true)
        player.s4y+=player.yspd;
    let mapArea = newSizeCanvas();
    const x = centerPlay("s4x",mapArea[0]*2);
    const y = centerPlayY("s4y",mapArea[0]*2);
    mapMovement(xMovement,"s4x",player.mapSize,1,TextS2,"27px Georgia",yMovement,"s4y");        
    stayInBoundary("s4x",0,mapArea[0]*2,'map',true,"s4y",mapArea[0]*2);
    drawTrack(xMovement,yMovement);
    drawMovingBubbles(9,38,-xMovement,-yMovement);
    if(holdKey == true)
        drawKey(x,y-180+player.height/3);
    else
        drawKey();
    if(holdGun == true)
        drawGun(x,y-player.s5y);
    for(let id in bulletlist)
        bulletlist[id].update(bulletlist[id],"s4",-xMovement,-yMovement);
    drawText(0,20,[`Buttons click left ${buttonLimit} & button Reset ${buttonResetLimit} 
                Press b to reset`],
                "30px Georgia",0,20)
    ctx.drawImage(document.getElementById('svg'), 0, 0, 219,375,x,y,player.width,player.height);
    ctx.restore();
}
drawKey = function(xKey=0,yKey=0) {
    ctx.save();
    // let x=2150,y=100;
    let x=2350-xMovement;
    y=100-yMovement;
    let factr = 1;
    if(holdKey == true) {
        x=xKey + player.width*2/3;
        y=200 + yKey;   
        factr = 0.4;     
    }
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x,y, 30*factr, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillRect(x,y-15*factr,145*factr,15*factr);
    ctx.fillRect(x+130*factr,y,15*factr,40*factr);
    ctx.fillRect(x+100*factr,y,15*factr,30*factr);
    ctx.fillRect(x+70*factr,y,15*factr,40*factr);
    ctx.restore();
}
var wallBoundaries = function() {
    for(let i=0;i<wallString.length;i++) {
        self = {
            id:Math.random(),
            x:wallString[i][0]*50,
            y:wallString[i][1]*50,
            width:wallString[i][2]*50-10,
            height:wallString[i][3]*50-10
        }
        self.update = function(obj) {
            if(player.s4y + player.height > obj.y && 
                player.s4y < obj.y && player.s4x + player.width > obj.x&&
                player.s4x < obj.x + obj.width)
                    player.s4y -= player.xspd==20?20:5;
            if(player.s4y < obj.y + obj.height && 
                player.s4y + player.height > obj.y + obj.height && player.s4x + player.width > obj.x&&
                player.s4x < obj.x + obj.width)
                    player.s4y += player.xspd==20?20:5;
            if(player.s4x + player.width > obj.x && player.s4x < obj.x 
                && player.s4y + player.height > obj.y&& 
                player.s4y < obj.y + obj.height)
                    player.s4x -= player.xspd==20?20:5;
            if(player.s4x < obj.x + obj.width && player.s4x + player.width > obj.x + obj.width 
                && player.s4y + player.height > obj.y&& 
                player.s4y < obj.y + obj.height)
                    player.s4x += player.xspd==20?20:5;
        }
        walls[self.id] = self;
        if(wallString[i][4])
            blockGate[wallString[i][4]-1] = self.id;
    }
}
var drawTrack = function(x,y) {
    for(let id in blocks) {
        blocks[id].update(blocks[id],x,y);
    }
    for(let id in gates) {
            gates[id].update(gates[id],x,y)
        }
    for(let id in buttons) {
        buttons[id].update(buttons[id],x,y);
    }
    for(let id in walls) {
        walls[id].update(walls[id]);
    }
    if(buttons[buttonsSet1[0]].blink && buttons[buttonsSet1[1]].blink && 
        buttons[buttonsSet1[2]].blink && buttons[buttonsSet1[3]].blink &&
        gateAccessProhibition1) {
            gateAccessProhibition1=false;
            delete walls[blockGate[0]];
            delB(gate1);
    }
    if(buttons[buttonsSet2[0]].blink && buttons[buttonsSet2[1]].blink && 
        buttons[buttonsSet2[2]].blink && buttons[buttonsSet2[3]].blink &&
        gateAccessProhibition2) {
            gateAccessProhibition2=false;
            delete walls[blockGate[1]];
            delete walls[blockGate[2]];
            delB(gate2)
            delB(gate3);
    }
    if(buttons[buttonsSet3[0]].blink && buttons[buttonsSet3[1]].blink && 
        buttons[buttonsSet3[2]].blink && buttons[buttonsSet3[3]].blink 
        && gateAccessProhibition3) {
            gateAccessProhibition3=false;
            delete walls[blockGate[3]];
            delB(gate4);
    }
    if(!holdKey && player.s4x>2350 && player.s4y<100)
        holdKey=true;
}
var randomBlockGenerator = function() {
        var h = 0;
        var i = string[h][0];
        var j =  string[h][1];
        var k = true;
        var gateBlockCounter = 0;
        var a = setInterval(() => {
        var color = string[h][4]==0?"#e14c21":"purple";
        generateBlock(i,j,color,string[h][4],gateBlockCounter);
        if(k==true)
            i++;
        else
            i--;
        if(i>string[h][2]) {
            k=false;
            i--;
            j++;
        }
        if(i<string[h][0]) {
            k=true;
            i++;
            j++;
        }
        gateBlockCounter++;
        if(j==string[h][3]) {
            if(++h < string.length) {
                i = string[h][0];
                j =  string[h][1];
                gateBlockCounter = 0;
                k = true;
            } 
            else
                clearInterval(a);
        }
    }, blockSpeed);
}
var generateBlock = function(x,y,color,gateNo,gateBlockCounter,width=40,height=40) {
    ctx.save();
    self = {
        id:Math.random(),x:x,y:y,width:width,height:height,color:color
    }
    self.update = function(obj,x,y) {
        ctx.save();
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x*50-x,obj.y*50-y,obj.width,obj.height);
        ctx.restore();
    }
    if(gateNo==1)
        gate1[gateBlockCounter]=self.id;
    else if(gateNo==2)
        gate2[gateBlockCounter]=self.id;
    else if(gateNo==3)
        gate3[gateBlockCounter]=self.id;
    else if(gateNo==4)
        gate4[gateBlockCounter]=self.id;
    if(gateNo)
        gates[self.id]=self;
    else
        blocks[self.id]=self;
    ctx.restore();
}
var generateButtons = function() {
    for(let i=0;i<buttonString.length;i++) {
        drawButtons(buttonString[i][0],buttonString[i][1],buttonString[i][2],buttonString[i][3]);
    }
    var blinkBtn = setInterval(() => {
        // for(let id in buttonsSet1) {
        //     if(buttonsSet1[id].blink)
        //         buttonsSet1[id].fill = buttonsSet1[id].fill=="#ff7777"?"red":"#ff7777"; 
        // }
        // for(let id in buttonsSet2) {
        //     if(buttonsSet2[id].blink)
        //         buttonsSet2[id].fill = buttonsSet2[id].fill=="#ff7777"?"red":"#ff7777"; 
        // }
        // for(let id in buttonsSet3) {
        //     if(buttonsSet3[id].blink)
        //         buttonsSet3[id].fill = buttonsSet3[id].fill=="#ff7777"?"red":"#ff7777"; 
        // }
        for(let id in buttons) {
            if(buttons[id].blink)
                buttons[id].fill = buttons[id].fill=="#ff7777"?"red":"#ff7777"; 
        }
        if(!enterStage4)
            clearInterval(blinkBtn);
    }, 300);
}
var drawButtons = function(x,y,z,indexPos) {
    self = {
        id:Math.random(),
        x:x,y:y,fill:"#ff7777",
        blink:false,
    }
    self.update = function(obj,x,y){
        ctx.save();
        ctx.lineWidth = 4;
        ctx.fillStyle = obj.fill;
        ctx.beginPath();
        ctx.arc(obj.x*50-x,obj.y*50-y, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    if(z==1)
        buttonsSet1[indexPos] = self.id;
    else if(z==2)
        buttonsSet2[indexPos] = self.id;
    else if(z==3)
        buttonsSet3[indexPos] = self.id;
    buttons[self.id] = self;
    
}
// blockBoundary = function() {
//     for(let id in blocks) {
//         if(player.s4x + player.width > blocks[id].x*50 && player.s4x < blocks[id].x*50
//             && (player.s4y >= blocks[id].y*50 + blocks[id].height && 
//                 player.s4y + player.height>=blocks[id].y*50)){
//                     player.s4x = blocks[id].x*50 - player.width;
//                     // alert(1);
//                 }  
//         if(player.s4x < blocks[id].x*50 + blocks[id].width
//             && player.s4x + player.width > blocks[id].x*50 + blocks[id].width
//             && (player.s4y >= blocks[id].y*50 + blocks[id].height && 
//                 player.s4y + player.height>=blocks[id].y*50)){
//                     player.s4x = blocks[id].x*50 + blocks[id].width;
//                     // alert(2);
//                 }
//         if(player.s4y + player.height > blocks[id].y*50 && player.s4y < blocks[id].y*50
//             && (player.s4x + player.width >= blocks[id].x*50 && 
//                 player.s4x <= blocks[id].x*50 + blocks[id].width)) {
//                     player.s4x-=player.xspd;
//                     player.s4y = blocks[id].y*50 - player.height;
//                     // alert(3);
//                 }
//         if(player.s4y < blocks[id].y*50 + blocks[id].height && player.s4y + player.height > blocks[id].y*50 + blocks[id].height
//             && (player.s4x + player.width >= blocks[id].x*50 &&
//                 player.s4x <= blocks[id].x*50 + blocks[id].width)) {
//                     player.s4x-=player.xspd;
//                     player.s4y = blocks[id].y*50 + blocks[id].height;
//                     // alert(4);
//                 }
//     }
// }
//...........................................................................
var delB = function(blockSet) {
    let deleteSetIntervalVar;
    let gateBlockCnt=0;
    deleteSetIntervalVar = setInterval(() => {
        delete gates[blockSet[gateBlockCnt++]];
        if(gateBlockCnt>=blockSet.length)
            clearInterval(deleteSetIntervalVar);
    }, deleteSpeed);
}
// ..........................................................................
var radius = 110;
var radiusConstant = 1;
var add = true;
var drawMovingBubbles = function(x=1,y=3,xMovement=0,yMovement=0) {
    ctx.save();
    if(radius>150)
        add=false;
    else if(radius<100)
        add=true;
    if(add)
        radius+=radiusConstant;
    else
        radius-=radiusConstant;
    ctx.lineWidth = 6;
    ctx.fillStyle = "#ff7777";
    ctx.beginPath();
    ctx.arc(x*50+xMovement,y*50+yMovement, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}
buttonReset = function() {
    if(buttonResetLimit > 0){
        buttons[buttonsSet1[0]].blink = false;
        buttons[buttonsSet1[1]].blink = true;
        buttons[buttonsSet1[2]].blink = false;
        buttons[buttonsSet1[3]].blink = true;
        buttons[buttonsSet2[0]].blink = false;
        buttons[buttonsSet2[1]].blink = true;
        buttons[buttonsSet2[2]].blink = false;
        buttons[buttonsSet2[3]].blink = true;
        buttons[buttonsSet3[0]].blink = false;
        buttons[buttonsSet3[1]].blink = true;
        buttons[buttonsSet3[2]].blink = false;
        buttons[buttonsSet3[3]].blink = true;
        buttons[buttonsSet3[4]].blink = false;
        buttonLimit=6;
        buttonResetLimit--;
    } else {
        buttonsSet1.shuffle();
        buttonsSet1.shuffle();
        buttonsSet2.shuffle();
        buttonResetLimit=2;
        buttonReset();
    }
}