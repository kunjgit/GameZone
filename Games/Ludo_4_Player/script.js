
var step = document.getElementsByClassName('astep');
var rdice = document.getElementsByClassName('r-dice');
var gdice = document.getElementsByClassName('g-dice');
var bdice = document.getElementsByClassName('b-dice');
var ydice = document.getElementsByClassName('y-dice');



var dicesound= document.getElementById("diceSound"); 
var killedsound= document.getElementById("killedSound"); 
var winsound= document.getElementById("winSound"); 
var inoutsound= document.getElementById("inoutSound"); 
var stepsound= document.getElementById("stepSound"); 

var r=document.getElementsByClassName('r');
var g=document.getElementsByClassName('g');
var b=document.getElementsByClassName('b');
var y=document.getElementsByClassName('y');

var ri=document.getElementsByClassName('ri')[0];
var gi=document.getElementsByClassName('gi')[0];
var yi=document.getElementsByClassName('yi')[0];
var bi=document.getElementsByClassName('bi')[0];

var play=document.getElementsByClassName('play')[0];

var playerzone= document.getElementsByClassName('player');
var playerroom= document.getElementsByClassName('playerzone');
var playername=document.getElementsByClassName('playername');
var mplayername=document.getElementsByClassName('mplayername');
var welcomescreen=document.getElementsByClassName('welcome')[0];
var pp=[];

play.addEventListener("click",function(){
     if(gi.value===""){
         var i;
         for(i=0;i<4;i++){
             g[i].style.display="none";
         }
       gdice[0].style.display="none";
       gdice[1].style.display="none";
       totalplayer-=1;
         playername[2].innerHTML="";
         mplayername[1].innerHTML="";
   }else{
       playername[2].innerHTML=gi.value;
       mplayername[1].innerHTML=gi.value;
       pp.push('g');
   }
    
    
   if(ri.value===""){
       var i;
         for(i=0;i<4;i++){
             r[i].style.display="none";
         }
       rdice[0].style.display="none";
       rdice[1].style.display="none";
       totalplayer-=1;
       playername[0].innerHTML="";
       mplayername[0].innerHTML="";
   }else{
       playername[0].innerHTML=ri.value;
       mplayername[0].innerHTML=ri.value;
       pp.push('r');
   }
   
    
    
    
    if(yi.value===""){
        var i;
         for(i=0;i<4;i++){
             y[i].style.display="none";
         }
       ydice[0].style.display="none";
       ydice[1].style.display="none";
       totalplayer-=1;
        playername[3].innerHTML="";
        mplayername[3].innerHTML="";
   }else{
       playername[3].innerHTML=yi.value;
       mplayername[3].innerHTML=yi.value;
       pp.push('y');
   }
    
    
    
    
    if(bi.value===""){
        var i;
         for(i=0;i<4;i++){
             b[i].style.display="none";
         }
       bdice[0].style.display="none";
       bdice[1].style.display="none";
       totalplayer-=1;
        playername[1].innerHTML="";
        mplayername[2].innerHTML="";
   }else{
       playername[1].innerHTML=bi.value;
       mplayername[2].innerHTML=bi.value;
      pp.push('b');
   }
    if(pp[0]==='r'){
    rdice[0].style.display="";
    rdice[1].style.display="";
}
if(pp[0]==='g'){
    gdice[0].style.display="";
    gdice[1].style.display="";
}
if(pp[0]==='y'){
    ydice[0].style.display="";
    ydice[1].style.display="";
}
if(pp[0]==='b'){
    bdice[0].style.display="";
    bdice[1].style.display="";
}
    if(pp.length<2){
        alert('Please Enter Atleast 2 Players !');
        return 0;
    }else{
    welcomescreen.remove();    
    }
    
});



gdice[0].style.display="none";
rdice[0].style.display="none";
ydice[0].style.display="none";
bdice[0].style.display="none";
gdice[1].style.display="none";
ydice[1].style.display="none";
bdice[1].style.display="none";
rdice[1].style.display="none";




