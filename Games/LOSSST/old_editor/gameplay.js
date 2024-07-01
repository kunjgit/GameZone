// GAMEPLAY

// Snake

// Move the snake
// when snakex/y/z and snakeangle have been updated (or reset)
// Also, eat apples
// Also, open doors
// Also, enter puzzles
movesnake = (cameraonly) => {

  for(i = 0; i < snakelength; i++){
    
    if(!cameraonly){
        
      // oldx/y/z and newx/y/z are the positions where the cube disappear and reappear during the wrap animation  
      var wrapping = oldx = oldy = oldz = newx = newy = newz = 0;
      
      // Wrap transition
      if(haswrap && size){
        
        // TODO: see if it compresses better without the else's
        
        // Left
        if(snakex[(head-i) - 1] == leftoffset && snakex[(head-i)] == leftoffset + size - 1){
          wrapping = 1;
          oldx = leftoffset - 1;
          newx = leftoffset + size;
          oldy = newy = snakey[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Right
        else if(snakex[(head-i) - 1] == leftoffset + size - 1 && snakex[(head-i)] == leftoffset){
          wrapping = 1;
          oldx = leftoffset + size;
          newx = leftoffset - 1;
          oldy = newy = snakey[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Forwards
        else if(snakey[(head-i) - 1] == topoffset && snakey[(head-i)] == topoffset + size - 1){
          wrapping = 1;
          oldy = topoffset - 1;
          newy = topoffset + size;
          oldx = newx = snakex[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Backwards
        else if(snakey[(head-i) - 1] == topoffset + size - 1 && snakey[(head-i)] == topoffset){
          wrapping = 1;
          oldy = topoffset + size;
          newy = topoffset - 1;
          oldx = newx = snakex[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Upwards
        else if(snakez[(head-i) - 1] == 0 && snakez[(head-i)] == size - 1){
          wrapping = 1;
          oldz = -1;
          newz = size;
          oldx = newx = snakex[(head-i)];
          oldy = newy = snakey[(head-i)];
        }
        
        // Downwards
        else if(snakez[(head-i) - 1] == size - 1 && snakez[(head-i)] == 0){
          wrapping = 1;
          oldz = size;
          newz = -1;
          oldx = newx = snakex[(head-i)];
          oldy = newy = snakey[(head-i)];
        }
      }
      
      // Wrapping transition
      if(wrapping){
        
        // Rotate
        self["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[(head-i)]}rad)`;
        
        // Disappear after the wrap start
        self["snakecubemove"+i].style.transform = `translateX(${oldx*sidesize+.5}vh)translateY(${oldy*sidesize+.5}vh)translateZ(${oldz*sidesize+.5}vh)scale(.01)scaleZ(.01)`;
        
        // Disable transitions
        setTimeout("snakecubemove"+i+".style.transition='none'", 150);
        
        // Move cube at the position before the end of the wrap
        setTimeout("snakecubemove"+i+".style.transform=`translateX(${"+newx+"*sidesize+.5}vh)translateY(${"+newy+"*sidesize+.5}vh)translateZ(${"+newz+"*sidesize+.5}vh)scale(.01)`", 175);
        
        // Reenable transitions and finish the wrap
        setTimeout("snakecubemove"+i+".style.transition='';snakecubemove"+i+".style.transform=`translateX(${snakex["+(head-i)+"]*sidesize+.5}vh)translateY(${snakey["+(head-i)+"]*sidesize+.5}vh)translateZ(${snakez["+(head-i)+"]*sidesize+.5}vh)`", 200);
      }
      
      // Normal transition (just update snakecubemove and snakecuberotate)
      else{
        try{
          self["snakecubemove"+i].style.transform = `translateX(${snakex[(head-i)]*sidesize+.5}vh)translateY(${snakey[(head-i)]*sidesize+.5}vh)translateZ(${snakez[(head-i)]*sidesize+.9}vh)`;
          self["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[(head-i)]}rad)`;
        }
        catch(e){};
      }
      
      // Shadow
      try{
        self["snakeshadow"+i].style.display = snakez[(head-i)] == 0 ? "" : "none";
      }
      catch(e){};
    }
    
    // no puzzle or puzzle already solved: camera follows the snake
    // (except in editor: camera is fixed)
    if(!iseditor && typeof scene !== "undefined"){
      
      if(currentpuzzle === null || L[P+"puzzle"+pagename+currentpuzzle]){
        scene.style.transform="translateX("+(-snakex[head]*sidesize)+"vh)translateY("+(-snakey[head]*sidesize) + "vh)translateZ(15vh)rotateX(40deg)";
        scene.style.transformOrigin = "" + (snakex[head]*sidesize) + "vh " + (snakey[head]*sidesize) + "vh";
      }
      
      // Unsolved puzzle: fixed camera
      else {
        scene.style.transform = "translateX(" + (-(leftoffset + puzzles[currentpuzzle][0] / 2) * sidesize + 5) + "vh)translateY(" + (-(topoffset + puzzles[currentpuzzle][0] / 2) * sidesize + 8) + "vh)translateZ(" + (60 - (puzzles[currentpuzzle][0] * (sidesize + 3))) + "vh)rotateX(30deg)";
        
        scene.style.transformOrigin = ""+((leftoffset + puzzles[currentpuzzle][0] / 2) * sidesize + 5) +"vh "+((topoffset + puzzles[currentpuzzle][0] / 2 - 1) * sidesize + 8) + "vh";
      }
    }
  }
  
  // Fall if all the cubes are in the air
  var flying = son ? 1 : 0;
  for(i = 0; i < snakelength; i++){
    if(snakez[head-i] <= 0){
      flying = 0;
      break;
    }
    for(j in cubes){
      if(cubes[j][0] == snakex[head-i] && cubes[j][1] == snakey[head-i] && snakez[head-i] == 1){
        flying = 0;
      }
    }
  }
  
  if(flying){
    
    // Fall
    for(i = 0; i < snakelength; i++){
      snakez[head-i]--;
    }
    
    // in wrap puzzles, the snake can get stuck in an infinite loop. If it happens, backtrack snakelength times
    try{
      movesnake();
    }
    
    catch(e){
      for(var j = snakelength * 2; j--;){
        snakex.pop();
        snakey.pop();
        snakez.pop();
        snakeangle.pop();
        head--;
      }
      exithead = 0;
      movesnake();
    }
  }
  
  // Doors
  var x = snakex[head],
  y = snakey[head],
  z = snakez[head];
  
  for(var i in doors){
    
    // Open a door if the snake's length is big enough
    if(((doors[i][10] && son) || (!doors[i][10] && !son)) && self["door" + pagename + i] && doors[i][3] > 0 && snakelength >= doors[i][3] && Math.hypot(x - doors[i][0], y - doors[i][1]) < 4){
      self["door" + pagename + i].className = "door open";
      
      // Save that in L for next visit
      L[P+"door" + pagename + i] = 1;
    }
    
    // Walk on a door path if the door is open
    if(self["door" + pagename + i] && self["door" + pagename + i].className == "door open" && Math.hypot(x - doors[i][0], y - doors[i][1]) < 2){
      if(pagename == "load"){
        setTimeout('location="index.html"',600);
      }
      else {
        L[P+"page"] = pagename = doors[i][5];
        setTimeout(enterroom, 600);
        
        // Save snake future position in L
        L[P+"snakex"] = doors[i][7];
        L[P+"snakey"] = doors[i][8];
        L[P+"snakez"] = 0;
        L[P+"snakeangle"] = snakeangle[head];
      }
    }
  }
  
  // Puzzles
  if(!iseditor){
    
    if(currentpuzzle !== null) checkgrid();
    
    puzzling = 0;
    currentpuzzle = null;
    
    dg = [];
    dw = [];
  
    for(p in puzzles){
      if(
        x >= puzzles[p][5]
        && x < puzzles[p][5] + puzzles[p][0]
        && y >= puzzles[p][6]
        && y < puzzles[p][6] + puzzles[p][0]
      ){
        
        currentpuzzle = +p;
        issolved = 0;
        if(L[P+"puzzle" + pagename + p]){
          issolved = 1; 
        }
        else {
          puzzling = 1;
        }
        cellprefix = p;
        hasground = !!puzzles[p][4];
        haswall = !!puzzles[p][3];
        haswrap = !!puzzles[p][2];
        leftoffset = puzzles[p][5];
        topoffset = puzzles[p][6];
        size = puzzles[p][0];
        for(i = 0; i < size; i++){
          dg[i] = [];
          dw[i] = [];
          for(j = 0; j < size; j++){
            if(puzzles[p][3]){
              dw[i][j] = +puzzles[p][3][i * puzzles[p][0] + j];
            }
            if(puzzles[p][4]){
              dg[i][j] = +puzzles[p][4][i * puzzles[p][0] + j];
            }
          }
        }
        checkgrid();
      }
    }
  }
};

// Check if a position is free and in bounds
checkmove = (x, y, z) => {
  
  stuck = 0;
  
  // Editor map boundaries
  if(iseditor && playing){
    if(x < -5 || x > size + 3 || y < -2 || y > size){
      stuck = 1;
    }
  }
  
  // Room boundaries
  else {
    if(x < 0 || x >= w || y < 0 || y >= h){
      stuck = 1;
    }
  }
  
  // Trees hitbox (trees are smaller in mobile)
  for(var i in trees){
    if(x >= trees[i][0] - 1 && x <= trees[i][0] && y == trees[i][1]){
      stuck = 1;
    }
  }
  
  // Hints hitbox
  for(var i in hints){
      if(x >= hints[i][1] && x <= hints[i][1] + 3 && y == hints[i][2] && snakelength >= hints[i][3] && (!hints[i][4] || snakelength <= hints[i][4]) && ((son && hints[i][5]) || (!son && !hints[i][5]))){
        stuck = 1;
      }
  }
  
  // Apples
  for(var i in apples){
    if(L[P+"appleappeared" + pagename + i] && x == apples[i][0] && y == apples[i][1]){
      
      // Ending easter egg
      if(pagename == "3-8"){
        lock = 1;
        
        setTimeout("move_scene(Math.PI/2);appleshadow0.remove();apple0.style.transform='translateY(319vh)translateZ(2vh)rotateX(-65deg)rotateY(90deg)';apple0.style.transition=scene.style.transition='10s';apple0.style.transform='translateY(15vh)translateZ(2vh)rotateX(-65deg)';scene.style.transform='translateX(-207vh)translateY(-320vh)translateZ(-300vh)rotateX(0deg)rotateZ(1.5708rad)'", 200);
        
        for(i in puzzles){
          setTimeout("back"+i+".style.transition='.5s';back"+i+".style.transform='translateY(-125%)'", [1450, 2500, 3900, 5500][i]);
        }
        
        setTimeout(`clearInterval(int_time);L[P+'ended']=1;L[P+'editorfull']=1;b.style.background='#000';b.innerHTML='<div id=perspective style=perspective:90vh><center id=menu style=width:75vh;transform:translateX(-38vh)translateY(-35vh)rotateX(-28deg)><span style=font-size:4vh;line-height:5vh><h1>Congrats!</h1><br>You completed the game in<br>'+ocd_time+' seconds and '+ocd_moves+' moves!<br><br><a href=https://twitter.com/intent/tweet?text=I%20played%20LOSSST,%20a%20%23js13k%20game%20by%20by%20@MaximeEuziere%0Amy%20score:%20'+ocd_time+'%20seconds%20and%20'+ocd_moves+'%20moves!%0Ahttp%3A%2F%2Fjs13kgames.com%2Fentries%2Flossst target=_blank style=color:#def;font-size:4vh>TWEET YOUR SCORE</a><br><br>Dev record:<br>1786 seconds, 3461 moves<br><br>You can now create 3D puzzles<br>in the editor!<br><br><a href=index.html style=font-size:4vh>RETURN TO TITLE SCREEN</a>'`,15000);
        
      }
      
      // Eat an apple
      else {
        delete apples[i];
        self["apple" + i].remove();
        self["appleshadow" + i].remove();
        snakelength++;
        L[P+"snakelength"] = snakelength;
        L[P+"appleeaten" + pagename + i] = 1;
        
        // Room 2-2: easter-egg
        if(pagename == "2-2" && snakelength == 16){
          lock = 1;
          easteregg = 1;
          scene.style.transition = "5s";
          scene.style.transform = "translateX(-256vh)translateY(-95vh)translateZ(-400vh)rotateX(0deg)rotateZ(180deg)";
          setTimeout("scene.style.transition='1s';lock=easteregg=0;movesnake()",10000);
        }
      }
    }
  }
  
  // Rock
  for(var i in cubes){
    if(x == cubes[i][0] && y == cubes[i][1] && z == 0){
      stuck = 1;
    }
  }
  
  // Emoji
  for(var i in emoji){
    if(pagename != "1-4" && x == emoji[i][1] && y == emoji[i][2] && z == 0){
      stuck = 1;
    }
  }
  
  // Doors
  for(var i in doors){
    
    // Walk on a door path if the door is open
    if(self["door" + pagename + i] && self["door" + pagename + i].className == "door open" && Math.hypot(x - doors[i][0], y - doors[i][1]) <= 2){
      stuck = 0;
    }
  }
  
  // Other snake cubes hitbox
  // NB: no need to check if the last cube (the tail) is there because when the snake will move, that cube won't be here anymore so we can take its place. Hence the "snakelength - 2"
  for(i = snakelength - 2; i > 0; i--){
    if(snakex[head-i] == x && snakey[head-i] == y && snakez[head-i] == z){
      stuck = 1;
    }
  }
  
  // Puzzle with wall and no wrap: wall hitbox
  for(p in puzzles){

    if(
      puzzles[p][3] // wall
      && x >= puzzles[p][5] // x betwee left and right
      && x < puzzles[p][5] + puzzles[p][0]
      && (
        (
          // no wrap && head trying to pass from top line to after the wall
          y == puzzles[p][6] - 1  && snakey[head] == puzzles[p][6] && !puzzles[p][2]
         ) 
        ||
        (
        
          // Head trying to pass from after the wall to first line
          y == puzzles[p][6] && snakey[head] == puzzles[p][6] - 1
        )
      )
    ){
      stuck = 1;
    }
  }
  
  // Room 2-5: find son
  if(pagename == "2-5" && x == 18 && !son){
    stuck = 1;
    lock = 1;
    easteregg = son = 1;
    L[P+"son"] = 1;
    L[P+"snakelength"] = snakelength = 5;
    for(i = 0; i < 21; i ++){
      cubes.push([snakex[head-i], snakey[head-i]]);
      self["snakecubemove" + i].id = "";
      self["snakecuberotate" + i].id = "";
      self["snakeshadow" + i].id = "";
      self["snakecube" + i].id = "";
    }
    scene.style.transition = "2s";
    resetsnake();
    movesnake();
    scene.style.transform = "translateX(-142vh)translateY(-70vh)translateZ(80vh)rotateX(45deg)";
    scene.style.transformOrigin = "140vh 70vh";
    setTimeout('snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake()', 3000);
    setTimeout("text.innerHTML='Daddy!'", 4000);
    setTimeout("text.innerHTML=''", 6000);
    setTimeout("text.innerHTML='I lossst my soccer ball!'", 7000);
    setTimeout("text.innerHTML=''", 9000);
    setTimeout("text.innerHTML='But I found new moves!'", 10000);
    setTimeout("text.innerHTML='';easteregg=lock=0;scene.style.transition='1s';movesnake();checkapple();if(mobile){k_top.className=k_bottom.className='';L[P+'topbottom']=1}", 13000);
  }
}

// Check if the grid is solved
checkgrid = e => {
  
  if(issolved){
    return;
  }
  
  if(currentpuzzle === null) return;
  
 
  solved = 1;
  
  // Repaint everything in black and white
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      if(self[`g${cellprefix}-${i}-${j}`]){
        self[`g${cellprefix}-${i}-${j}`].style.background = dg[i][j] ? "#000" : "#fff";
      }
      if(self[`w${cellprefix}-${i}-${j}`]){
        self[`w${cellprefix}-${i}-${j}`].style.background = dw[i][j] ? "#000" : "#fff";
      }
    }
  }
  
  // If head is not in the puzzle, return
  if(snakex[head] < leftoffset || snakex[head] > leftoffset + size - 1 || snakey[head] < topoffset || snakey[head] > topoffset + size - 1 || snakez[head] < 0 || snakez[head] > size - 1){
    return;
  }
  
  // For each snake cube
  for(i = 0; i < snakelength; i++){
 
    // Paint the good cells in green and the bad ones in red (if they exist, and if the snake part is in the puzzle)
    if(self[`g${cellprefix}-${snakey[head-i] - topoffset}-${snakex[head-i] - leftoffset}`]){
      self[`g${cellprefix}-${snakey[head-i] - topoffset}-${snakex[head-i] - leftoffset}`].style.background = dg[snakey[head-i] - topoffset][snakex[head-i] - leftoffset] ? "#080" : "#f00";
    }
    
    if(snakey[head-i] >= topoffset && snakey[head-i] < topoffset + size && self[`w${cellprefix}-${size - 1 - snakez[head-i]}-${snakex[head-i] - leftoffset}`]){
      self[`w${cellprefix}-${size - 1 - snakez[head-i]}-${snakex[head-i] - leftoffset}`].style.background = dw[size - 1 - snakez[head-i]][snakex[head-i] - leftoffset] ? "#080" : "#f00";
    }
    
    // If a snake part is out of the grid, not solved
    if(snakex[head-i] < leftoffset || snakex[head-i] > leftoffset + size - 1 || snakey[head-i] < topoffset || snakey[head-i] > topoffset + size - 1 || snakez[head-i] < 0 || snakez[head-i] > size - 1){
      solved = 0;
    }
  
    // If a snake part is at a place where it shouldn't be (red cell), not solved
    if(hasground && dg[snakey[head-i] - topoffset] && !dg[snakey[head-i] - topoffset][snakex[head-i] - leftoffset]){
      solved = 0;
    }
    
    
    if(haswall && dw[size - 1 - snakez[head-i]] && !dw[size - 1 - snakez[head-i]][snakex[head-i] - leftoffset]){
      solved = 0;
    }
  }
  
  // If a snake part is not at a place where it should be, not solved
  // (test if backgroundColor is "#000" or "rgb(0, 0, 0)" depending on browsers 
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      try{
        if(hasground && self[`g${cellprefix}-${i}-${j}`].style.backgroundColor.match(/0/g).length == 3){
          solved = 0;
        }
      }
      catch(e){}
      try{
        if(haswall  && self[`w${cellprefix}-${i}-${j}`].style.backgroundColor.match(/0/g).length == 3){
          solved = 0;
        }
      }
      catch(e){}
    }
  }
  
  // Solved
  if(solved){
    issolved = 1;
    
    // Editor solved 
    if(iseditor){
      setTimeout(`share.disabled=0;playing=puzzling=0;b.className="editor";for(i=exithead;i<=head;i++){snakex.pop();snakey.pop();snakez.pop();snakeangle.pop();}head=exithead-1;exithead=0;movesnake()`,1000);
    }
    
    self["puzzle" + currentpuzzle].classList.remove("wrapvisible");
    L[P+"puzzle" + pagename + currentpuzzle] = 1;
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        if(self[`g${cellprefix}-${i}-${j}`]){
          self[`g${cellprefix}-${i}-${j}`].style.background = dg[i][j] ? "#44c" : "#fd0";
        }
        if(self[`w${cellprefix}-${i}-${j}`]){
          self[`w${cellprefix}-${i}-${j}`].style.background = dw[i][j] ? "#44c" : "#fd0";
        }
      }
    }
    totalsolved++;
    L[P+'totalsolved'] = totalsolved;
    
    // Remove rock cubes that are on the puzzle
    var cubetoremove = 1;
    for(var j in cubes){
      if(
        cubes[j][0] >= puzzles[currentpuzzle][5]
        && cubes[j][0] < puzzles[currentpuzzle][5] + puzzles[currentpuzzle][0]
        && cubes[j][1] >= puzzles[currentpuzzle][6]
        && cubes[j][1] < puzzles[currentpuzzle][6] + puzzles[currentpuzzle][0]
      ){
        delete cubes[j];
        cubetoremove++;
        setTimeout('self["cube' + j + '"].remove()', cubetoremove * 200);
      }
    }       
  }
}

// Check if a new apple can appear after a certain snake length or number of puzzles solved, and make it appear
checkapple = e => {
  for(var i in apples){

    if(!L[P+"appleappeared" + pagename + i] &&((apples[i][3] > 0 && apples[i][3] == snakelength) || (apples[i][4] > 0 && apples[i][4] == totalsolved))){
      
      lock = 1;
      

      // backtrack button
      if(mobile && pagename == "hub" && i == 1){
        k_backtrack.className = '';
        L[P+"backtrack"] = 1;
      }
      
      // Focus on new apple 
      setTimeout(`scene.style.transform="translateX("+(-apples[`+i+`][0]*sidesize)+"vh)translateY("+(-apples[`+i+`][1]*sidesize)+"vh)translateZ(-15vh)rotateX(40deg)";L[P+"appleappeared"+pagename+"`+i+`"]=1;scene.style.transformOrigin=""+(apples[`+i+`][0]*sidesize)+"vh "+(apples[`+i+`][1]*sidesize)+"vh";self["apple"+`+i+`].className="emoji apple";self["appleshadow"+`+i+`].className="emojishadow appleshadow"`, 250);
      
      // Focus back on snake
      setTimeout("movesnake();lock=0", 2000);

    }
  }
}

testinbounds = () => {
  
  // Test if we're inside a puzzle, and save when we entered, to return there when we press R
  inbounds = 0;
  if(!iseditor){
    currentpuzzle = null;
  }
  
  for(p in puzzles){
    if(snakex[head] >= puzzles[p][5] && snakex[head] < puzzles[p][5] + puzzles[p][0] && snakey[head] >= puzzles[p][6] && snakey[head] < puzzles[p][6] + puzzles[p][0] && snakez[head] >= 0 && snakez[head] < puzzles[p][0]){
      currentpuzzle = +p;
      inbounds = 1;
    }
  }
}


// On key down
onkeydown = function(e) {
  
  // Update u/d/l/r flags
  self['lurd************************l**r************l*d***u**u'[e.which - 37]] = 1;
  
  // Alt = 18
  if(e.which == 18){
    B = 1;
  }
  
  // Shift = 16
  if(e.which == 16){
    s = 1;
  }
  
  // Ctrl = 17
  if(e.which == 17){
    c = 1;
  }
  
  if(!lock){
    
    // 1 = 49 / 97
    if(e.which == 49 || e.which == 97){
      move_scene(-1.2);
    }
    
    // 2 = 50 / 98
    if(e.which == 50 || e.which == 98){
      move_scene(0);
    }
    
    // 3 = 51 / 99
    if(e.which == 51 || e.which == 99){
      move_scene(1.2);
    }
  }
  
  testinbounds();
  if(inbounds){
    checkgrid();
  }
  else {
    exithead = 0;
  }
  
  // R = 82
  if(e.which == 82 && inbounds){
    if(exithead <= head){
      for(var i = exithead; i <= head; i++){
        snakex.pop();
        snakey.pop();
        snakez.pop();
        snakeangle.pop();
      }
    }
    head = exithead - 1;
    exithead = 0;
    movesnake();
    checkgrid();
    L[P+'moves']= ++ocd_moves;
    document.title='LOSSST: ' + ocd_moves + 'm, ' + ocd_time + 's';
    return;
  }

  // Allow F5 = 116 / Ctrl = 17 / R = 82, F12 = 123, disable the other keys that can ruin the gameplay (space, backspace, scroll, etc...)
  if(e.which != 116 && e.which != 82 && e.which != 17 && e.which != 123 && e.preventDefault){
    e.preventDefault();
  }
  
  if(playing && !lock){
    
    stuck = 0;
    
    // Left
    if(l){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakex[head] == leftoffset){

        checkmove(leftoffset + size - 1, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(leftoffset + size - 1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI/2);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head] - 1, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head] - 1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI/2);
          head++;
        }
      }
    }
  
    // Right
    else if(r){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakex[head] == leftoffset + size - 1){
        
        checkmove(leftoffset, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(leftoffset);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(-Math.PI/2);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head] + 1, snakey[head], snakez[head]);

        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]+1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(-Math.PI/2);
          head++;
        }
      }
    }
  
    // Forwards (Up)
    else if(u){
        
      // Wrap
      if(!issolved && haswrap && inbounds && snakey[head] == topoffset){
        checkmove(snakex[head], topoffset + size - 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(topoffset + size - 1);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head] - 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head] - 1);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI);
          head++;
        }
      }
    }
  
    // Backwards (Down)
    else if(d){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakey[head] == topoffset + size - 1){
        checkmove(snakex[head], topoffset, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(topoffset);
          snakez.push(snakez[head]);
          snakeangle.push(0);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head] + 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head] + 1);
          snakez.push(snakez[head]);
          snakeangle.push(0);
          head++;
        }
      }
    }
    
    // Upwards (shift)
    else if((son || haswall) && s){
      
      // Can't go upper than snake's height (or snake's height + 1 if standing on a cube) if not in a puzzle
      if(!inbounds){
         var maxheight = snakelength - 1;
         for(var i in cubes){
           if(cubes[i][0] == snakex[head] && cubes[i][1] == snakey[head]){
             maxheight++;
           }
         }
         if(snakez[head] == maxheight) return;
      }
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakez[head] == size - 1){
        checkmove(snakex[head], snakey[head], 0);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(0);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head], snakez[head] + 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(snakez[head] + 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
    }
    
    // Downwards (ctrl)
    else if((son || haswall) && c){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakez[head] == 0){
        checkmove(snakex[head], snakey[head], size - 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(size - 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
      
      // No wrap, can't go below the ground
      else if(snakez[head] == 0){
        stuck = 1;
      }
      
      // No wrap, can go down
      else {
        checkmove(snakex[head], snakey[head], snakez[head] - 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(snakez[head] - 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
    }
    
    // Get back (backspace or alt)
    else if(B){
      
      // Remove the record of the last move and place the snake there
      // NB: the snake can always get back, even if the head is there, because the head will also move when the tail will get back.
      if(head > snakelength){
        snakeangle.pop();
        snakex.pop();
        snakey.pop();
        snakez.pop();
        head--;
      }
    }
  
    // If a move key was pressed and snake is not stuck and easteregg/son sinematic is not playing
    if(!stuck && !easteregg && (u || r || d || l || s || c || B)){

      L[P+"moves"] = ++ocd_moves;
      if(!iseditor) document.title = 'LOSSST: ' + ocd_moves + 'm, ' + ocd_time + 's';
        
      checkgrid();
      
      // Update snake & camera position
      movesnake();
      
      // Check grid in editor
      if(iseditor && playing){
        checkgrid();
      }
      
      // Update camera position again if needed
      movesnake(1); // 1 = camera update only
      
      // Check is a new apple can appear
      checkapple();
      
      // Lock the keys for .1s unless there's an apple animation already locking them
      if(!lock){
        lock = 1;
        setTimeout("lock=0", 150);
      }

      // Editor
      if(pagename == "hub" && (son || snakelength >= 14) && snakex[head] == 20 && snakey[head] == 10){
        lock = 1;
        var z = 0;
        for(i = 0; i < snakelength; i++){
          z--;
          setTimeout("snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push("+z+");snakeangle.push(snakeangle[head]);head++;movesnake()", i * 150);
        }
        setTimeout("location='editor.html'", i * 100);
        L[P+"snakex"] = 20;
        L[P+"snakey"] = 10;
      }
      
      
      // Save reset head if entering in bounds
      testinbounds();
      
      if(inbounds && !exithead){
        if(iseditor){
          exithead = snakelength;
        }
        else {
          exithead = head;
        }
      }
    }
  }
}

onkeyup = e => {
  u = r = d = l = s = c = B = 0;
}