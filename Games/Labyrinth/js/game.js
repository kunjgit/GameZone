/*global values*/
var SQUARE = 16;
var HEIGHT_IN_SQUARES = 20;
var WIDTH_IN_SQUARES = 30;
var HEIGHT = SQUARE * HEIGHT_IN_SQUARES;  
var WIDTH = SQUARE * WIDTH_IN_SQUARES;

/*game assets*/
var assets = {
  player: {
    stop: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAldJREFUOI2lU11Ik1EYfr6zTz912zfndFOXs/ybP3MznIZgbP1AUV4ssh8vEiqCqKAf6jIppbuCuoko6CJIIaLWRTcZWSQimSUJFokZzaygzySHzc18unI4Z930XJ33nPM+53nehwOsgHP797EuO5+tHievttnYUGDj4pnBYFCFEGKxlpY2BpwKZWHC6RNmTIUjCD5cgMsVhk4s4OYdGYOTWsJ9AJCXFtY8Cw4eSEV+VgaMMzLKKycQieoghAyvNwLLsJ9kFN0f++JEYinBrac/0dujBxnD7JyEde4cyDoBiyoQ8K9CdsU76OWBBAW6xUVdtYltrTJ+zc8iLY241z8Dk5yBOreC2G8DQl812HPnMfwtgg+feT7JwvoCPbqea6gtlfHgkYSJMQWZk+noH3mP6SEn5k3psDv0mA0JAN/jCuIW1DkXSqIluBtUkRMuw8ldzdjUWIEfbxy40r4THpsHutBqVFvjgSSjY6OPlwNbyb5rDPjcnOq/zSPbN/D+peNk90U2ZlmSuhNSOPvkmbS52MSmF2WoElaYtVH4HTZI4xquv36F3ilNLCeIY6Czi4cbCgk9aIXC9m1edjZv4o3dPjYVOQiARc4UBo8dWtnDmdq1DHW0cId3DQEQAE+5aujUmwmARkXm4IUWtrtL/j6EakceHUaVqYpgeiFYXJNJm0uhZATNaQZ67MkTTPA0/OmLpMyoOFq/BVWxcowNTYNvFeytqodPrYSxzJ30qLx8YxQTGAnbYI9l4iUg7fEHqI1PIhh9DPQg6S+sjBQkSM0uzf1H+P+JP0dK00lbBx1dAAAAAElFTkSuQmCC",
    walk0: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAkJJREFUOI2Fk0tIlFEUx3/fPBubh/o1PkemsRnNURvKRUZZUGFJYmQ7adkDg6ggAktypCjIja4KatfCTQZBCRY9KLLoRVgr6SX5maPJOD6m1Jk5rUaU8fFfnXsv53fuPf9zYQVtd9lkpXMA3VKbTQd9ssWWIdWVhQQb9VJdmL4sSEkGJ/fvk7/hHjwFKseO5vP+c5QnL8OUFhuYnJnl5p0E/eGIsiwAoG6TXdpa3ZgVPeORf/T0DhObUzBbdGhDOt69cROfmuD1ZP98nn4hYFZJBP3ZKqozzu8IBHxpTEwLfo+ZNfa16G2/MOhjfNGmW5M5hmRQU4GcOKTyTRvE+N3Cg1cxqopUSv0mXvSasNtDOBzC22hi6SZusLo4e2MUbSxOZ6eCdchDbMRAx60p4l/ddN23Yx0LwB/DIsD8Kj2azRFvIY+ej9BcH6Ckcj2v+wYp0TI4H6zDdN3MTGgSZ54Zhpewo2lHQGpyXNJ35biEu9ukwueTuPZQKks2ys+7V2Wgo1HczpwUO/UALRWbZWdVDi2fPqINjOKYiLPX46LYGMGVsBAaGOHc7Xv0hcZSbJyXL9MiZjdCGpKpN0lteYFsy8+S2rICWWcyCy6deMu8K09m84WLggEBRYyKXhrKigSQrfl+mXt2TS7vKk0BLBrlmJIgK2bFohqZ08V5Gtew2M0Ma4N0tXfjsOemFE15U335HrElYCg6zuMfHwA4deY0KirB9kvL9yCp3Qeqxas6pSg3T+obDq/6G1OvpCirV1mg/wHt0PiG7DTJAAAAAElFTkSuQmCC",
    walk1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAj5JREFUOI2Vk01I03EYxz/uv797yza3FrVZODd1raVBShEJSa03ErMgCIpREdGhQx0qyUOz6CBE4KEOXaIuFUQdejESlEwtCju0W7mspjkQnbpNc62nk5LMGX1PD8+P74eH5/v8YBFtKTLJYu8AmoWaTQ1uqTJbJLDJQ+iUIjtLCnKC8maLk4Htkkm24y62cTTopC+c4uWrMXxlWhLpNDduz/ApnsjLCQDY7SuQ65dd6BUN4xPTtHUPk06DwaAwHNPS3eVAkpP0Jj7P+ZR5NJ1cKrfbsNkzRMdgg9dIIiWsKdGjNRnQFQ6iaDOEo8nQrEc7W+ytRo7X24gMRQn363nWk2Gz24rfr9LRpcNqjWE0CQMTvxdeolNZydmbo3yN/eL+PQVLzIMmnk/rrSl0gy4ePjazdKQSdVI3DzA3QanFhyUTp+fNDI0NfkqrVvE2HMMXjXAmVIe2RUt6PI2qTucKBA56K+R9c1Diz6/JerdH5MdT2ej1SuTBFRlqPS2FqHJonUv6OzvnYs2Kpdpmksb9ezApCttqnHS8HmJ0OsXdd308GflO25Fd9LYPEvrwMctL2VqPaFyqmFVVAl6HVK9YJgGvQ6xKvqBHDC6NuKzG3NfZXOMTed0itcWVAsjhinIxKqpAnqAgF86dzzLPO2WzdTV3rj7iy0AE3ZJ8Xvz8Roo0epsWR8ZCcmYq9wL/VmPTRQEEkB0lVXLMH5B9/tp/fqwsBU8Epdi+XNx2m9QEtv4/AKDuQL04y4pymv8A2HDV/VfJbN4AAAAASUVORK5CYII=",
    die: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAjBJREFUOI2lk09I03EYxj/f775zThs6l87/MSczkywTk4qiFXookEC6d7OmB7106Fx26FCHNOzSoYNgeSujIjEPUSShEgqJ/5k6ZepaqZvb79vBVhJJYs/1fd7nfV7e5xWNvgba2jto9DWwF4idCrsVlNvJjb4GWptuaIC29o5dCSiTyWSyzk3HAFGS5tbD/ddpqj2q778aFDuJbHenfHVXY568x5wtdOjBgTvU1Gby+tM0d+sv6UI7fHce4sNK8Neqf4rKNA+MzYepqxec89o44skkz2EhtzyA/eJxTrsN3JGoDobW9PjElAZof/Dwt4PIvOLt52QuZ0sCM6tsFjiZDUdYGFqkeLKP2wPLNFdk0Pn8HR9Xv1HlqtAREWExGCTL4RCyr+sRecnFDM3GiRsG/sA6pdmKwNIaV2oq6b5Vj7MgnQl7HJVqZik4QrUq4En3U2y2DC3LKnPwnvnCiSKJSZkYHQuRog1Ca+u03OthrH8YqwH2lTilHk1n0wXcWZrDKYrUWHwrB82njumqihlAkZ9kxh+AryOS/IyTeK+VM9rVR+/L94gkcGXvJ2d5A9fBEnLf9AoF4LWV4VqdxHognXA0hikEViE4PzeIvDmKMAyqHZkUpaVhiW6QuzCVFPP7NwFE4qYtyqLNRg8y1YyzR4GUILaupw0DYbEglcKIRMAwkFYrRjiMAmh99kKLn2R0lA1AKgVCsG98/K9xTwze8Rf+lcAExF6/MAH5X93ADya+zRsLM6D3AAAAAElFTkSuQmCC"
  },
  enemy: {
    walk0: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAUdJREFUOI2NkiFvwzAQhb+kVVRYBRUGBhoe7E8o7B+YFBhYGFhYOBg4WFgYeNDQsHCw0GCSB1anSZpuOymS3/neyzvfJUyirnfBGNNjay2n0zmZ1r0MkTKIlMF7H7z3wblLaNsmvKpPZ8iIlGy3Py6KYouIUNe7WZF0SFZ1HI8fEY8KjTGIlE8i6TSxWq1+a+/3Fup6R9s2AKi6WREDIxfpnThKqjq6zgJwvXaoKtZaVB0yEVlGQlXtERGKYst+f+jJf8UyHqy1iMiIpKr9narDqEMBC8lIQNUlQIB3pksUHc6RYQKA2VF1DVyaT3Z6+/9GDsNfymAgVJMJwGCM/rAJ/lKGs6xDlmUZQBVJ3e1Z9LB5iJ1lHQz031nWYbFYLKoBHjqIGAZTgMcDNXoLb/B1f7RRzLXxtF0xl+d5Hv+W53k+dBnrvgHx2qTUfj2olwAAAABJRU5ErkJggg==",
    walk1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAWBJREFUOI19kqGS4zAQRJ+2FgQGBoad2YntQMODhvmEQMNAw8CFCwMPBgoaDhQ0XHjQUGjngC2XnHLSVS5rpOlWT5ccG2jbxrz3Sx1j5PPz7rZ6NyFSmUhlKSVLKdkwBLvdOtvqfXtCRqSiricXx2ONiNC2jTnn3FMBkcpUB67Xv7leiXvv+fj49fPSAcBut3s13usR2rbhdusAUB02RTwseSwCbdusQlId6PsIwPd3j6oSY0R1QAqR95JwPp8QEY7HmtPpspBf4b0sYoyIyIqkqsuZ6oDXAQUiuEcHDjD44vERZYePZCgWJUSqVR59PRL6RNCRryccAFKo7C57m5xMXwqVebDzXN9lb+lysBTmS/IiXQ7mYdV8Bsv7pUDuS5eDvdGPAIQ+rWbLCH1a1Y2OdLKfRr3+w82W6XQkgvNgkoOd/53sCTpd9GcmNzo6mAkUyTrn3G+zn3KvfHkZ+ew/IWC+AIZ1gg4AAAAASUVORK5CYII="
  },
  wall: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAALlJREFUOI2l09EKhSAMBuBZU0oK68Zn7Nm7KpUiiDp34ixWcXa1n+xLaYphGE5gyjlHstaaZJymiXsfvPck7/v+DQghkHwcBwUQkQWWZSFZKUWBfMETUJblf0BeWNc1u8BaS3LbthQQQrBAVVUkG2Mo0Pc9CzRNE/txHGHbNgpIKVkgPeLdxx6BrutiXxTFFfjyF/Kp/Azk5wcAwPNk7xLM8xz7fKwBXtyFdPbvdot3alrpDtd1vTz/AXBkWA0AB1iPAAAAAElFTkSuQmCC",
  key: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAQtJREFUOI2dkyFyxDAMRb86BoELC8siWFgY2CMU5gg+RmGOYLhHCMwRDAX2AIGFAZ5qwdZb2U7aTv+MZxRFepZ/HMCImRW/6LCGmXWLL5oLmFntIiKqawDA5eJp3AqYfQYAH/rPHE/jBh9YRYRcPUluHF4fyzzW3cmp3rVuvL1cABkAAMu8wocOIkIA8JBrRIR86LDMK57fPkqADPecbS4A9QQWYuNp3IovcQdYxfPpTznAeGCnyLJ+LPNaHIGISFW1AGRIHtXKhw4AivP/KGbW+f2puTi1dj04Av4bEGNEPJ92Ic1NdM65lFKyuWXir6hr4A2gbgZuBqaUcLm0Bu46SkTU998/D3Ds/hUe7YepByhS5QAAAABJRU5ErkJggg=="
}