var redpath=[19,20,21,22,23,15,12,9,6,3,0,1,2,5,8,11,14,17,24,25,26,27,28,29,41,53,52,51,50,49,48,56,59,62,65,68,71,70,69,66,63,60,57,54,47,46,45,44,43,42,30,31,32,33,34,35];
var greenpath=[5,8,11,14,17,24,25,26,27,28,29,41,53,52,51,50,49,48,56,59,62,65,68,71,70,69,66,63,60,57,54,47,46,45,44,43,42,30,18,19,20,21,22,23,15,12,9,6,3,0,1,4,7,10,13,16];
var bluepath=[66,63,60,57,54,47,46,45,44,43,42,30,18,19,20,21,22,23,15,12,9,6,3,0,1,2,5,8,11,14,17,24,25,26,27,28,29,41,53,52,51,50,49,48,56,59,62,65,68,71,70,67,64,61,58,55];
var yellowpath=[52,51,50,49,48,56,59,62,65,68,71,70,69,66,63,60,57,54,47,46,45,44,43,42,30,18,19,20,21,22,23,15,12,9,6,3,0,1,2,5,8,11,14,17,24,25,26,27,28,29,41,40,39,38,37,36];
var rp=[-1,-1,-1,-1];
var gp=[-1,-1,-1,-1];
var bp=[-1,-1,-1,-1];
var yp=[-1,-1,-1,-1];

var rstate=[0,0,0,0];
var gstate=[0,0,0,0];
var bstate=[0,0,0,0];
var ystate=[0,0,0,0];

var moves=[0,0,0,0];
var safeplace=[19,6,5,27,52,65,66,44];

var totalplayer=4;

var totalpr=4;
var totalpg=4;
var totalpy=4;
var totalpb=4;

var winpos=[];
//winner
function winner(pl){
    if(pl==='r'){
        if(totalpr===0){
            winsound.play();
            winpos.push(pl);
            rdice[0].style.display="none";
            rdice[1].style.display="none";
            var winno = winpos.indexOf('r')+1;
            playerroom[0].innerHTML="<img src='assets/images/crown"+winno+".png' class='crown'>";
            pmove=7;
            moves[0]=0;
            diceRotation(0);
        }
    }
    if(pl==='g'){
        if(totalpg===0){
            winsound.play();
            winpos.push(pl);
            gdice[0].style.display="none";
            gdice[1].style.display="none";
            var winno = winpos.indexOf('g')+1;
            playerroom[1].innerHTML="<img src='assets/images/crown"+winno+".png' class='crown'>";
             moves[1]=0;
            pmove=7;
            diceRotation(1);
        }
    }
    if(pl==='b'){
        if(totalpb===0){
            winsound.play();
            winpos.push(pl);
            bdice[0].style.display="none";
            bdice[1].style.display="none";
            var winno = winpos.indexOf('b')+1;
            playerroom[2].innerHTML="<img src='assets/images/crown"+winno+".png' class='crown'>";
             moves[3]=0;
            pmove=7;
            diceRotation(3);
        }
    }
    if(pl==='y'){
        if(totalpy===0){
            winsound.play();
            winpos.push(pl);
            ydice[0].style.display="none";
            ydice[1].style.display="none";
            
            var winno = winpos.indexOf('y')+1;
            playerroom[3].innerHTML="<img src='assets/images/crown"+winno+".png' class='crown'>";
             moves[2]=0;
            pmove=7;
            diceRotation(2);
        }
    }
}


