scene('retry', () => {
  add([
    rect(width(), height()),
    pos(0,0),
    color(BLACK),
  ])
  go('game');
});

function truePrice(x) {
  let ox = OFFERS[x];
  return Math.floor(ox.cost * ox.expo ** STUFF.upgrades[x]);
};

// Actual shop:

scene('shop', () => {
  const Z = {
    bg:      0,
    shop:  100,
    top:   200,
    black: 300,
  };

  var selectedOffer = 0;

  add([
    rect(width(), height()),
    pos(0,0),
    z(Z.bg),
    opacity(1),
    color(rgb(110,65,30)),
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

  let fadingOut = false;
  function fadeOut() {
    if (!fadingOut) {
      fadingOut = true;
      for (let f = 0; f < 20; f++) {
        setTimeout(() => {
          black.opacity += 0.05;
        }, f * FADE_TIME / 20);
      };
    };
  };

  for (let i = 0; i < 9; i++) {
    let border = SCALE*0.05;
    let xOff = Math.sin( (Math.PI * i) /4 ) *border;
    let yOff = Math.cos( (Math.PI * i) /4 ) *border;
    if (i == 0) { xOff = 0; yOff = 0; };
    add([
      text('SHOP', {
        size: SCALE*1.3,
        align: 'center',
        font: 'rubik',
      }),
      pos(width()/2 +xOff, SCALE/3 +yOff),
      origin('top'),
      z(Z.top +(i == 0 ? 2:1)),
      color(i == 0 ? WHITE:BLACK),
    ]);
  };
    
  for (let i = 0; i < 5; i++) {
    add([
      sprite('shopRoof', { frame:1 }),
      scale(2*TILE),
      pos(i*2*SCALE, SCALE*0.2),
      z(Z.top),
      opacity(0.2),
    ]);
    add([
      sprite('shopRoof'),
      scale(2*TILE),
      pos(i*2*SCALE, 0),
      z(Z.top),
    ]);
  };

  add([
    sprite('shopNav'),
    scale(TILE * 2/3),
    pos(SCALE/10, SCALE/10),
    z(Z.top),
    area(),
    "menu",
    "navButton",
  ]);
  add([
    sprite('shopNav', { frame:1 }),
    scale(TILE * 2/3),
    pos(SCALE*0.8, SCALE/10),
    z(Z.top),
    area(),
    "retry",
    "navButton",
  ]);


  for (let i = 0; i < 9; i++) {
    let border = SCALE*0.02;
    let xOff = Math.sin( (Math.PI * i) /4 ) *border;
    let yOff = Math.cos( (Math.PI * i) /4 ) *border;
    if (i == 0) { xOff = 0; yOff = 0; };
    add([
      text(`Balance: $${STUFF.money}`, {
        size: SCALE*0.3,
        font: 'ubuntu',
      }),
      pos(SCALE*0.8 +xOff, SCALE*2.6 +yOff),
      origin('botleft'),
      z(Z.top +(i == 0 ? 2:1)),
      color(i == 0 ? WHITE:BLACK),
      "balance",
    ]);
  };

  let yCenter = (height() - SCALE*2)/2 + SCALE*2.2;
  let xCount = 3;
  let yCount = 2;
  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      let index = y*3 + x;
      let itemPos = vec2(
        width()/2 + (-xCount/2 +x-0.88)*SCALE*1.5,
        yCenter + (-yCount/2 +y+0.5)*SCALE*1.5, 
      );
      
      add([
        sprite('box', { frame:1 }),
        scale(TILE*1.3),
        pos(itemPos),
        origin('center'),
        z(Z.shop),
        area(),
        "shopButton",
        {
          btn: index,
        }
      ]);
      add([
        sprite('outline'),
        scale(TILE*1.3),
        pos(itemPos),
        origin('center'),
        z(Z.shop),
        area(),
        opacity(0),
        "outline"
      ]);

      add([
        sprite('upgrades', { frame: index }),
        scale(TILE*1.1),
        pos(itemPos),
        origin('center'),
        z(Z.shop),
      ]);

      add([
        text('0', {
          font: 'ubuntu',
          size: SCALE*0.25,
          align: 'right',
        }),
        pos(itemPos.add(SCALE*0.55, SCALE*0.55)),
        origin('botright'),
        z(Z.shop),
        "counter",
        {
          forOffer: index,
        }
      ]);
    };
  };

  for (let i = 0; i < 4; i++) {
    add([
      sprite('shopGroove'),
      pos(SCALE*5, SCALE*1.5 + SCALE*i),
      scale(TILE*2),
      z(Z.bg),
    ]);
  };

  const buyBtn = add([
    rect(SCALE*3.2, SCALE*0.7),
    pos(SCALE*8.1, SCALE*5.3),
    origin('center'),
    color(rgb(80,80,80)),
    z(Z.shop),
    area(),
    'buyBtn',
    'buyRect',
  ]);

  const buyBtnInner = add([
    rect(SCALE*3.0, SCALE*0.5),
    pos(buyBtn.pos),
    origin('center'),
    color(rgb(100,100,100)),
    z(Z.shop),
    'buyRect',
  ]);

  add([
    rect(SCALE*3.25, SCALE*0.75),
    pos(buyBtn.pos),
    origin('center'),
    color(BLACK),
    z(Z.shop -1),
    area(),
    'buyRect',
    'btnOutline',
  ]);

  const price = add([
    text(' ', {
      align: 'center',
      width: SCALE*3,
      size: SCALE*0.4,
      font: 'manrope',
      letterSpacing: SCALE*0.03,
    }),
    pos(buyBtn.pos.add(0, SCALE*0.03)),
    origin('center'),
    z(Z.shop),
  ]);

  const selectedBox = add([
    sprite('box'),
    origin('center'),
    pos(SCALE*8.07, SCALE*3),
    scale(TILE*1.5),
    z(Z.shop),
  ]);
    
  const largeIcon = add([
    sprite('upgrades'),
    origin('center'),
    pos(SCALE*8.07, SCALE*3),
    scale(TILE*1.26),
    z(Z.shop),
  ]);
  
  add([
    rect(SCALE*3.5, SCALE*0.5),
    pos(largeIcon.pos.add(0, SCALE*0.7)),
    origin('center'),
    z(Z.shop),
    color(BLACK),
    opacity(0.5),
    'buyRect',
  ]);

  const label = add([
    text(' ', {
      size: SCALE*0.3,
      align: 'center',
      width: SCALE*3.5,
      font: 'rubik',
    }),
    pos(largeIcon.pos.add(0, SCALE*0.7)),
    origin('center'),
    z(Z.shop),
  ]);

  const description = add([
    text(' ', {
      size: SCALE*0.2,
      align: 'left',
      width: SCALE*3,
      font: 'ubuntu',
    }),
    pos(label.pos.add(0, SCALE*0.71)),
    origin('center'),
    z(Z.shop)
  ]);

  every('buyRect', (b) => {
    b.radius = SCALE/5;
  });

  function updateShop() {
    let item = OFFERS[selectedOffer];
    
    largeIcon.frame = selectedOffer;
    price.text = `$${shortNum(truePrice(selectedOffer))}`;
    label.text = item.name;
    description.text = item.desc;

    every('balance', (b) => {
      b.text = `Balance: $${STUFF.money.toLocaleString('en-US')}`;
    });

    every('shopButton', (b) => {
      let affordable = truePrice(b.btn) <= STUFF.money;
      let boxColor = affordable ? 0:1;
      b.frame = boxColor;

      if (selectedOffer == b.btn) {
        selectedBox.frame = boxColor;
        let c1 = affordable ? 160 : 80;
        let c2 = affordable ? 200 : 100;
        buyBtn.color = affordable ? 
          rgb(0,c1,0) : rgb(c1,c1,c1);
        buyBtnInner.color = affordable ? 
          rgb(0,c2,0) : rgb(c2,c2,c2);
      };
    });

    every('counter', (c) => {
      c.text = STUFF.upgrades[c.forOffer];
    });
  };
  updateShop();

  onClick('shopButton', (b) => {
    selectedOffer = b.btn;
    updateShop();
  });

  onClick('buyBtn', (b) => {
    if (truePrice(selectedOffer) <= STUFF.money) {
      STUFF.money -= truePrice(selectedOffer);
      STUFF.upgrades[selectedOffer]++;
      updateShop();
    };
  });

  onClick('menu', (m) => {
    fadeOut();
    setTimeout(() => { go('menu'); }, FADE_TIME);
  });
  onClick('retry', (m) => {
    fadeOut();
    setTimeout(() => { go('retry'); }, FADE_TIME);
  });

  onUpdate(() => {
    every('btnOutline', (o) => {
      o.color = o.isHovering() ? WHITE : BLACK;
    });
    every('outline', (o) => {
      o.opacity = o.isHovering() ? 1 : 0;
    });
    every('navButton', (o) => {
      o.scale = o.isHovering() ? vec2(TILE*0.73) : vec2(TILE*2/3);
    });
  });
});