/*Game Engine*/
var Engine = (function(win, doc){

  "use strict";
  
  var c, canvas, ctx, scene;
  
  //initialize the game engine
  var init = function() {
    canvas = doc.createElement("canvas");
    canvas.setAttribute("height", HEIGHT);
    canvas.setAttribute("width", WIDTH);
    c = doc.getElementById("c");
    c.style.width = WIDTH+"px";
    c.appendChild(canvas);
    ctx = canvas.getContext("2d");

    window.requestAnimFrame = (function(callback) {
      return window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame || 
      window.oRequestAnimationFrame || 
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    })();

    doc.onkeydown = function(e){
      if(scene.onkeydown) scene.onkeydown(e);
    };
    
    doc.onkeyup = function(e){
      if(scene.onkeyup) scene.onkeyup(e);
    };

  };
  
  var update = function(dt) {
    scene.update(dt);
  };
  
  var draw = function(dt) {
    var cached = renderToCanvas(canvas.width, canvas.height, function (ctx, dt) {
      canvas.width = canvas.width;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      scene.draw(ctx, dt);
    });
    ctx.drawImage(cached, 0, 0);
  };

  var renderToCanvas = function (width, height, renderFunction) {
      var buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      renderFunction(buffer.getContext('2d'));
      return buffer;
  };
  
  var start = function() {
    init();
    loop();
  };
  
  var time, fps, fpsc=0;
  var loop = function() {
    var now = new Date().getTime(),
    dt = (now - (time || now))/100; //delta time
    time = now;
    win.requestAnimFrame(function() {
      update(dt);
      draw(dt);
      loop();
    });
    if(fpsc === 10){
      fps = parseInt(1/(dt/10),10);
      //doc.getElementById("fps").innerHTML = fps + " FPS";
      fpsc=0;
    }
    fpsc++;
  };

  var setScene = function(s, delay) {
    s.reset();
    if(scene){
      setTimeout(function(){
        scene = s;
      },delay || 400);
    }else{
      scene = s;
    }
  };
  
  return {
    start: start,
    setScene: setScene
  };
  
})(window, window.document);