function motionOn(pno){
    if(pno===0){
        var i;
        for(i=0;i<4;i++){
           
              r[i].classList.add("animate__animated","animate__tada");   
              y[i].classList.remove("animate__animated","animate__tada");  
              g[i].classList.remove("animate__animated","animate__tada");  
              b[i].classList.remove("animate__animated","animate__tada");
            r[i].style.zIndex="+99";
            g[i].style.zIndex="0";
            b[i].style.zIndex="0";
            y[i].style.zIndex="0";
        }
            
        
    }else if(pno===1){
        var i;
        for(i=0;i<4;i++){
           
              g[i].classList.add("animate__animated","animate__tada");
        r[i].classList.remove("animate__animated","animate__tada");  
              y[i].classList.remove("animate__animated","animate__tada");    
              b[i].classList.remove("animate__animated","animate__tada");
            
             r[i].style.zIndex="0";
            g[i].style.zIndex="+99";
            b[i].style.zIndex="0";
            y[i].style.zIndex="0";
        }
        
    }else if(pno===2){
        var i;
        for(i=0;i<4;i++){
           
              y[i].classList.add("animate__animated","animate__tada");
        r[i].classList.remove("animate__animated","animate__tada");  
              g[i].classList.remove("animate__animated","animate__tada");  
              b[i].classList.remove("animate__animated","animate__tada");
            
             r[i].style.zIndex="0";
            g[i].style.zIndex="0";
            b[i].style.zIndex="0";
            y[i].style.zIndex="+99";
        }
    }else if(pno===3){
        var i;
        for(i=0;i<4;i++){
           
              b[i].classList.add("animate__animated","animate__tada");
            r[i].classList.remove("animate__animated","animate__tada");  
              y[i].classList.remove("animate__animated","animate__tada");  
              g[i].classList.remove("animate__animated","animate__tada");  
             r[i].style.zIndex="0";
            g[i].style.zIndex="0";
            b[i].style.zIndex="+99";
            y[i].style.zIndex="0";
    }
    }else{
       for(i=0;i<r.length;i++){
           
              r[i].classList.remove("animate__animated","animate__tada");  
              y[i].classList.remove("animate__animated","animate__tada");  
              g[i].classList.remove("animate__animated","animate__tada");  
              b[i].classList.remove("animate__animated","animate__tada");  
            
        } 
    }
}

var pmove;
function diceRotation(pno){
   
     
    if(pno===0){
        if(pp.includes('r')){
            
        
        if(winpos.includes('r')){
            diceRotation(1);
            return 0;
        }    
       
        setTimeout(function(){
            
            if(pmove===6 || pmove===7){
                return 0;
            }
           
            if(rstate.includes(1) && moves[0]>0){
                
                
            }else{
               
               rdice[0].style.display="none";
                rdice[1].style.display="none";
              if(pp.includes('g')){
                gdice[0].style.display="";
                gdice[1].style.display="";    
              }else if(pp.includes('y')){
                 ydice[0].style.display="";
                ydice[1].style.display="";  
              }else if(pp.includes('b')){
                  bdice[0].style.display="";
                bdice[1].style.display=""; 
              }
                
            }
           
                    
                
            }
        ,800);
            
        }else{
            pmove=7;
            diceRotation(1);
        }
    }
    
    if(pno===1){
        if(pp.includes('g')){
            
        
        if(winpos.includes('g')){
            diceRotation(2);
            return 0;
        }
        
            setTimeout(function(){
            if(pmove===6 || pmove===7){
                return 0;
            }
             
            if(gstate.includes(1) && moves[1]>0){
                
            }else{
               gdice[0].style.display="none";
                gdice[1].style.display="none";
                if(pp.includes('y')){
                 ydice[0].style.display="";
                ydice[1].style.display="";  
              }else if(pp.includes('b')){
                  bdice[0].style.display="";
                bdice[1].style.display=""; 
              }else if(pp.includes('r')){
                  rdice[0].style.display="";
                rdice[1].style.display=""; 
              }  
            }
           
                    
                
            }
        ,800);
        }else{
            pmove=7;
            diceRotation(2);
        }
    }
                   
    if(pno===2){
        if(pp.includes('y')){
            
        
        if(winpos.includes('y')){
            diceRotation(3);
            return 0;
        }
       
        setTimeout(function(){
            if(pmove===6 || pmove===7){
                return 0;
            }
            
            
            if(ystate.includes(1) && moves[2]>0){
                
            }else{
               ydice[0].style.display="none";
                ydice[1].style.display="none";
              
                if(pp.includes('b')){
                  bdice[0].style.display="";
                bdice[1].style.display=""; 
              }else if(pp.includes('r')){
                  rdice[0].style.display="";
                rdice[1].style.display=""; 
              } else if(pp.includes('g')){
                  gdice[0].style.display="";
                gdice[1].style.display=""; 
              }
            }
           
                    
                
            }
        ,800);
        }else{
            pmove=7;
            diceRotation(3);
        }
        
    }
    
    if(pno===3){
        if(pp.includes('b')){
            
        
        if(winpos.includes('b')){
            diceRotation(0);
            return 0;
        }
       
      setTimeout(function(){
            if(pmove===6 || pmove===7){
                
                return 0;
            }
              
            
            if(bstate.includes(1) && moves[3]>0){
                
            }else{
               bdice[0].style.display="none";
                bdice[1].style.display="none";
                if(pp.includes('r')){
                  rdice[0].style.display="";
                rdice[1].style.display=""; 
              }else if(pp.includes('g')){
                  gdice[0].style.display="";
                gdice[1].style.display=""; 
              }else if(pp.includes('y')){
                  ydice[0].style.display="";
                ydice[1].style.display=""; 
              }  
            }
           
                    
                
            }
        ,800);
        
    }else{
        pmove=7;
        diceRotation(0);
    }
}
}

