Game.init = function() {
  Game.c1.width = Game.width;
  Game.c1.height = Game.height;
  Game.particles = [];
  Game.particlesMax = 50;
  Game.particlesIndex = 0;
  Game.tick = 10;
  Game.peacefulZone = true;

  generateSprite();

  Game.currentState = 'menu';
  Game.player = new Game.Player(4*32,4*32);
  Game.particlePool = new Game.Pool();
  Game.currentMap = new Game.Map('air');
  Game.mode = null;

  Game.weaponTick = Game.weapons[Game.player.currentWeapon].timeBetween;

  Game.menuFontSize1 = 20;
  Game.menuColor1 = '#FFFAB9';
  Game.menuFontSize2 = 20;
  Game.menuColor2 = '#FFFAB9';
  Game.dots = '.';
  Game.arcadeTotalMaps = Game.mapsConfig['arcade'].length;


  Game.enemiesKilled = 0;
  Game.mapsCount = 0;
  Game.mapsCountConfig = 0;
  Game.arcadeLoop = 0;

  Game.loop();
};

Game.state = [];

Game.state['play'] = {
  update: function() {

    // if(Game.currentMap.enemies === 0 && Game.mode === 'survivor'){
    //   Game.currentMap.generated = false;
    //   Game.key.keydownPressed = true;
    //   Game.currentState = 'map';
    // }

    if(Game.key.esc){
      Game.currentMap.generated = false;
      Game.enemiesKilled = 0;
      Game.mapsCount = 0;
      Game.mapsCountConfig = 0;
      Game.arcadeLoop = 0;
      Game.player.currentWeapon = 'pistol';
      Game.currentState = 'menu';
    }

    if(Game.key.enter && !Game.key.enterPressed){
      Game.currentState = 'pause';
      Game.key.enterPressed = true;
    }

    if(Game.player.health <= 0){
      Game.currentState = 'death';
      Game.key.keydownPressed = true;
    }

    Game.currentMap.update();

    Game.mouse.angle = angleCalc( Game.player.x - (Game.currentMap.camera.x), Game.player.y - (Game.currentMap.camera.y), Game.mouse.x - 8, Game.mouse.y - 8);

    if(Game.mouse.down && Game.weaponTick > Game.weapons[Game.player.currentWeapon].timeBetween && !Game.peacefulZone ){

      for (i = 0; i < Game.weapons[Game.player.currentWeapon].quantity; i++) {

        Game.particlePool.get(Game.player.x + ((Game.player.size / 2) - 4), Game.player.y + ((Game.player.size / 2) - 4), Game.mouse.angle, Game.weapons[Game.player.currentWeapon].size, Game.weapons[Game.player.currentWeapon].speed, 'bullet', true, null, '#181818');
        Game.audio.play(Game.player.currentWeapon);

      };

      Game.currentMap.cameraShake.y += random(-1, 1);
      Game.currentMap.cameraShake.x += random(-1, 1);

      Game.player.gunForce.x -= Math.cos((Math.PI * 2) + Game.mouse.angle) * Game.weapons[Game.player.currentWeapon].force;
      Game.player.gunForce.y -= Math.sin((Math.PI * 2) + Game.mouse.angle) * Game.weapons[Game.player.currentWeapon].force;
      Game.weaponTick = 0;
    }

    Game.player.update();

    for (i = 0; i < Game.particlePool.elements.length; i++) {

      if(!Game.particlePool.elements[i].free){

        if(!Game.particlePool.elements[i].isDead()){

          Game.particlePool.elements[i][Game.particlePool.elements[i].type]();

        } else {

          Game.particlePool.free(Game.particlePool.elements[i]);

        }

      }

    };

    Game.weaponTick++;
    Game.tick++;

  },
  draw: function() {

    Game.currentMap.draw();
    Game.player.draw();


    for (i = 0; i < Game.particlePool.elements.length; i++) {

      if(!Game.particlePool.elements[i].free){

        Game.particlePool.elements[i].draw();

      }

    };
    Game.c1ctx.textAlign = 'left';
    Game.c1ctx.font = 'normal 14px arial';
    Game.c1ctx.fillStyle = 'rgba(255,255,255,0.3)';
    Game.c1ctx.fillRect(0,0,Game.width, 32);
    Game.c1ctx.fillStyle = '#181818';
    Game.c1ctx.fillText('Health: ' + Game.player.health, 16, 20);
    Game.c1ctx.fillText('Enemies: ' + Game.currentMap.enemies, 112, 20);

    if(Game.mode === 'arcade'){
      Game.c1ctx.fillText('Maps: ' + (Game.mapsCount + 1) +'/'+ Game.arcadeTotalMaps, 208, 20);
    }

    if(Game.mode === 'survivor'){
      Game.c1ctx.fillText('Maps: ' + (Game.mapsCount), 208, 20);
    }

    //mouse debug
    // Game.c1ctx.fillStyle = '#181818';
    // Game.c1ctx.fillText(Game.mouse.angle, 10, 10);
    // Game.c1ctx.fillText(Game.mouse.down, 10, 20);

  }
};

