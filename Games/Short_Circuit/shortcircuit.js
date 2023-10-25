/*
    SHORT CIRCUIT  - created for http://js13kgames.com/
    Author: Vincent Le Quang
*/


   var sound = true;
   var audioContext, banAudio;
   function playMusic() {
       if(!audioContext) {
          audioContext = window.AudioContext ? new AudioContext :
              window.webkitAudioContext ? new window.webkitAudioContext : null;
          if(!audioContext) banAudio = true;
       }
   }

   var nn = [200,300,400,500,600,800,900,1000];
   var osc = [];
   var oscValue = 0;
   var notes = [];
   var noteIndex = 0;
   var lastNote = 0;
   var stopMusicTimeout = null;
   var changeTune = false;
   var maxLevel = 0;
   var pink = false;
   function playNote() {
     
     if(!sound || banAudio) return;
     playMusic();

     clearTimeout(stopMusicTimeout);
     if(lastRefresh-lastNote>180) {
        lastNote = lastRefresh;
        if(!notes[noteIndex] || changeTune && Math.random()<.3) {
           notes[noteIndex] = nn[parseInt(Math.random()*nn.length)];
           changeTune = false;
        }
        if(oscValue != notes[noteIndex]) {
            if(oscValue && osc[oscValue]) osc[oscValue].disconnect();
            oscValue = notes[noteIndex];
            if(!osc[oscValue]) {
              if(audioContext) {
                 osc[oscValue] = audioContext.createOscillator();
                 osc[oscValue].frequency.value = oscValue;
                 osc[oscValue].start(0);
              }
            }
            if(audioContext) {
               osc[oscValue].connect(audioContext.destination);
            }
        }
        noteIndex= (noteIndex+1)%8;
     }
     stopMusicTimeout = setTimeout(stopMusic,100);
   }
   function stopMusic() {
     var oscillator = osc[oscValue];
     if(oscillator)
        oscillator.disconnect();
     notes = [];
   }

   function restart() {
      setLevel(level);
   }

   function setLevel(lvl) {
      level = lvl;
      maxLevel = Math.max(level,maxLevel);
      elems = getMap(lvl);
      levelStart = 0;
      lastRefresh = 0;
      setTimeout(checkConnect,1000);
      if(level) {
       setHash('level',level);
      }
   }

   function promptRestart() {
     if(popDialog.style.display=="") {
        popDialog.style.display = "none";
        return;
     }

     var bottomSpace = is_touch_device() ? 30 : 60;
     var maxRect = Math.min(window.innerWidth, window.innerHeight-bottomSpace);

      popDialog.style.display = "";
      var left = (is_touch_device()?maxRect/2:window.innerWidth/2) - popDialog.offsetWidth/2;
      var top = (is_touch_device()?maxRect/3:window.innerHeight/2) - popDialog.offsetHeight/2;
      popDialog.style.left = popDialog.style.posLeft = left;
      popDialog.style.top = popDialog.style.posTop = top;

      resetHeaders();
   }

   function resize(e) {
     var retina = isRetina;
     
     var bottomSpace = is_touch_device() ? 30 : 60;
     var scale = retina?.5:1;
     var maxRect = Math.min(window.innerWidth, window.innerHeight-bottomSpace);
     var goodSize = Math.min(800,Math.max(240,Math.floor(maxRect/10)*10));
     var innerSize = retina?2*goodSize:goodSize;
     if(canvas.width != innerSize) {
        
        canvas.style.width = canvas.style.height = goodSize+"px";
        canvas.width = canvas.height = innerSize;
        ctx.scale(scale,scale);
        refreshView();
      
        refreshPad();
     }
   }

   function parseMap(map) {
     var elements = [];
     var lines = map.split(String.fromCharCode(10)).filter(function(line) { return line.trim()!="";});
     for(var y=0;y<lines.length;y++) {
        for(var x=0;x<lines[y].length/2;x++) {
           var cell = lines[y].substr(x*2,2);
           var elem = null;
           switch(cell.charAt(0)) {
              case 'S':
                 elem = {type:'secret', x:x, y:y};
                 elem.floor = true;
                 break;
              case 'X':
                 elem = {type:'hole', x:x, y:y};
                 elem.floor = true;
                 elem.block = true;
                 addCircuit(elem,cell);
                 break;
              case '^':
                 elem = {type:'hero', x:x, y:y};
                 elem.type = 'hero'; elem.dx = elem.dy = 0;
                 break;
              case 'D':
                 elem = {type:'door', x:x, y:y};
                 elem.block = true;
                 elem.floor = true;
                 addCircuit(elem,cell);
                 break;
              case 'F':
                 elem = {type:'floor', x:x, y:y};
                 elem.floor = true;
                 addCircuit(elem,cell);
                 break;
              case 'R': // rock
                 elem = {type:'boulder', x:x, y:y};
                 addCircuit(elem,cell);
                 break;
              case 'B':
                 elem = {type:'block', x:x, y:y};
                 elem.block = true;
                 addCircuit(elem,cell);
                 break;
              case 'E':
                 elem = {type:'block', x:x, y:y};
                 elem.block = true;
                 elem.energy = true;
                 addCircuit(elem,cell);
                 break;
              case '~':
                 elem = {type:'sign', x:x, y:y};
                 elem.floor = true;
                 elem.letter = cell.charAt(1);
                 break;
           }
           if(elem) elements.push(elem);
        }
     }
     return elements;
   }

   function getMap(index) {
     var maps = document.getElementsByTagName("map");
     if(index>=maps.length) {
         return null;
     }
     return parseMap(maps[index].innerHTML)
   }

   function addCircuit(elem,cell) {
      var circuit = parseInt(cell.charAt(1),16);
      if(circuit && !isNaN(circuit)) {
          elem.circuit = circuit;
      }
   }

   var elems = [];