function dice(obj,pno){
    dicesound.play();
    var num=Math.floor((Math.random() * 6) + 1);
    pmove=num;
    obj.innerHTML=num;

       moves[pno]=num;
motionOn(pno);
    diceRotation(pno); 
}
    
  


//killing
function kill(pno,p){
    
    if(p===0){
        
        if(safeplace.includes(redpath[rp[pno]])){
            return 0;
        }
        var i;
        for(i=0;i<4;i++){
           var blue = '<span onclick="moveblue(this,'+i+')" class="rp material-icons b" style="z-index: 0;">stars</span>'; 
           var green = '<span onclick="movegreen(this,'+i+')" class="rp material-icons g" style="z-index: 0;">stars</span>'; 
           
           var yellow = '<span onclick="moveyellow(this,'+i+')" class="rp material-icons y" style="z-index: 0;">stars</span>'; 
            
            
            
            var check = step[redpath[rp[pno]]].innerHTML;
        if(check===green){
            killedsound.play();
            step[redpath[rp[pno]]].innerHTML="";
            gp[i]=-1;
            gstate[i]=0;
            playerzone[4+i].innerHTML=green;
            pmove=7;
            diceRotation(0);
            return 1427;
        }else if(check===blue){
            killedsound.play();
            step[redpath[rp[pno]]].innerHTML="";
            bp[i]=-1;
            bstate[i]=0;
            playerzone[8+i].innerHTML=blue;
            pmove=7;
            diceRotation(0);
            return 1427;
        }else if(check===yellow){
            killedsound.play();
            step[redpath[rp[pno]]].innerHTML="";
            yp[i]=-1;
            ystate[i]=0;
            playerzone[12+i].innerHTML=yellow;
            pmove=7;
            diceRotation(0);
            return 1427;
        } 
        }
     
    }
    
    
    
    
    if(p===1){
        if(safeplace.includes(greenpath[gp[pno]])){
            return 0;
        }
        var i;
        for(i=0;i<4;i++){
           var blue = '<span onclick="moveblue(this,'+i+')" class="rp material-icons b" style="z-index: 0;">stars</span>'; 
           var red = '<span onclick="movered(this,'+i+')" class="rp material-icons r" style="z-index: 0;">stars</span>'; 
           var yellow = '<span onclick="moveyellow(this,'+i+')" class="rp material-icons y" style="z-index: 0;">stars</span>'; 
            
            var check = step[greenpath[gp[pno]]].innerHTML;
        if(check===red){
            killedsound.play();
            step[greenpath[gp[pno]]].innerHTML="";
            rp[i]=-1;
            rstate[i]=0;
            playerzone[0+i].innerHTML=red;
            pmove=7;
            diceRotation(1);
            return 1427;
        }else if(check===blue){
            killedsound.play();
            step[greenpath[gp[pno]]].innerHTML="";
            bp[i]=-1;
            bstate[i]=0;
            playerzone[8+i].innerHTML=blue;
            pmove=7;
            diceRotation(1);
            return 1427;
        }else if(check===yellow){
            killedsound.play();
            step[greenpath[gp[pno]]].innerHTML="";
            yp[i]=-1;
            ystate[i]=0;
            playerzone[12+i].innerHTML=yellow;
            pmove=7;
            diceRotation(1);
            return 1427;
        } 
        }
     
    }
    
    
    
    
    if(p===2){
        if(safeplace.includes(bluepath[bp[pno]])){
            return 0;
        }
        var i;
        for(i=0;i<4;i++){
           var red = '<span onclick="movered(this,'+i+')" class="rp material-icons r" style="z-index: 0;">stars</span>'; 
           var green = '<span onclick="movegreen(this,'+i+')" class="rp material-icons g" style="z-index: 0;">stars</span>'; 
           var yellow = '<span onclick="moveyellow(this,'+i+')" class="rp material-icons y" style="z-index: 0;">stars</span>'; 
            
            var check = step[bluepath[bp[pno]]].innerHTML;
        if(check===green){
            killedsound.play();
            gp[i]=-1;
            gstate[i]=0;
            playerzone[4+i].innerHTML=green;
            pmove=7;
            diceRotation(3);
            return 1427;
        }else if(check===red){
            killedsound.play();
            step[bluepath[bp[pno]]].innerHTML="";
            rp[i]=-1;
            rstate[i]=0;
            playerzone[0+i].innerHTML=red;
            pmove=7;
            diceRotation(3);
            return 1427;
        }else if(check===yellow){
            killedsound.play();
            step[bluepath[bp[pno]]].innerHTML="";
            yp[i]=-1;
            ystate[i]=0;
            playerzone[12+i].innerHTML=yellow;
            pmove=7;
            diceRotation(3);
            return 1427;
        } 
        }
     
    }
    
 if(p===3){
     if(safeplace.includes(yellowpath[yp[pno]])){
            return 0;
        }
        var i;
        for(i=0;i<4;i++){
           var blue = '<span onclick="moveblue(this,'+i+')" class="rp material-icons b" style="z-index: 0;">stars</span>'; 
           var green = '<span onclick="movegreen(this,'+i+')" class="rp material-icons g" style="z-index: 0;">stars</span>'; 
           var red = '<span onclick="movered(this,'+i+')" class="rp material-icons r" style="z-index: 0;">stars</span>'; 
            
            var check = step[yellowpath[yp[pno]]].innerHTML;
        if(check===green){
            killedsound.play();
            step[yellowpath[yp[pno]]].innerHTML="";
            gp[i]=-1;
            gstate[i]=0;
            playerzone[4+i].innerHTML=green;
            pmove=7;
            diceRotation(2);
            return 1427;
        }else if(check===blue){
            killedsound.play();
            step[yellowpath[yp[pno]]].innerHTML="";
            bp[i]=-1;
            bstate[i]=0;
            playerzone[8+i].innerHTML=blue;
            pmove=7;
            diceRotation(2);
            return 1427;
        }else if(check===red){
            killedsound.play();
            step[yellowpath[yp[pno]]].innerHTML="";
            rp[i]=-1;
            rstate[i]=0;
            playerzone[0+i].innerHTML=red;
            pmove=7;
            diceRotation(2);
            return 1427;
        } 
        }
     
    }
    
    
    
}