Game.state['menu'] = {
  update: function() {

    if(Game.mouse.x < Game.width / 2){
      Game.menuFontSize2 += (20 - Game.menuFontSize2) * 0.3;
      Game.menuFontSize1 += (30 - Game.menuFontSize1) * 0.3;
      Game.menuColor2 = '#e3e3e3';
      Game.menuColor1 = '#ECE894';

      if(Game.mouse.down){
        Game.mode = 'arcade';
        Game.currentState = 'map';
        Game.player.health = 10;
      }

    }

    if(Game.mouse.x > Game.width / 2){
     Game.menuFontSize1 += (20 -Game.menuFontSize1) * 0.3;
     Game.menuFontSize2 += (30 -Game.menuFontSize2) * 0.3;
     Game.menuColor2 = '#ECE894';
     Game.menuColor1 = '#e3e3e3';

      if(Game.mouse.down){
        Game.mode = 'survivor';
        Game.currentState = 'map';
        Game.player.health = 10;
      }

    }

  },
  draw: function() {

    Game.c1ctx.fillStyle = Game.menuColor1;
    Game.c1ctx.fillRect(0, 0, Game.width / 2, Game.height);
    Game.c1ctx.font = 'normal '+Game.menuFontSize1+'px arial';
    Game.c1ctx.textAlign = 'center';
    Game.c1ctx.fillStyle = '#181818';
    Game.c1ctx.fillText('ARCADE', (Game.width / 2) / 2, Game.height / 2);

    Game.c1ctx.fillStyle = Game.menuColor2;
    Game.c1ctx.fillRect(Game.width / 2, 0, Game.width / 2, Game.height);
    Game.c1ctx.font = 'normal '+Game.menuFontSize2+'px arial';

    Game.c1ctx.fillStyle = '#181818';
    Game.c1ctx.fillText('SURVIVOR', (Game.width / 2) + Game.width / 4, Game.height / 2);
    Game.c1ctx.fillRect((Game.width / 2) - 1, 0, 2, Game.height);

    Game.c1ctx.font = 'normal 22px arial';
    Game.c1ctx.fillText('ELEMENTAL BLOCK SHOOTERS', Game.width / 2, 64);

    Game.c1ctx.font = 'normal 12px arial';
    Game.c1ctx.textAlign = 'right';
    Game.c1ctx.fillText('Made for GSSOC', Game.width - 16, Game.height - 16);

  }
};

Game.state['pause'] = {
  update: function() {

    if(Game.key.enter && !Game.key.enterPressed){
      Game.currentState = 'play';
      Game.key.enterPressed = true;
    }

  },
  draw: function() {

    Game.c1ctx.fillStyle = '#181818';
    Game.c1ctx.font = 'normal 25px arial';
    Game.c1ctx.clearRect(0,0,Game.width, Game.height);
    Game.c1ctx.fillText('PAUSE', (Game.width / 2), Game.height / 2);

  }
}