/*
   var elems = [
      { type:'hole', x: 9, y:9, floor:true },
      { type:'hole', x: 0, y:9, floor:true },
      { type:'hole', x: 9, y:0, floor:true },
      { type:'hole', x: 0, y:0, floor:true },
      { type:'hero', x: 1, y:1, dx:0, dy:0 },
      { type:'block', x: 5, y: 5, block: true },
      { type:'block', x: 4, y: 5, block: true, circuit:2, energy:true },
      { type:'boulder', x: 6, y: 6, circuit: 10},
      { type:'boulder', x: 3, y: 6, circuit: 12},
      { type:'door', x:2, y:2, block: true, circuit:8, floor:true },
      { type:'floor', x:3, y:3, floor: true, circuit:3 },
      { type:'floor', x:4, y:2, floor: true, circuit:9 },
      { type:'floor', x:2, y:3, floor: true, circuit:6 },
      { type:'boulder', x: 3, y: 4, circuit: 10},
   ];
*/


   var level = 0;



   var key= {};
   var active = true;
   var canvas = document.getElementById('view');
   var cellSize = canvas.width/10;
   var ctx = canvas.getContext('2d');
   var canvas2 = document.getElementById('controls-portrait');
   var ctx2 = canvas2.getContext ('2d');
   var popDialog = document.getElementById('popDialog');
   var steps = 0;
   

   var lastRefresh = 0;
   var levelStart = 0;

   function clearAll() {
     ctx.clearRect(0,0,10*cellSize,10*cellSize);
   }

   function fadeTitle() {
      var alpha = Math.max(0,Math.min(1,(levelStart+2500-lastRefresh)/1000));
      if(level>=1 && alpha>0) {
        var text = level+"";
        var shift = text.length>=2?-cellSize:0;
        ctx.font=(cellSize*4)+"px Arial Black";
        ctx.fillStyle="rgba(0, 0, 0, " + alpha + ")";
        ctx.fillText(text,shift+ 3.7*cellSize, 5*cellSize);
        ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
        ctx.lineWidth = cellSize/20;
        ctx.fillStyle="rgba(255, 255, 255, " + alpha + ")";
        ctx.fillText(text,shift+ 3.7*cellSize - cellSize/4, 5*cellSize-cellSize/5);
        ctx.strokeText(text,shift+ 3.7*cellSize - cellSize/4, 5*cellSize-cellSize/5);
      }
   }

   function refreshView(timestamp) {
      if(timestamp-lastRefresh > 1000/30) {
         var retina = isRetina;
     
         var scale = retina?.5:1;
         cellSize = canvas.width/10/scale;
      
         lastRefresh = timestamp;
         if(!levelStart) {
            levelStart = lastRefresh;
         }
         //ctx.clearRect(0,0,cellSize*10,cellSize*10);
         clearAll();

         ctx.fillStyle = "rgb(230,230,230)";
         for(var y=0;y<10;y++) {
           for(var x=0;x<10;x++) {
              refreshCell(x,y);
           }
         }
         refreshElems(elems.filter(function(elem) {return elem.floor;}));
         refreshElems(elems.filter(function(elem) {return !elem.floor;}));

         fadeTitle();
         refreshPad();
         playNote();
      }
      if(active) {
         window.requestAnimationFrame(refreshView);
      }
   }

   function drawPad () {
         var unit = canvas2.width/50;
         ctx2.clearRect (0,0,canvas2.width,canvas2.height);

         var pt=[
        {x:25*unit,y:10*unit},
        {x:10*unit,y:25*unit},
        {x:40*unit,y:25*unit},
        {x:25*unit,y:40*unit}
        ];

         var ak=[38,37,39,40];
        
        
        for (var i=0;i <pt.length;i++){
           if (key [ak [i]]) {
             ctx2.fillStyle = '#AAAAAA';
             ctx2.beginPath ();
             ctx2.moveTo (pt[i].x, pt[i].y);
             ctx2.arc (pt[i].x, pt[i].y, 10*unit, 0, 2*Math.PI, true);
             ctx2.fill ();
           }
         }
        


         ctx2.fillStyle = '#555555';
         ctx2.beginPath ();
         for (var i=0;i <pt.length;i++){
           ctx2.moveTo (pt[i].x, pt[i].y);
           ctx2.arc (pt[i].x, pt[i].y, 8*unit, 0, 2*Math.PI, true);
         }
         ctx2.fill ();

        
   }

   function refreshPad() {
       var retina = isRetina;
     
       var scale = retina?.5:1;
       var portrait = window.innerWidth < window.innerHeight;
       document.getElementById("touchControls").style.display = is_touch_device() && portrait ?"":"none";
       document.getElementById("notouch").style.display = level<=1 && !is_touch_device()?"":"none";
       document.getElementById("controls-landscape").style.display = is_touch_device() && !portrait?"":"none";
       document.getElementById("touchPadding").style.display = is_touch_device() ? "" : "none";
       canvas2 = document.getElementById(portrait?
          'controls-portrait':'controls-landscape');
       if (canvas2.style.display!="none") {
         canvas2.width = canvas2.height = scale* canvas.width/8*5;
         ctx2 = canvas2.getContext ('2d');
         drawPad ();
      }

      var restartButton = document.getElementById("restartButton");
      restartButton.style.display = is_touch_device()?"":"none";
      restartButton.style.left = restartButton.style.posLeft =
            (window.innerWidth-restartButton.offsetWidth-2)+"px";
   }

   function refreshElems(elems) {
      for(var i=0; i<elems.length; i++) {
         switch(elems[i].type) {
            case 'hero':
               refreshHero(elems[i]);
               break;
            case 'block':
               refreshBlock(elems[i]);
               break;
            case 'door':
               refreshDoor(elems[i]);
               break;
            case 'boulder':
               refreshBoulder(elems[i]);
               break;
            case 'floor':
               refreshFloor(elems[i]);
               break;
            case 'hole':
            case 'secret':
               refreshHole(elems[i]);
               break;
            case 'sign':
               drawSign(elems[i]);
               break;
         }
      }
   }

   function refreshBlock(block) {
      var spacing = cellSize/40;
      ctx.fillStyle = "rgb("+200 + Math.round(Math.random()*50)+",0,230)";
      ctx.fillRect (spacing+block.x*cellSize , spacing+block.y*cellSize , cellSize-spacing*2, cellSize-spacing*2);
      ctx.fillStyle = "rgb(150,0,130)";
      ctx.fillRect (spacing+block.x*cellSize , spacing+block.y*cellSize+cellSize*.8 , cellSize-spacing*2, cellSize-spacing*2-cellSize*.8);
      drawEnergy(block);
      drawCircuit(block, '#116600',5,.5);
      drawCircuit(block, block.connected?'#00ffff':'#33ff00',3);
   }

   function drawSign(sign) {
      var x = sign.x, y = sign.y;
      ctx.font= (cellSize)+"px Courier";
      ctx.fillStyle = "#000000";
      ctx.fillRect (x*cellSize , y*cellSize , cellSize, cellSize);
      ctx.fillStyle = "#EEEE22";
      ctx.fillText(sign.letter, sign.x*cellSize, sign.y*cellSize+cellSize/2);
   }

   function refreshBoulder(boulder) {
      if(boulder.pushed) {
         boulder.pushed = false;
         if(!boulder.moving) {
            boulder.moving = true;
            checkConnect();
         }
      } else {
        var dx = (Math.max(0,Math.min(9,Math.round(boulder.x))) - boulder.x)/2;
        var dy = (Math.max(0,Math.min(9,Math.round(boulder.y))) - boulder.y)/2;
        if (dx*dx + dy*dy < .001) {
          if(boulder.moving) {
             boulder.moving = false;
             boulder.x = Math.round(boulder.x);
             boulder.y = Math.round(boulder.y);
             checkConnect();
             if(getElemsAt(boulder.x,boulder.y).some(function(elem){return elem.type=='secret';})) {
                boulder.type=null;
             }
          }
        } else {
          boulder.x += dx;
          boulder.y += dy;
        }
      }

      var margin = cellSize /5;
      ctx.fillStyle = "#888888";
      ctx.fillRect (margin*.8+boulder.x*cellSize , margin*1.5+boulder.y*cellSize , cellSize-2*margin*.8, cellSize-2*margin);
      ctx.fillStyle = "rgb("+100 + Math.round(Math.random()*30)+",100,30)";
      ctx.fillRect (margin+boulder.x*cellSize , margin+boulder.y*cellSize , cellSize-2*margin, cellSize-2*margin);
      drawEnergy(boulder);
      drawCircuit(boulder, '#116600',5,.5);
      drawCircuit(boulder, boulder.connected?'#00ffff':'#33ff00',3);
   }

   function refreshDoor(door) {
      drawEnergy(door);
      drawCircuit(door, '#116600',4,.5,true);
      drawCircuit(door,door.connected?'#00ffff':'#33ff00',2,0,true);

      var x = door.x * cellSize;
      var y = door.y * cellSize;
      var spacing = cellSize/4;

      ctx.fillStyle = "#224400";
      ctx.beginPath();
      ctx.moveTo(x+spacing,y+cellSize-spacing);
      ctx.lineTo(x+cellSize-spacing,y+cellSize-spacing);
      ctx.lineTo(x+cellSize/2,y+spacing/3);
      ctx.fill();

      ctx.fillStyle = "#00ffff";
      ctx.beginPath();
      ctx.moveTo(x+spacing,y+cellSize-spacing);
      ctx.lineTo(x+cellSize-spacing,y+cellSize-spacing);
      ctx.lineTo(x+cellSize/2,y+spacing);
      ctx.fill();

      ctx.fillStyle = "#336600";
      ctx.beginPath();
      var a= door.connected? Math.max(0, 1-(lastRefresh-door.connected)/150) :1;
      ctx.moveTo(x+(spacing)*a + (cellSize/2)*(1-a),y+(cellSize-spacing)*a + (spacing)*(1-a));
      ctx.lineTo(x+(cellSize-spacing)*a+ (cellSize/2)*(1-a),y+(cellSize-spacing)*a + (spacing)*(1-a));
      ctx.lineTo(x+cellSize/2,y+spacing);
      ctx.fill();
      if(door.block && a==0) {
          door.block= false;
      } else if(a!=0 && !door.block) {
          door.block= true;
      }

      if(!door.block) {
         var rand = parseInt(Math.random()*250);
         ctx.fillStyle= "rgb(255,"+rand+",30)";
         ctx.beginPath();
         ctx.moveTo(x+cellSize/2, y - cellSize*rand/500);
         ctx.lineTo(x+cellSize/2-cellSize/5, y-cellSize/4 - cellSize*rand/500);
         ctx.lineTo(x+cellSize/2+cellSize/5, y-cellSize/4 - cellSize*rand/500);
         ctx.fill();
      }
   }

   function getMove(key, hero) {
      var dx = 0, dy = 0;
      if(key[37]) dx--;
      if(key[39]) dx++;
      if(key[38]) dy--;
      if(key[40]) dy++;

      if (!dx && !dy && !steps) {
         dx = hero.dx; dy = hero.dy;
      }

      return [dx, dy];
   }

   function getElemsAt(x,y) {
      return elems.filter(function(elem) { return Math.round(elem.x)==x && Math.round(elem.y)==y;} );
   }
   
   function canGo(hero, x, y, pushed) {
      if(x<0 || y<0 || x>9 || y>9) {
         return false;
      }
      x = Math.round(x);
      y = Math.round(y);

      var curX = Math.round(hero.x);
      var curY = Math.round(hero.y);
      var dx = x - hero.x;
      var dy = y - hero.y;

      var elements = getElemsAt(x, y);
      for(var i=0;i<elements.length;i++) {
          var elem = elements[i];
          if(elem.type==='hero') {
             continue;
          }
          if(elem.block) {
             return false;
          }
          if(pushed && elem!=hero && elem.type=='boulder') {
             return false;
          }
          if(!pushed && elem.type=='boulder') {
             var pushx = dx;
             var pushy = dy;
             if (Math.abs(elem.x - hero.x) > Math.abs(elem.y - hero.y)) {
                pushy = 0;
             } else {
                pushx = 0;
             }
             if(!canGo(elem, x + pushx, y + pushy, true)) {
                 return false;
             }
          }
      }
      return true;
   }

   function limit(x, min, max) {
      return x<min? min : x>max? max : x;
   }

   function push(x,y,dx,dy) {
      var orgx = x;
      var orgy = y;
      x = Math.round(x+dx);
      y = Math.round(y+dy);
      for(var i=0;i<elems.length;i++) {
         var elem = elems[i];
         if(Math.round(elem.x)==x && Math.round(elem.y)==y) {
            if(elem.type=='boulder') {
               if (Math.abs(elem.x - orgx) > Math.abs(elem.y - orgy)) {
                  dy = 0;
               } else {
                  dx = 0;
               }
               
               if(canGo(elem, elem.x + dx, elem.y + dx, true)) {
                  elem.x = limit(elem.x + dx, 0, 9);
                  elem.y = limit(elem.y + dy, 0, 9);
                  elem.pushed = true;
                  return elem;
               } else {
                  return false;
               }
            }
         }
      }
      return succ;
   }
   var succ = {type:'none'};

   function refreshHero(hero) {
        var orgPos = {x:Math.round(hero.x),y:Math.round(hero.y)};
        var [dx, dy] = getMove(key,hero);
        if(hero.exit) {
            dx = 0; dy = 0;
        }
        var maxspeed = hero.maxspeed ? hero.maxspeed: .22;
        hero.dx = dx<0 ? Math.max(hero.dx-.05, -maxspeed) : 
                  dx>0 ? Math.min(hero.dx+.05, maxspeed) :
                  hero.dx / 3;
        hero.dy = dy<0 ? Math.max(hero.dy-.05, -maxspeed) : 
                  dy>0 ? Math.min(hero.dy+.05, maxspeed) :
                  hero.dy / 3;

        

        dx = dx ? hero.dx : (Math.max(0,Math.min(9,Math.round(hero.x+hero.dx))) - hero.x)/2;
        dy = dy ? hero.dy : (Math.max(0,Math.min(9,Math.round(hero.y+hero.dy))) - hero.y)/2;

        if(!canGo(hero, hero.x+dx, hero.y, false)) {
            dx = 0; hero.dx/=2; steps++;
        }
        if(!canGo(hero, hero.x, hero.y+dy, false)) {
            dy = 0; hero.dy/=2; steps++;
        }

        var success = push(hero.x + dx, hero.y + dy, dx, dy);
        if (!success) {
            dx = 0; hero.dx/=2;
            dy = 0; hero.dy/=2;
            steps++;
        } else if(success.type=='boulder') {
            hero.maxspeed = .08;
        } else {
            hero.maxspeed = null;
        }
        if (Math.abs(hero.dx)+Math.abs(hero.dy)<.01) {
           hero.dx = hero.dy = 0;
           steps = 0;
        } else {
           changeTune= true;
        }


        var heroSize = cellSize/4; 
        var shiftX = dx*(heroSize*1.8);
        var shiftY = dy*(heroSize*1.8);

        hero.x = limit(hero.x + dx, 0, 9);
        hero.y = limit(hero.y + dy, 0, 9);

        if(Math.round(hero.x)!=orgPos.x||Math.round(hero.y)!=orgPos.y) {
           steps++;
        }

        if(!hero.exit) {
           var doors = getElemsAt(Math.round(hero.x),Math.round(hero.y)).filter(function(elem) {return elem.type=='door' || elem.type=='secret' || elem.letter;});
           if(doors.length>0) {
              hero.exit = lastRefresh;
           }
        }

        var a= hero.exit? Math.sqrt(Math.max (0,1-(lastRefresh-hero.exit)/250)) :1;
        if(ctx['ellipse']) {
           ctx.fillStyle = '#888888';
           ctx.beginPath();
           ctx.ellipse(hero.x*cellSize + cellSize/2,hero.y*cellSize + (cellSize/2)*a + (cellSize-cellSize/3)*(1-a) + heroSize*a*.8,heroSize*a*.9,heroSize*a/3,0,0,Math.PI*2,true);
           ctx.fill();
        }
        ctx.strokeStyle = pink?'rgb(200,50,50)':'rgb(200,150,30)';
        ctx.fillStyle= pink?'rgb(255,180,150)':'rgb(240,240,30)';
        ctx.lineWidth = heroSize/6;
        ctx.beginPath();
        ctx.arc(hero.x*cellSize + cellSize/2,hero.y*cellSize + (cellSize/2)*a + (cellSize-cellSize/3)*(1-a),heroSize*a,0,Math.PI*2,true);
        ctx.fill();
        ctx.stroke();
        if(!hero.exit) {
           ctx.beginPath();
           ctx.arc(shiftX+hero.x*cellSize + cellSize/2,shiftY+hero.y*cellSize + cellSize/2,heroSize/1.5,Math.PI*.2,Math.PI*.8,false);
           ctx.stroke();
           ctx.beginPath();
           ctx.arc(shiftX+hero.x*cellSize + cellSize/2 - heroSize/3,shiftY+hero.y*cellSize + cellSize/2-3,heroSize/6,-Math.PI*.1,-Math.PI*.9,true);
           ctx.stroke();
           ctx.beginPath();
           ctx.arc(shiftX+hero.x*cellSize + cellSize/2 + heroSize/3,shiftY+hero.y*cellSize + cellSize/2-3,heroSize/6,-Math.PI*.1,-Math.PI*.9,true);
           ctx.stroke();
        }


        if(hero.exit && a==0 && !hero.out) {
            hero.out = true;
            var secrets = getElemsAt(Math.round(hero.x),Math.round(hero.y)).filter(function(elem) {return elem.type=='secret'||elem.letter;});
            if(secrets.length) {
               if(secrets[0].letter) {
                  pink = !pink;
                  setLevel(0);
               } else {
var xx = function(x){return new Array(x).join("X");};
elems = parseMap(
[xx(21),xx(21),xx(9)+'~'+String.fromCharCode(9731)+xx(11),
 xx(9)+".."+xx(11),
 xx(9)+".."+xx(11),
 xx(9)+".."+xx(11),
 xx(9)+".."+xx(11),
 xx(9)+".."+xx(11),
 xx(9)+".."+xx(11),
 xx(9)+"^^"+xx(11)].join(String.fromCharCode(10))
);

               }
            } else {
               nextLevel();
            }
        }
   }

   function nextLevel() {
      setLevel(level+1);
      refreshPad();

      if(!elems) {
          elems = [];
          alert("Game Over");
      }
   }

   function refreshCell(x,y) {
        var spacing = cellSize/8;
        ctx.fillRect (spacing+x*cellSize , spacing+y*cellSize , cellSize-spacing*2, cellSize-spacing*2);
   }

   function refreshHole(hole) {
        var x = hole.x;
        var y = hole.y;
        ctx.fillStyle = "#000000";
        ctx.fillRect (x*cellSize , y*cellSize , cellSize, cellSize);
        drawCircuit(hole, hole.connected?'#00BBBB':'#228800',4);
//        drawCircuit(hole, '#116600',4,.5);
//        drawCircuit(hole, hole.connected?'#00ffff':'#33ff00',2);
   }

   function refreshFloor(floor) {
        var x = floor.x, y = floor.y;
        ctx.fillStyle = "rgb(220,220,230)";
        ctx.fillRect (5+x*cellSize , 5+y*cellSize , cellSize-10, cellSize-10);

        drawEnergy(floor);
        drawCircuit(floor, floor.connected?'#00BBBB':'#228800',4);
//        drawCircuit(floor, '#116600',4,.5);
//        drawCircuit(floor, floor.connected?'#00ffff':'#33ff00',2);
   }
   
   function drawEnergy(elem) {
        if(!elem.energy) return;
        ctx.strokeStyle = 'rgb(200,200,30)';
        ctx.fillStyle= 'rgb(250,250,30)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(elem.x*cellSize + cellSize/2,elem.y*cellSize + cellSize/2,10,0,Math.PI*2,true);
        ctx.fill();
   }

   function drawCircuit(elem, color,lineWidth, margin, noCircle) {
        if(!elem.circuit) return;
        if(!margin) margin = 0;
        var x = elem.x, y = elem.y;
        ctx.lineWidth = lineWidth * (isRetina?2:1);
        ctx.strokeStyle = color;
        ctx.beginPath();
       
        var radius = cellSize/8;
        if(!noCircle) {
          ctx.arc(elem.x*cellSize + cellSize/2,elem.y*cellSize + cellSize/2,radius,0,Math.PI*2,true);
        }    

        if(elem.circuit & 1) {
           ctx.moveTo(x*cellSize+cellSize/2-radius,y*cellSize+cellSize/2);
           ctx.lineTo(x*cellSize+margin,y*cellSize+cellSize/2);
        }
        if(elem.circuit & 2) {
           ctx.moveTo(x*cellSize+cellSize/2,y*cellSize+cellSize/2-radius);
           ctx.lineTo(x*cellSize+cellSize/2,y*cellSize+margin);
        }
        if(elem.circuit & 4) {
           ctx.moveTo(x*cellSize+cellSize/2+radius,y*cellSize+cellSize/2);
           ctx.lineTo(x*cellSize+cellSize-margin,y*cellSize+cellSize/2);
        }
        if(elem.circuit & 8) {
           ctx.moveTo(x*cellSize+cellSize/2,y*cellSize+cellSize/2+radius);
           ctx.lineTo(x*cellSize+cellSize/2,y*cellSize+cellSize-margin);
        }
        ctx.stroke();
   }

   function checkConnect() {
        for(var i=0;i<elems.length;i++) {
           if(elems[i].connected) {
              elems[i].connected = false;
           }
           elems[i].id = i;
        }
        for(var i=0;i<elems.length;i++) {
           if(elems[i].energy) {
              pathToDoor(elems[i]);
           }
        }
   }

   function linked(elem1, elem2) {
      if(elem1.moving || elem2.moving) return false;
      var dx = elem2.x - elem1.x;
      var dy = elem2.y - elem1.y;
      if(dx ==1 && dy==0) {
          return (elem1.circuit&4) && (elem2.circuit&1);
      } else if(dx==-1 && dy==0) {
          return (elem1.circuit&1) && (elem2.circuit&4);
      } else if(dx==0 && dy==1) {
          return (elem1.circuit&8) && (elem2.circuit&2);
      } else if(dx==0 && dy==-1) {
          return (elem1.circuit&2) && (elem2.circuit&8);
      }
      return false;
   }

   function pathToDoor(elem,visited) {
      if(!visited) visited = {};
      if(visited[elem.id]) {
         return false;
      }
      visited[elem.id] = true;
      if(elem.type=='door') {
         elem.connected = lastRefresh;
      }
      var surroundingElems = elems.filter(
         function(elem2) {return elem2.circuit && Math.abs(elem2.x-elem.x)+Math.abs(elem2.y-elem.y)==1; }
      );
      for(var i=0;i<surroundingElems.length;i++) {
         var surroundingElem = surroundingElems[i];
         if(linked(elem, surroundingElem)) {
             if(pathToDoor(surroundingElem, visited)) {
                elem.connected = true;
             }
         }
      }
      return elem.connected;
   }

  var cachedIsTouch =   function () {
     return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
  }();
  function is_touch_device() {
     return cachedIsTouch;
  }

  function toggleSound() {
    sound = !sound;
    setHash('mute',sound && !banAudio?null:1);
    document.getElementById('sounder').innerText = sound  && !banAudio? "SOUND ON":"SOUND OFF";
  }

   var bslash = String.fromCharCode(92);
   function getHash(prop) {
      var lvl = 0;
      var match = location.hash.match(new RegExp(bslash+"b"+prop+"="+"("+bslash+"d+)"));
      if(!match) return null;
      return parseInt(match[match.length-1]);
   }

   function setHash(prop,value) {
      var hash = null;
      if(getHash(prop)!==null) {
        hash = location.hash.replace(new RegExp(bslash+"b"+prop+"="+bslash+"d+"),value?prop+"="+value:'');
      } else {
        hash = location.hash=="#" ? prop+"="+value : location.hash + "&"+prop+"="+value;
      }
      hash = hash.replace(/&+/,'&');
      hash = hash.replace(/&$/,'');
      location.hash = hash;
   }