/*Splash Screen*/
var Splash = (function(){

  "use strict";

  var y, title, info, ready;

  var reset = function() {
    y = 0;
    title = "<LABYRINTH/>";
    info = "press \"s\" to start";
    ready = false;
  };

  var update = function(dt) {
    if(y < 100) {
      y += 7 * dt;
    }
    else {
      ready = true;
    }
  };

  var draw = function(ctx, dt) {
    ctx.fillStyle = "#666";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 0, 0.9)";
    ctx.font = "40px Georgia bold";
    ctx.fillText(title, WIDTH/2, y);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.strokeText(title, WIDTH/2, y);
    if(ready){
      ctx.font = "13px Helvetica";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(info, WIDTH/2, 130);

      ctx.fillText("TOP 5", WIDTH/2, 170);
      var scores = Score.get();
      for(var x=0; x<scores.length; x++){
        ctx.fillText(x+1+") "+scores[x].username + " - " + scores[x].points + " p.", WIDTH/2, 190+(x*20));
      }
    }
  };

  var onkeydown = function(e) {
    if(e.keyCode === 83 && ready) {
      info = "LOADING...";
      Engine.setScene(Game, 2000);
    }
  };

  return {
    reset: reset,
    update: update,
    draw: draw,
    onkeydown: onkeydown
  };
  

})();

