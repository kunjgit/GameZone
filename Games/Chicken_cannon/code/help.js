scene('help', () => {
  const Z = {
    bg:      0,
    text:  100,
    black: 200,
  };

  const tutorialText = [
    '# wewe',
    'fbhfbsdhdhsh',
    'AAA oui',
    '# goAd placeholder',
    'aeAgh'
  ];

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

  let textHeight = 0;
  for (let i = 0; i < tutorialText.length; i++) {
    let txt = tutorialText[i].replace('# ', '');
    let isTitle = !(tutorialText[i] == txt);
    let p = vec2(
      0, 
      SCALE * (textHeight + (isTitle ? 0.3 : 0))
    );
    let shadow = isTitle ? 0.04 : 0.027;
    add([
      text(txt, {
        size: SCALE*(isTitle ? 0.7 : 0.3),
        font: isTitle ? 'rubik' : 'ubuntu',
      }),
      pos(p.add(SCALE*shadow, SCALE*shadow)),
      color(BLACK),
      z(Z.text),
    ]);
    add([
      text(txt, {
        size: SCALE*(isTitle ? 0.7 : 0.3),
        font: isTitle ? 'rubik' : 'ubuntu',
      }),
      pos(p),
      color(WHITE),
      z(Z.text),
    ]);
    textHeight += isTitle ? 1.1 : 0.4;
  }
});