var isRetina = checkRetina();

function checkRetina (){
    if(getHash('retina')!==null) {
       return getHash('retina')==1;
    }
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 2),(min--moz-device-pixel-ratio: 2),(-o-min-device-pixel-ratio: 2),(min-resolution: 2dppx)";
    if (window.devicePixelRatio >= 2)
        return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
       return true;
    return false;
}

   window.onfocus = function() {active = true; refreshView();}
   window.onblur = function() {active = false;}
   window.onkeyup =  window.onkeydown = 
      function(e) { 
         if(!e)e=event;
         if(e.type=="keydown") {
            for(k in key) key[k] = false;
               key[e.keyCode] = true;
         } else {
            key[e.keyCode] = false; 
            if(e.keyCode==27) { // ESC
                promptRestart();
            } else if(e.keyCode==83) { // S
                toggleSound();
            } else if(e.keyCode==80) { // P
                if(popDialog.style.display=="" && level>=0) {
                   setLevel(Math.max(level-1,0));
                   popDialog.style.display = 'none';
                }
            } else if(e.keyCode==78) { // N
                if(popDialog.style.display=="" && maxLevel>level) {
                   var maps = document.getElementsByTagName("map");
                   setLevel(Math.min(level+1,maps.length));
                   popDialog.style.display = 'none';
                }
            } else if(e.keyCode==82) { // R
                if(popDialog.style.display=="") {
                   restart();
                   popDialog.style.display = 'none';
                }
            }
         }
         e.preventDefault();
   };
   function touchMe (e) {
     e=e.targetTouches[0];
    // alert (canvas2.offsetLeft);
     var x=e.pageX - canvas2.offsetLeft,
         y=e.pageY - canvas2.offsetTop;
     var unit=canvas2.width/50;
     var ak=[38,37,39,40];
     var pt=[
        {x:25*unit,y:10*unit},
        {x:10*unit,y:25*unit},
        {x:40*unit,y:25*unit},
        {x:25*unit,y:40*unit}
     ];
     var closest, closeDist = 13*unit;
     for (var i=0;i <pt.length;i++) { 
        var dx=pt[i].x-x;
        var dy=pt[i].y-y;
        var dist=Math.sqrt(dx*dx+dy*dy);
        if (dist < closeDist) {
          closeDist = dist;
          closest = ak [i];
        }
     }
     var needsDraw = false;
     for (var i=0;i <ak.length;i++) {
        var k = ak [i];
        var bedown = k == closest;
        if (key [k] != bedown)  {
           key [k] = bedown;
           needsDraw = true;
        }
     }
     if (needsDraw) drawPad ();
     
     
     e.preventDefault ();
   }
   function touchMove (e) {
     e.preventDefault ();
      touchMe (e);
      
   }
    
   document.addEventListener('touchend',function(e) {
       key[37]=key[38]=key[39]=key[40]=false;
       drawPad ();
       if(popDialog.style.display!='none') {
          popDialog.style.display = 'none';
       }
   });
   if(!is_touch_device()) {
   document.addEventListener('click',function(e) {
       if(popDialog.style.display!='none') {
          popDialog.style.display = 'none';
       }
   });
   }