/*Game Logic*/
var Game = (function(){

  "use strict";
  
  var username, level, points, game_objects, player, maze, key, lives, time, timeinterval;

  //reset all game variables and start the first level
  var reset = function() {
    username = (prompt("Insert your name") || "PLAYER 1").toUpperCase();
    if(username.length>10) username = username.substring(0,10);
    lives = 3;
    level = 0;
    points = 0;
    startLevel();
  };

  //start the current level
  var startLevel = function(){
    if(timeinterval) clearInterval(timeinterval);
    time = 0;
    timeinterval = setInterval(function(){
      time++;
    },1000);

    var doorOpen = false;
    
    game_objects = [];

    //the player object
    player = new GObject({
      type: "player",
      data: {img: new Image(), imgc: 0, died: false},
      w: SQUARE, h: SQUARE, y: SQUARE, x: SQUARE,
      draw: function(ctx, dt){
        try{
          ctx.drawImage(this.data.img, this.x, this.y);
        }catch(e){}
      },
      update: function(dt){
        //update the current player sprite
        if(this.data.died){
          this.data.img.src = assets.player.die;
        }
        else if(this.mx != 0 || this.my != 0){
          if(this.data.imgc > 1){
            this.data.img.src = assets.player.walk0;
          }else{
            this.data.img.src = assets.player.walk1;
          }
          this.data.imgc += dt;
          if(this.data.imgc > 2) this.data.imgc = 0;
        }else{
          this.data.img.src = assets.player.stop;
        }
      },
      onCollision: function(elem, coll){
        if(elem.type == "block" || (!doorOpen && elem.type == "exit")){
          //bounce on block collision
          if(coll.side == "right"){
            this.x = coll.other.x - this.w;
          }
          else if(coll.side == "left"){
            this.x = coll.other.x + coll.other.w;
          }
          else if(coll.side == "bottom"){
            this.y = coll.other.y - this.h;
          }
          else if(coll.side == "top"){
            this.y = coll.other.y + coll.other.h;
          }
        }else if(doorOpen && elem.type == "exit"){
          //go to next level
          level++;
          addPoints();
          startLevel();
        }else if(elem.type == "key"){
          //pick the key
          key.hidden = true;
          doorOpen = true;
        }else if(elem.type == "enemy"){
          //enemy kill you :(
          if(!this.data.died){
            this.data.died = true;
            this.mx = 0;
            this.my = 0;
            lives--;
            setTimeout(function(){
              if(lives){ 
                startLevel();
              }else{
                alert("GAME OVER\nYOUR SCORE IS "+points);
                Score.save(username, points);
                Engine.setScene(Splash);
              }
            }, 2000);
          }
        }
      }
    });
    game_objects.push(player);

    function addPoints(){
      var p = ((level+1)*20)-time;
      if(p<10) p=10;
      points += p;
    }

    //generate the maze
    maze = Maze.get(HEIGHT_IN_SQUARES, WIDTH_IN_SQUARES);

    var wall = new Image();
    wall.src = assets.wall;

    //create the maze's blocks and the exit
    for(var i = 0; i < maze.length; i++){
      for(var j = 0; j < maze[i].length; j++){
        if(maze[i][j]=="x"){
          var block = new GObject({
            type: "block",
            w: SQUARE,
            h: SQUARE,
            x: j * SQUARE,
            y: i * SQUARE,
            draw: function(ctx, dt){
              try{
                ctx.drawImage(wall, this.x, this.y);
              }catch(e){}
            }
          });
        }else if(maze[i][j]=="e"){
          var block = new GObject({
            type: "exit",
            w: SQUARE,
            h: SQUARE,
            x: j * SQUARE,
            y: i * SQUARE,
            draw: function(ctx, dt){
              if(doorOpen){
                ctx.fillStyle = "rgb(0, 0, 0)";
              }else{
                try{
                  ctx.drawImage(wall, this.x, this.y);
                }catch(e){}
              }
              ctx.fillRect(this.x, this.y, this.w, this.h);
            }
          });
        }
        game_objects.push(block);
      }
    }
  
    //create the key
    var keypos = Maze.getFreePoint(maze);
    key = new GObject({
      type: "key",
      x: keypos.p2 * SQUARE,
      y: keypos.p1 * SQUARE,
      draw: function(ctx, dt){
        try{
          var keyimg = new Image();
          keyimg.src = assets.key;
          ctx.drawImage(keyimg, this.x, this.y);
        }catch(e){}
      }
    });
    game_objects.push(key);

    //create mobs
    function createMob(){
      var mobpos = Maze.getFreePoint(maze);
      var mob = new GObject({
        type: "enemy",
        data: {img: new Image(), imgc: 0},
        w: SQUARE,
        h: SQUARE,
        y: mobpos.p1 * SQUARE,
        x: mobpos.p2 * SQUARE,
        mx: 3,
        my: 3,
        draw: function(ctx, dt){
          try{
            ctx.drawImage(this.data.img, this.x, this.y);
          }catch(e){}
        },
        update: function(dt){
          //update mob sprite
          if(this.data.imgc > 1){
            this.data.img.src = assets.enemy.walk0;
          }else{
            this.data.img.src = assets.enemy.walk1;
          }
          this.data.imgc += dt;
          if(this.data.imgc > 2) this.data.imgc = 0;
        },
        onCollision: function(elem, coll){
          if(elem.type == "block" || elem.type == "exit"){
            //change direction
            if(coll.side == "right"){
              this.x = coll.other.x - this.w;
              if(coll.intersection){
                if(!Utils.random(0,10)) this.mx = -this.mx;
              }
            }
            else if(coll.side == "left"){
              this.x = coll.other.x + coll.other.w;
              if(coll.intersection){
                if(!Utils.random(0,10)) this.mx = -this.mx;
              }
            }
            else if(coll.side == "bottom"){
              this.y = coll.other.y - this.h;
              if(coll.intersection){
                if(!Utils.random(0,10)) this.my = -this.my;
              }
            }
            else if(coll.side == "top"){
              this.y = coll.other.y + coll.other.h;
              if(coll.intersection){
                if(!Utils.random(0,10)) this.my = -this.my;
              }
            }
          }
        }
      });
      game_objects.push(mob);
    }

    for(var x=0; x<level; x++){
      createMob();
    }

  }

  var update = function(dt) {
    //detect collisions and update all game's objects
    for(var x = 0; x < game_objects.length; x++) {
      var o = game_objects[x];
      for(var y = 0; y < game_objects.length; y++) {
        var e = game_objects[y];
        if(!o.equals(e)){
          var c = o.collides(e);
          if(c){
            if(!o.collision || o.collision.min < c.min){
              o.collision = c;
              o.onCollision(e, c);
            }
          }
        }
      }
      o.update(dt);
    }

  };

  var draw = function(ctx, dt) {
    //draw the level
    ctx.fillStyle = "#BBB";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(var x=0; x < game_objects.length; x++) {
      game_objects[x].draw(ctx, dt);
    }

    ctx.font = "10px Helvetica";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillText("\""+username+"\"", 10, 11);
    ctx.fillText("LEVEL "+level, 110, 11);
    ctx.fillText("TIME "+time, 210, 11);
    ctx.fillText("LIVES "+lives, 310, 11);
    ctx.fillText("POINTS "+points, 410, 11);

  };

  var onkeydown = function(e) {
    if(e.keyCode === 27) {//esc
      Engine.setScene(Splash);
    }else if(!player.data.died && e.keyCode === 38) {//up
      player.my = -5;
    }else if(!player.data.died && e.keyCode === 40) {//down
      player.my = 5;
    }else if(!player.data.died && e.keyCode === 37) {//left
      player.mx = -5;
    }else if(!player.data.died && e.keyCode === 39) {//right
      player.mx = 5;
    }
  };

  var onkeyup = function(e) {
    if(e.keyCode === 38) {//up
      player.my = 0;
    }else if(e.keyCode === 40) {//down
      player.my = 0;
    }if(e.keyCode === 37) {//left
      player.mx = 0;
    }else if(e.keyCode === 39) {//right
      player.mx = 0;
    }
  };

  return {
    reset: reset,
    update: update,
    draw: draw,
    onkeydown: onkeydown,
    onkeyup: onkeyup
  };
  

})();