function movered(obj,pno){
    if(moves[0]===0){
        return 0;
    }
    if(rstate[pno]===1){
        rp[pno]+=moves[0];
       
        if(rp[pno]>56){
            rp[pno]-=moves[0];
            
            return 0;
        }
        if(rp[pno]===56){
            inoutsound.play();
            totalpr-=1;
            winner('r');
            rstate[pno]=0;
            obj.style.display="none";
            return 0;
            
        }
        motionOn(5);
         kill(pno,0);
        
    moves[0]=0;
    if(rp[pno]>-1){
       var prevpl = step[redpath[rp[pno]]].innerHTML; 
    }
    var i;
    for(i=0;i<step.length;i++){
        if(rp[pno]===i){
            stepsound.play();
          step[redpath[rp[pno]]].innerHTML="<span onclick='movered(this,"+pno+")' class='rp material-icons r'>stars</span>"+prevpl; 
        }else{
            obj.remove();
        }
//        kill();
    }
    }else{
        if(moves[0]===6){
            rstate[pno]=1;
            rp[pno]+=1;
            inoutsound.play();
            obj.remove();
            var prevpl = step[redpath[rp[pno]]].innerHTML; 
            step[redpath[rp[pno]]].innerHTML="<span onclick='movered(this,"+pno+")' class='rp material-icons r'>stars</span>"+prevpl;
            moves[0]=0; 
        }
           
        
    }
    diceRotation(0);
}

