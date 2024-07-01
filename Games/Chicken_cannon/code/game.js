const STUFF = getData('save', {
  money: 0,
  upgrades: [0,0,0,0,0,0],
});

var debugMode = false;
debug.inspect = false;

function shortNum(x) {
  let letters = ['M', 'B', 'T', 'QA', 'QI', 'SX', 'SP', 'O', 'N', 'D'];
  let len = letters.length;
  for (let i = 0; i < len; i++) {
    let pow = (len-i)*3 + 3;
    if (x >= 10**pow) {
      return `${(x/10**pow).toFixed(1)}${letters[len-1-i]}`;
    };
  };
  return x.toLocaleString('en-US')
};

scene('game', () => {
  const Z = {
    bg:        0,
    game:    100,
    player:  200,
    ui:      300,
    shade:   400,
    endBtns: 500,
    black:   600,
  };

  var score = 0;
  var fuel = 50 + upgradeMod(2);
  var maxFuel = fuel;
  
  var distace = 0;
  var distanceF = 0;
  var altitude = 0;
  var maxAltitude = 0;
  var velocity = 0;
  
  var lastStar = 0;
  var lastCleanup = 0;
  
  var chickenShot = false;
  var groundHit = false;
  var stopped = false;
  var endMenuShown = false;
  var fadingOut = false;
  var fireworkDetatched = false;
  var rolling = false;

  var starsRendered = 0;
  var starsPossible = 0;
  var debugZoomNum = 0;
  var debugZoom = 1;

  const bgRect = add([
    rect(width(), height()),
    pos(0,0),
    z(Z.bg),
    opacity(1),
    color(rgb(100,200,250)),
    fixed(),
  ]);

  const black = add([
    rect(width(), height()),
    pos(0,0),
    z(Z.black),
    opacity(1),
    color(BLACK),
    fixed(),
  ]);

  for (let f = 0; f < 20; f++) {
    setTimeout(() => {
      black.opacity -= 0.05;
    }, f*15);
  };

  function fadeOut() {
    if (!fadingOut) {
      fadingOut = true;
      for (let f = 0; f < 20; f++) {
        setTimeout(() => {
          black.opacity += 0.05;
        }, f * FADE_TIME / 15);
      };
    };
  };
  
  const cannon = add([
    sprite('cannon'),
    pos(SCALE, height() - SCALE*0.85),
    origin('botleft'),
    scale(TILE),
    z(Z.player),
  ]);

  const chicken = add([
    sprite('chicken'),
    pos(0, height()*2),
    origin('center'),
    scale(TILE),
    area(),
    z(Z.player),
    rotate(0),
    'chicken',
    {
      xv: -1,
      yv: -1,
    },
  ]);

  const rocket = add([
    sprite('rocket'),
    pos(0, height()*2),
    origin('center'),
    scale(TILE),
    area(),
    z(Z.player),
    rotate(0),
    opacity(1),
  ]);

  const vaporCone = add([
    sprite('vaporCone'),
    pos(0, height()*2),
    origin('center'),
    scale(TILE),
    z(Z.player),
    rotate(0),
    opacity(1),
  ]);

  function detatchAnim() {
    if (!fireworkDetatched) {
      fireworkDetatched = true;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          rocket.opacity -= 0.1;
        }, i*50);
      };
    };
  };

  for (let i = 0; i < 9; i++) {
    let border = SCALE*0.027;
    let xOff = Math.sin( (Math.PI * i) /4 ) *border;
    let yOff = Math.cos( (Math.PI * i) /4 ) *border;
    if (i == 0) { xOff = 0; yOff = 0; };
    add([
      text(`0m travelled`, {
        size: SCALE*0.6,
        font: 'ubuntu',
      }),
      pos(width() - SCALE/10 +xOff, SCALE/10 +yOff),
      z(Z.ui +(i == 0 ? 2:1)),
      color(i == 0 ? WHITE:BLACK),
      fixed(),
      origin('topright'),
      "distanceText",
    ]);
  };
  
  for (let i = 0; i < 9; i++) {
    let border = SCALE*0.05;
    let xOff = Math.sin( (Math.PI * i) /4 ) *border;
    let yOff = Math.cos( (Math.PI * i) /4 ) *border;
    if (i == 0) { xOff = 0; yOff = 0; };
    add([
      text(`0`, {
        size: SCALE,
        font: 'rubik',
      }),
      pos(SCALE/7 +xOff, SCALE/7 +yOff),
      z(Z.ui +(i == 0 ? 2:1)),
      color(i == 0 ? WHITE:BLACK),
      fixed(),
      "scoreText",
    ]);
  };
  
  for (let i = 0; i < 9; i++) {
    let border = SCALE*0.016;
    let xOff = Math.sin( (Math.PI * i) /4 ) *border;
    let yOff = Math.cos( (Math.PI * i) /4 ) *border;
    if (i == 0) { xOff = 0; yOff = 0; };
    add([
      text(`Altitude: 0m`, {
        size: SCALE*0.25,
        font: 'ubuntu',
      }),
      pos(width() - SCALE/10 +xOff, SCALE*(0.7 + 1/7) +yOff),
      z(Z.ui +(i == 0 ? 2:1)),
      color(i == 0 ? WHITE:BLACK),
      fixed(),
      origin('topright'),
      "altitudeText",
    ]);
  };

  for (let i = 0; i < 9; i++) {
    let border = SCALE*0.016;
    let xOff = Math.sin( (Math.PI * i) /4 ) *border;
    let yOff = Math.cos( (Math.PI * i) /4 ) *border;
    if (i == 0) { xOff = 0; yOff = 0; };
    add([
      text(`Top Altitude: 0m`, {
        size: SCALE*0.18,
        font: 'ubuntu',
      }),
      pos(width() - SCALE/10 +xOff, SCALE*(1.05 + 1/7) +yOff),
      z(Z.ui +(i == 0 ? 2:1)),
      color(i == 0 ? WHITE:BLACK),
      fixed(),
      origin('topright'),
      "maxAltitudeText",
    ]);
  };

  add([
    pos(SCALE/7, SCALE*(1 + 1/7)),
    rect(SCALE*2, SCALE*0.3),
    color(BLACK),
    fixed(),
    z(Z.ui),
  ]);

  add([
    pos(SCALE/7, SCALE*(1 + 1/7)),
    rect(SCALE*0.5, SCALE*0.5),
    color(BLACK),
    fixed(),
    z(Z.ui),
    'fuelLabel',
  ]);

  add([
    pos(SCALE*(0.04 + 1/7), SCALE*(1.04 + 1/7)),
    rect(SCALE*1.92, SCALE*0.22),
    color(rgb(80,80,80)),
    fixed(),
    z(Z.ui),
  ]);

  const fuelValue = add([
    pos(SCALE*(0.04 + 1/7), SCALE*(1.04 + 1/7)),
    rect(SCALE*1.92, SCALE*0.22),
    color(rgb(255,255,0)),
    fixed(),
    z(Z.ui),
  ]);

  add([
    text('FUEL', { font: 'rubik', size: SCALE*0.13 }),
    pos(SCALE*(0.09 + 1/7), SCALE*(1.33 + 1/7)),
    color(WHITE),
    z(Z.ui),
    fixed(),
  ]);

  const groundFix = add([
    rect(width()*2, SCALE*2),
    pos(-width()/2, height()-SCALE*0.9),
    color(rgb(100,60,0)),
    z(Z.bg),
  ]);

  for (let i = 0; i < 12; i++) {
    add([
      sprite('ground'),
      pos(SCALE * i, height()),
      origin('botright'),
      scale(TILE),
      z(Z.game),
      'ground',
    ]);
  };

  onClick(() => {
    if (!chickenShot) {
      chickenShot = true;
      chicken.pos = cannon.pos.add(SCALE/2, -SCALE/2);
      
      let launchVel = 10 + upgradeMod(0);
      chicken.xv = launchVel;
      chicken.yv = launchVel;

      cannon.frame++;
      wait(0.2, () => { cannon.frame++; });
    };
  });

  onCollide('chicken', 'star', (c,s) => {
    score += s.value;
    destroy(s);
  });

  onCollide('chicken', 'trampoline', (c, t) => {
    if (!rolling && !t.used) {
      t.used = true;
      score += 5;
      chicken.yv = Math.abs(0.9 * chicken.yv);
      add([
        text('+5', {
          size: SCALE*0.6,
          font: 'rubik',
          align: 'center',
        }),
        pos(toScreen(c.pos)),
        color(rgb(255,255,100)),
        lifespan(0.5, { fade: 0.5 }),
        origin('center'),
        fixed(),
      ]);
    };
  });

  every('fuelLabel', (f) => { f.radius = SCALE/10; });

  onKeyPress('e', () => {
    showEndMenu();
  });

  function upgradeMod(x) {
    return STUFF.upgrades[x] * OFFERS[x].gain
  };

  function getScore(x) {
    return (Math.log(x) / Math.log(1.5) /5) + 1 + x/30;
  };

  var collectableSizes = [
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
    0.9, 0.9, 0.9, 0.9,
    1.3, 1.3, 1.3, 1.3,
  ];


  onUpdate(() => {
    if (chickenShot && !stopped) {
      chicken.pos = chicken.pos.add(
        chicken.xv *SCALE *dt(),
        -chicken.yv *SCALE *dt()
      );

      velocity = Math.sqrt(chicken.xv**2 + chicken.yv**2);

      if (chicken.pos.y >= height()-SCALE*1.1) {
        chicken.pos.y = height()-SCALE*1.1;
        chicken.yv *= -(-50/(upgradeMod(3)+50) + 1.3);
        if (!rolling) chicken.xv *= -50/(upgradeMod(3)+50) + 1.5;

        if (Math.abs(chicken.yv) <= 0.5) {
          chicken.yv = 0;
          rolling = true;
          if (Math.abs(chicken.xv) <= 0.5) {
            chicken.xv = 0;
          };
        };

        if (!groundHit) {
          groundHit = true;
          fuel = 0
          chicken.frame++;
          detatchAnim();
        };  
      };
      
      chicken.yv -= (50 * 16*dt()) / (upgradeMod(1) + 50);
      if (rolling) {
        if (chicken.xv != 0) {
          chicken.xv -= (30 * dt()*1.3) / (upgradeMod(1) + 30);
        };
      } else {
        chicken.xv -= (30 * dt()) / (upgradeMod(1) + 30);
      };

      if (chicken.xv > 0) {
        if (groundHit && !rolling) {
          chicken.angle += dt()*500;
        } else if (!rolling) {
          chicken.angle = Math.atan2(-chicken.yv, chicken.xv)*57;
        };
        if (rolling) {
          chicken.angle += dt() * chicken.xv*120;
        };
      }; 
    
      if (chicken.xv == 0 && !stopped) {
        stopped = true;
        wait(0.1, () => { 
          chicken.angle = 0;
          setTimeout(showEndMenu, 300);
        });
      };

      if (Math.abs(chicken.xv) <= 0.2)
        chicken.xv = 0;

      distanceF = (chicken.pos.x / SCALE).toFixed(1);
      every('distanceText', (d) => { d.text = `${shortNum(distanceF)}m travelled`; });
      distance = Math.floor(distanceF);

      altitude = ((height()-SCALE*1.1-chicken.pos.y) / SCALE).toFixed(1);
      every('altitudeText', (a) => { a.text = `Altitude: ${shortNum(altitude)}m`; });
      
      maxAltitude = Math.max(maxAltitude, altitude);
      every('maxAltitudeText', (a) => { a.text = `Top Altitude: ${shortNum(maxAltitude)}m`; });

      every('scoreText', (s) => { s.text = score; });
      fuel = Math.max(0, fuel);
      
      camPos(vec2(
        Math.max(center().x, chicken.pos.x),
        Math.min(center().y, chicken.pos.y),
      ));

      // STARS (and more) SPAWNING MESS
      
      if (distance % 2 == 0 && lastStar != distance) {
        lastStar = distance;
        starsRendered = 0;
        starsPossible = 0;
        for (let s = 0; s < STAR_TYPES.length; s++) {
          let current = STAR_TYPES[s];
          for (let i = 0; i < current.count; i++) {
            starsPossible++;
            let starHeight = rand(current.range[0], current.range[1]);
            if (Math.max(Math.abs(chicken.yv), 10) 
              > 
            Math.abs(starHeight - altitude - chicken.yv)) {
              starsRendered++;
              if (current.frame == 'not a star lol') {
                add([
                  sprite('cloud'),
                  scale(TILE * rand(5,14)),
                  origin('center'),
                  area(),
                  pos((distance+10+i)*SCALE, height()- SCALE*starHeight),
                  opacity(0.3),
                  z(Z.game -1),
                  'skyObject',
                ]);
              } else {
                add([
                  sprite('collectables', { frame: current.frame }),
                  scale(TILE * collectableSizes[current.frame]),
                  origin('center'),
                  area(),
                  pos((distance+10+i)*SCALE, height()- SCALE*starHeight),
                  z(Z.game),
                  'star',
                  'skyObject',
                  { value: current.value },
                ]);
              };
            };
          };
        };

        if (rand(0,100) < 15) {
          add([
            sprite('flora', { 
              frame: randi(0,3),
              flipX: rand(0,100) < 50 ? true : false,
            }),
            scale(TILE * rand(0.7, 1)),
            origin('botleft'),
            pos((distance+10)*SCALE, height() - SCALE * rand(0.8, 0.9)),
            z(Z.game),
          ]);
        };
        
        if (rand(0,100) < 4 + upgradeMod(4)) {
          add([
            sprite('trampoline'),
            scale(TILE*1.9),
            origin('botleft'),
            area({ height: 160 }),
            pos((distance+10)*SCALE, height()-SCALE*0.75),
            z(Z.game +1),
            "trampoline",
            {
              used: false,
            }
          ]);
        };
      };

      // end of spawning

      if (isMouseDown()) {
        if (fuel > 0) {
          shake(SCALE/12);
          chicken.yv += 0.8 * (1+upgradeMod(5));
          chicken.xv += 0.3 * (1+upgradeMod(5));
          fuel -= 60*dt();
          rocket.frame = 1;
          add([
            circle(SCALE*0.1),
            color(rgb(100,100,100)),
            lifespan(0.2, { fade: 0.2 }),
            pos(chicken.pos.add(
              SCALE*rand(-0.1, 0.1),
              SCALE*rand(-0.1, 0.1),
            )),
          ]);
        } else {
          detatchAnim();
          rocket.frame = 0;
        };
      } else {
        rocket.frame = 0;
      };

    };

    // end of chicken motion thingy idk

    every('ground', (g) => {
      if (camPos().sub(center()).x >= g.pos.x+SCALE) {
        g.pos.x += SCALE*12;
      };
    });

    let flooredTime = Math.floor(time()*3);
    if (flooredTime != lastCleanup) {
      lastCleanup = flooredTime;
      every('skyObject', (s) => {
        if (s.pos.x <= chicken.pos.x - SCALE*7) {
          destroy(s);
        };
      });
    };

    let n = -0.28;
    rocket.pos = chicken.pos.add(
      Math.sin((chicken.angle+90) /57)*SCALE*n,
      -Math.cos((chicken.angle+90) /57)*SCALE*n,
    );
    rocket.angle = chicken.angle;

    vaporCone.pos = chicken.pos;
    vaporCone.angle = chicken.angle;
    vaporCone.opacity = Math.max(0, -0.16 * Math.abs(velocity - 343) + 1);

    groundFix.pos.x = -width() + camPos().x;

    let blackSky1 = 30000;
    let blackSky2 = blackSky1 * 0.6;
    bgRect.color = rgb(
      Math.max(0, (blackSky2 - altitude) / blackSky2 * 100),
      Math.max(0, (blackSky2 - altitude) / blackSky2 * 200),
      Math.max(0, (blackSky1 - altitude) / blackSky1 * 255),
    );

    every('btnOutline', (o) => {
      o.color = o.isHovering() ? WHITE : BLACK;
    });

    fuelValue.width = SCALE*1.92 * (fuel / maxFuel);

    if (fuel <= maxFuel/5) {
      fuelValue.color = Math.floor(time()*10) % 2 == 0 ? YELLOW : RED;
    } else {
      fuelValue.color = YELLOW;
    };

    if (debugMode) {
      if (isKeyDown('z')) {
        debugZoomNum += 1*dt();
        debugZoom = Math.cos(debugZoomNum)/2.5 +0.6;
        camScale(debugZoom);
      };
    } else {
      camScale(Math.max(Math.min(
        (-1/3000) * altitude + 1 + (20/3000) 
      , 1), 0.35));
    };


    if (debugMode) 
      debug.log(` add: ${starsRendered} / ${starsPossible} \n obj: ${debug.objCount()}\n fps: ${debug.fps()} ( -${60-debug.fps()} ) \nzoom: ${debugZoom.toFixed(1)}`)
  });


  /////////////////////////
  /////////////////////////
  /////////////////////////
  /////////////////////////
  /////////////////////////
  /////////////////////////
  /////////////////////////
  

  function showEndMenu() {
    stopped = true;
    if (!endMenuShown) {
      endMenuShown = true;
      add([
        rect(width(), height()),
        pos(0,0),
        fixed(),
        color(BLACK),
        opacity(0.4),
        z(Z.shade),
      ]);
  
      const endBack = add([
        rect(width()*0.8, height()*0.8),
        pos(center()),
        fixed(),
        color(BLACK),
        opacity(0.75),
        origin('center'),
        scale(0),
        z(Z.shade),
      ]);
      endBack.radius = SCALE/3;
      
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          endBack.scale = endBack.scale.add(0.05, 0.05);
        }, i*10);
      };

      setTimeout(() => {
        add([
          text('Flight complete!', {
            align: 'center',
            size: SCALE*0.75,
            font: 'rubik',
          }),
          pos(width()/2, SCALE*1.5),
          origin('center'),
          z(Z.endBtns),
          fixed(),
          scale(vec2(1.11, 1)),
          opacity(0),
          'endUI',
        ]);

        add([
          rect(SCALE*3.25, SCALE*0.75),
          pos(SCALE*4.725, SCALE*4.175),
          origin('topright'),
          color(BLACK),
          z(Z.endBtns-1),
          fixed(),
          opacity(0),
          area(),
          'endUI',
          'endBtn',
          'btnOutline',
        ]);
        
        const retryBtn = add([
          rect(SCALE*3.2, SCALE*0.7),
          pos(SCALE*4.7, SCALE*4.2),
          origin('topright'),
          color(rgb(0,160,0)),
          z(Z.endBtns),
          fixed(),
          opacity(0),
          area(),
          'endUI',
          'endBtn',
          'retry'
        ]);

        add([
          rect(SCALE*3.0, SCALE*0.5),
          pos(SCALE*4.6, SCALE*4.3),
          origin('topright'),
          color(rgb(0,200,0)),
          z(Z.endBtns),
          fixed(),
          opacity(0),
          'endUI',
          'endBtn',
        ]);

        add([
          text('RETRY', {
            align: 'center',
            width: SCALE*3,
            size: SCALE*0.4,
            font: 'manrope',
            letterSpacing: SCALE*0.03,
          }),
          pos(SCALE*4.6, SCALE*4.38),
          origin('topright'),
          fixed(),
          opacity(0),
          z(Z.endBtns),
          'endUI'
        ]);

        const shopBtn = add([
          rect(SCALE*3.2, SCALE*0.7),
          pos(SCALE*5.3, SCALE*4.2),
          origin('topleft'),
          color(rgb(80,80,80)),
          z(Z.endBtns),
          fixed(),
          opacity(0),
          area(),
          'endUI',
          'endBtn',
          'shop'
        ]);

        add([
          rect(SCALE*3.25, SCALE*0.75),
          pos(SCALE*5.275, SCALE*4.175),
          origin('topleft'),
          color(BLACK),
          z(Z.endBtns-1),
          fixed(),
          opacity(0),
          area(),
          'endUI',
          'endBtn',
          'btnOutline',
        ]);

        add([
          rect(SCALE*3.0, SCALE*0.5),
          pos(SCALE*5.4, SCALE*4.3),
          origin('topleft'),
          color(rgb(100,100,100)),
          z(Z.endBtns),
          fixed(),
          opacity(0),
          'endUI',
          'endBtn',
        ]);

        add([
          text('SHOP', {
            align: 'center',
            width: SCALE*3,
            size: SCALE*0.4,
            font: 'manrope',
            letterSpacing: SCALE*0.03,
          }),
          pos(SCALE*5.4, SCALE*4.38),
          origin('topleft'),
          fixed(),
          opacity(0),
          z(Z.endBtns),
          'endUI'
        ]);

        every('endBtn', (b) => {
          b.radius = SCALE/5;
        });

        let moneyGain = Math.floor(
          score/2 +
          getScore(distanceF -16) +
          getScore(maxAltitude -3)
        );
        if (moneyGain.toString() == 'NaN') moneyGain = 0;
        
        STUFF.money += moneyGain;

        let somethingAffordable = false;

        for (let i = 0; i < OFFERS.length; i++) {
          somethingAffordable = (truePrice(i) <= STUFF.money);
          if (somethingAffordable) break;
        };
        
        if (somethingAffordable) {
          add([
            sprite('attention'),
            pos(SCALE*8.435, SCALE*4.275),
            origin('center'),
            scale(TILE/4),
            z(Z.endBtns +3),
            fixed(),
            opacity(0),
            'endUI',
          ]);
        };
  
        add([
          text(`Distance: \nApogee: \nPoints: \nMoney Gained: \n\nBalance:`, {
            size: SCALE*0.27,
            align: 'left',
            width: SCALE*2.5,
            font: 'ubuntu',
            lineSpacing: SCALE*0.05,
            letterSpacing: SCALE*0.01,
          }),
          pos(center().sub(2*SCALE, 0)),
          origin('center'),
          z(Z.endBtns),
          fixed(),
          opacity(0),
          'endUI',
        ]);
        
        add([
          text(`${shortNum(parseFloat(parseFloat(distanceF).toFixed(1)))}m\n ${shortNum(parseFloat(parseFloat(maxAltitude).toFixed(1)))}m\n ${shortNum(score)}\n +$${shortNum(moneyGain)}\n\n $${shortNum(STUFF.money)}`, {
            size: SCALE*0.27,
            align: 'right',
            width: SCALE*5,
            font: 'ubuntu',
            lineSpacing: SCALE*0.05,
            letterSpacing: SCALE*0.01,
          }),
          pos(center().add(0.75*SCALE, 0)),
          origin('center'),
          z(Z.endBtns),
          color(rgb(0,255,0)),
          fixed(),
          opacity(0),
          'endUI',
        ]);

        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            every('endUI', (e) => {
              e.opacity += 0.1;
            });
          }, i*15);
        };

        setData('save', STUFF);

        onClick('retry', (r) => {
          fadeOut();
          setTimeout(() => { go('retry'); }, FADE_TIME);
        });

        onClick('shop', (r) => {
          fadeOut();
          setTimeout(() => { go('shop'); }, FADE_TIME);
        });
      }, 200);
    };

  };
  
});