/*Game Object*/
var GObject = function(conf) {
  var c = conf || {}; //initial configuration
  this.id = Utils.getId(); //ID
  this.type = c.type || ""; //type
  this.x = c.x || 0; //x position
  this.y = c.y || 0; //y position
  this.h = c.h || SQUARE; // height
  this.w = c.w || SQUARE; //width
  this.mx = c.mx || 0; //x movement
  this.my = c.my || 0; //y movement
  this.drawf = c.draw; //draw function
  this.updatef = c.update || function(){}; //update function
  this.collision = null; //temporary collision object
  this.onCollision = c.onCollision || function(){}; //onCollision function
  this.data = c.data || {}; //object data
  this.hidden = c.hidden || false;
};

GObject.prototype.draw = function(ctx, dt) {
  if(!this.hidden){
    this.drawf(ctx, dt);
  }
};

//detect if an object collides with another
GObject.prototype.collides = function(b) {
    var a = this;
    var collision = a.x <= b.x + b.w &&
                    a.x + a.w >= b.x &&
                    a.y <= b.y + b.h &&
                    a.y + a.h >= b.y;
    if(!collision) return null;
           
    var intersection = a.x < b.x + b.w &&
                       a.x + a.w > b.x &&
                       a.y < b.y + b.h &&
                       a.y + a.h > b.y;

    var _side = "";
    var min = Infinity;

    var left = b.x + b.w - a.x;
    if(left < min){
      side = "left";
      min = left;
    }

    var right = a.x + a.w - b.x;
    if(right < min){
      side = "right";
      min = right;
    }

    var top = b.y + b.h - a.y;
    if(top < min){
      side = "top";
      min = top;
    }

    var bottom = a.y + a.h - b.y;
    if(bottom < min){
      side = "bottom";
      min = bottom;
    }

    return {
      collision: collision,
      intersection: intersection,
      other: b,
      left: left,
      right: right,
      top: top,
      bottom: bottom,
      side: side,
      min: min
    }

}