document.getElementById('controls-portrait').addEventListener('touchstart',touchMe);
document.getElementById('controls-landscape').addEventListener('touchstart',touchMe);
document.getElementById('controls-portrait').addEventListener('touchmove',touchMove);
document.getElementById('controls-landscape').addEventListener('touchmove',touchMove);

document.getElementById("restartButton").addEventListener('touchend',
   function(e) {
      promptRestart();
      e.stopPropagation();
   });

document.getElementById("popDialog").addEventListener('touchmove',popOver);
document.getElementById("popDialog").addEventListener('touchstart',popOver);
document.getElementById("popDialog").addEventListener('touchend',popSelect);
document.getElementById("popDialog").addEventListener('click',popSelect);

function popOver(e) {
     var tar=e.targetTouches[0];

      var target = document.elementFromPoint(tar.pageX,tar.pageY);
      resetHeaders(target);
      e.stopPropagation();
      e.preventDefault();
}

function resetHeaders(target) {
      var shortCut = !is_touch_device();
      var headers = popDialog.getElementsByTagName('H1');
      for(var i=0;i<headers.length;i++) {
         if(shortCut) {
            headers[i].innerText = headers[i].textContent;
         }

         if(headers[i].textContent=="PREVIOUS LEVEL" && level==0) {
             headers[i].style.backgroundColor="#AAAAAA";
             headers[i].style.color = "#999999";
         } else if(headers[i].textContent=="NEXT LEVEL" && level==maxLevel) {
             headers[i].style.backgroundColor="#AAAAAA";
             headers[i].style.color = "#999999";
         } else if(headers[i]===target) {
             headers[i].style.backgroundColor="#CCCCCC";
             headers[i].style.color = "black";
         } else {
             headers[i].style.backgroundColor="";
             headers[i].style.color = "";
             if(shortCut) {
               headers[i].innerHTML = 
                "<font color='yellow'>"+headers[i].textContent.charAt(0)+"</font>"+headers[i].textContent.substr(1);
             }
         }
      }
}

   function popSelect(e) {
      switch(e.target.textContent) {
         case "RESTART LEVEL":
            restart();
            popDialog.style.display = 'none';
            break;
         case "PREVIOUS LEVEL":
            if(level>0) {
               setLevel(Math.max(level-1,0));
               popDialog.style.display = 'none';
            }
            break;
         case "NEXT LEVEL":
            if(maxLevel>level) {
               var maps = document.getElementsByTagName("map");
               setLevel(Math.min(level+1,maps.length));
               popDialog.style.display = 'none';
            }
            break;
         case "SOUND ON":
            sound = false;
            e.target.innerText = "SOUND OFF";
            setHash('mute',sound && !banAudio?null:1);
            break;
         case "SOUND OFF":
            sound = true;
            e.target.innerText = "SOUND ON";
            setHash('mute',sound && !banAudio?null:1);
            break;
      }
      resetHeaders();
      e.preventDefault();
      e.stopPropagation();
   }

function getHashLevel() {
     var lvl = getHash('level');
      var maps = document.getElementsByTagName("map");
      return !lvl?0: Math.max(0,Math.min(maps.length,lvl));
}

   window.addEventListener("resize", resize);
   window.addEventListener("orientationchange", resize);
   window.addEventListener("hashchange", function() {
      isRetina = checkRetina();
      resize();
      if(getHash('mute')!==null) {
         sound = getHash('mute')!="1";
         document.getElementById('sounder').innerText = sound  && !banAudio? "SOUND ON":"SOUND OFF";
      }
      var lvl = getHashLevel();
      if(level!=lvl) {
         setLevel(lvl);
      }
   });
   function initialize() {
     resize(); 
     level = getHashLevel();
     restart();
     sound = getHash('mute')!="1";
     document.getElementById('sounder').innerText = sound  && !banAudio ? "SOUND ON":"SOUND OFF";

     canvas.style.display = "";
   }
document.addEventListener("DOMContentLoaded", initialize);