function movegreen(obj,pno){
    if(moves[1]===0){
        return 0;
    }
    if(gstate[pno]===1){
        gp[pno]+=moves[1];
        if(gp[pno]>56){
            gp[pno]-=moves[1];
            return 0;
        }
        if(gp[pno]===56){
            inoutsound.play();
            totalpg-=1;
            winner('g');
            obj.style.display="none";
            gstate[pno]=0;
            return 0;
        }
         motionOn(5);
        kill(pno,1);
       
    moves[1]=0;
    if(gp[pno]>-1){
       var prevpl = step[greenpath[gp[pno]]].innerHTML; 
    }
    var i;
    for(i=0;i<step.length;i++){
        if(gp[pno]===i){
            stepsound.play();
          step[greenpath[gp[pno]]].innerHTML="<span onclick='movegreen(this,"+pno+")' class='rp material-icons g'>stars</span>"+prevpl; 
        }else{
            obj.remove();
        }
    }
    }else{
        if(moves[1]===6){
            gstate[pno]=1;
            gp[pno]+=1;
            inoutsound.play();
            obj.remove();
            var prevpl = step[greenpath[gp[pno]]].innerHTML; 
            step[greenpath[gp[pno]]].innerHTML="<span onclick='movegreen(this,"+pno+")' class='rp material-icons g'>stars</span>"+prevpl;
            moves[1]=0;
        }
            
        
    }
    diceRotation(1);
}


function moveblue(obj,pno){
    if(moves[3]===0){
        return 0;
    }
    if(bstate[pno]===1){
        bp[pno]+=moves[3];
        
        if(bp[pno]>56){
            bp[pno]-=moves[3];
            return 0;
        }
        if(bp[pno]===56){
    inoutsound.play();
            totalpb-=1;
            winner('b');
            obj.style.display="none";
            bstate[pno]=0;
            return 0;
        }
        motionOn(5);
        kill(pno,2);
        
    moves[3]=0;
    if(bp[pno]>-1){
       var prevpl = step[bluepath[bp[pno]]].innerHTML; 
    }
    var i;
    for(i=0;i<step.length;i++){
        if(bp[pno]===i){
            stepsound.play();
          step[bluepath[bp[pno]]].innerHTML="<span onclick='moveblue(this,"+pno+")' class='rp material-icons b'>stars</span>"+prevpl; 
        }else{
            obj.remove();
        }
    }
    }else{
        if(moves[3]===6){
            bstate[pno]=1;
            bp[pno]+=1;
            inoutsound.play();
            obj.remove();
            var prevpl = step[bluepath[bp[pno]]].innerHTML; 
            step[bluepath[bp[pno]]].innerHTML="<span onclick='moveblue(this,"+pno+")' class='rp material-icons b'>stars</span>"+prevpl;
            moves[3]=0;
        }
            
        
    }
    diceRotation(3);
}


function moveyellow(obj,pno){
    if(moves[2]===0){
        return 0;
    }
    if(ystate[pno]===1){
        yp[pno]+=moves[2];
        
        if(yp[pno]>56){
            yp[pno]-=moves[2];
            return 0;
        }
        if(yp[pno]===56){
inoutsound.play();
            totalpy-=1;
            winner('y');
            obj.style.display="none";
            ystate[pno]=0;
            return 0;
        }
        motionOn(5);
        kill(pno,3);
        
    moves[2]=0;
    if(yp[pno]>-1){
       var prevpl = step[yellowpath[yp[pno]]].innerHTML; 
    }
    var i;
    for(i=0;i<step.length;i++){
        if(yp[pno]===i){
            stepsound.play();
          step[yellowpath[yp[pno]]].innerHTML="<span onclick='moveyellow(this,"+pno+")' class='rp material-icons y'>stars</span>"+prevpl; 
        }else{
            obj.remove();
        }
    }
    }else{
        if(moves[2]===6){
            ystate[pno]=1;
            yp[pno]+=1;
            inoutsound.play();
            obj.remove();
            var prevpl = step[yellowpath[yp[pno]]].innerHTML; 
            step[yellowpath[yp[pno]]].innerHTML="<span onclick='moveyellow(this,"+pno+")' class='rp material-icons y'>stars</span>"+prevpl;
            moves[2]=0;
        }
            
        
    }
    diceRotation(2);
}