GObject.prototype.equals = function(b) {
  return this.id === b.id;
};

GObject.prototype.update = function(dt) {

  if(dt > 1) dt = 1;

  this.updatef(dt);

  //position
  this.x = this.x + (this.mx * dt);
  this.y = this.y + (this.my * dt);

  //stay in canvas
  if(this.x <= 0) {this.x = 0};//left
  if(this.x >= WIDTH-this.w) {this.x = WIDTH-this.w};//right
  if(this.y <= 0) {this.y = 0;};//up
  if(this.y >= HEIGHT-this.h) {this.y = HEIGHT-this.h;};//down

  if(this.collision){
    this.collision = null;
  }

};


/*Maze*/
var Maze = (function(){
  var get = function(h, w){

      "use strict";

      var LEFT = 0, RIGHT = 1, DOWN = 2, UP = 3;

      var l = [];
      
      //generate the maze blocks full
      for(var x=0; x<h; x++){
        var row=[];
        for(var y=0; y<w; y++){
          row[y]="x";
        }
        l[x]=row;
      }
    

      l[1][1]="p"; //start point

      var finished=false;
      var nowx=1;
      var nowy=1;
      var lastx=1;
      var lasty=1;
      var direction = DOWN;
      var _block=0;

      var goResults=[];
      //generate the maze
      while(!finished){
        direction = Utils.random(0,3);
        var goRes = canGo(direction, nowx, nowy);
        if(goRes){
          goResults.push(goRes);
          nowx=goRes.x;
          nowy=goRes.y;
          lastx=goRes.x;
          lasty=goRes.y;
          l[nowx][nowy]="p";
          _block=0;
        }else{
          if(goResults.length){
            var restart = goResults[Utils.random(0,goResults.length-1)];
            nowx = restart.x;
            nowy = restart.y;
            _block++;
          }
        }
      
        if(_block>500){
          finished=true;
          l[lastx][lasty]="e";
        }

      }

      function canGo(dir, x, y){
        try{
          var _p;
          if(dir==LEFT){
            if(l[x-2][y]=="x" && l[x-1][y+1]=="x" && l[x-1][y-1]=="x")
              _p = {x: x-1, y: y};
          }
          if(dir==RIGHT){
            if(l[x+2][y]=="x" && l[x+1][y+1]=="x" && l[x+1][y-1]=="x")
              _p = {x: x+1, y: y};
          }
          if(dir==DOWN){
            if(l[x][y-2]=="x" && l[x-1][y-1]=="x" && l[x+1][y-1]=="x")
              _p = {x: x, y: y-1};
          }
          if(dir==UP){
            if(l[x][y+2]=="x" && l[x-1][y+1]=="x" && l[x+1][y+1]=="x")
              _p = {x: x, y: y+1};
          }

          if(validPoint(_p)) return _p;
        }catch(e){}
        return false;
      }

      function validPoint(p){
        if(p && p.x>0 && p.y>0 && p.x<h-1 && p.y<w-1){
          var _c=0;
          for(var x=-1; x<=1; x++){
            for(var y=-1; y<=1; y++){
              if(l[p.x+x][p.y+y]=="p") _c++;
            }
          }
          if(_c<=2)
            return true;
        }
        return false;
      }

      //convert bidimensional array 2 string array 
      for(var x=0; x<l.length; x++){
        l[x]=l[x].join().replace(/,/g,'');
      }
      return l;

  };

  var getFreePoint = function(maze){
    while(true){
      var x = Utils.random(0, maze.length-1);
      var y = Utils.random(0, maze[0].length-1);
      if(maze[x][y]=="p"){
        return {p1: x, p2: y};
      }
    }
  }
  
  return {
    get: get,
    getFreePoint: getFreePoint
  };
})();


/*Scores DB*/
var Score = (function(){

  var chart = JSON.parse(localStorage.getItem("LSCORES") || JSON.stringify([{username: 'PLAYER1', points: 200},{username: 'PLAYER2', points: 100},{username: 'PLAYER3', points: 50},{username: 'PLAYER4', points: 30},{username: 'PLAYER5', points: 10}]));
  var max = 5;

  var save = function(username, points){
    chart.push({username: username, points: points});
    chart.sort(function(a, b){
      return b.points - a.points;
    });
    if(chart.length>max){
      chart = chart.slice(0, max)
    }
    localStorage.setItem("LSCORES", JSON.stringify(chart));
  };

  var get = function() {
    return chart;
  }

  return {
    save: save,
    get: get
  };
})();


/*Utils*/
var Utils = (function(){

  var nextId = 0;
  var getId = function(){
    return nextId++;
  };

  var random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    getId: getId,
    random: random
  };
})();

window.addEventListener('load', function(){
  Engine.setScene(Splash);
  Engine.start();
});