Game.state['death'] = {
  update: function() {

    if(Game.key.enter && !Game.key.enterPressed){

      Game.currentMap.generated = false;
      Game.currentState = 'menu';
      Game.enemiesKilled = 0;
      Game.mapsCount = 0;
      Game.mapsCountConfig = 0;
      Game.arcadeLoop = 0;
      Game.player.currentWeapon = 'pistol';
      Game.key.enterPressed = true;

    }

  },
  draw: function() {

    Game.c1ctx.textAlign = 'center';
    Game.c1ctx.fillStyle = '#181818';
    Game.c1ctx.font = 'normal 20px arial';
    Game.c1ctx.clearRect(0,0,Game.width, Game.height);
    Game.c1ctx.fillText('ENEMIES KILLED: ' + Game.enemiesKilled, (Game.width / 2), Game.height / 2 - 128);
    if(Game.mapsCount > 0){
      Game.c1ctx.fillText('SURVIVED IN '+ Game.mapsCount +' MAPS', (Game.width / 2), Game.height / 2 - 96);
    }
    Game.c1ctx.fillText('MODE: '+ Game.mode.toUpperCase(), (Game.width / 2), Game.height / 2 - 64);
    if(Game.mode === 'arcade'){
      Game.c1ctx.fillText('Loop: '+ Game.arcadeLoop, (Game.width / 2), Game.height / 2 - 160);
    }
    Game.c1ctx.font = 'normal 25px arial';

    Game.c1ctx.fillText('YOU DIED!', (Game.width / 2), Game.height / 2);
    Game.c1ctx.font = 'normal 22px arial';
    Game.c1ctx.fillText('PRESS ENTER', (Game.width / 2), (Game.height / 2) + 96);

  }
}

Game.state['map'] = {
  update: function() {

    // if(Game.currentMap.generated === true && Game.key.keydown && !Game.key.keydownPressed){
    //   Game.currentState = 'play';
    //   Game.key.keydownPressed = true;
    // }

    if(Game.currentMap.generated === true){
      Game.currentState = 'play';
    }

    if(Game.currentMap.generated === false){

      if(Game.tick % 30 === 0){
        Game.dots += '.';
      }

      if(Game.dots.length > 25){
        Game.dots = '.';
      }

    }

    if(Game.currentMap.generated === false && Game.mode === 'arcade'){

      Game.currentMap.generate();

    }

    if(Game.currentMap.generated === false && Game.mode === 'survivor'){

      Game.currentMap.reset();

    }

    Game.tick++;
  },
  draw: function() {

    Game.c1ctx.textAlign = 'center';
    Game.c1ctx.fillStyle = '#181818';
    Game.c1ctx.font = 'normal 22px arial';
    Game.c1ctx.clearRect(0,0,Game.width, Game.height);

    if(Game.currentMap.generated === false){
      Game.c1ctx.fillText('LOADING MAP', (Game.width / 2), Game.height / 2);
      Game.c1ctx.fillText(Game.dots, (Game.width / 2), (Game.height / 2) + 8);
    }

    // if(Game.currentMap.generated === true){
    //   Game.c1ctx.fillText('PRESS ANY KEY TO START!', (Game.width / 2), Game.height / 2);
    // }

    Game.c1ctx.font = 'normal 12px arial';
  }
}

Game.loop = function(timestamp) {
  Game.delta = timestamp - Game.last;

  Game.state[Game.currentState].update();

  //if (Game.delta > 1000 / 30){

    Game.state[Game.currentState].draw();

    Game.last = timestamp - (Game.delta % 1000 / 30);

  //}

  requestAnimationFrame(Game.loop);

};

window.addEventListener('load', function() {

  Game.init();

});