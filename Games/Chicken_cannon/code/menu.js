scene("menu", () => {
  const Z = {
    bg: 0,
    ui: 100,
    black: 200,
  };

  add([rect(width(), height()), pos(0, 0), color(rgb(100, 200, 250))]);

  const black = add([
    rect(width(), height()),
    pos(0, 0),
    z(Z.black),
    opacity(1),
    color(BLACK),
    fixed(),
  ]);

  for (let f = 0; f < 20; f++) {
    setTimeout(() => {
      black.opacity -= 0.05;
    }, f * 15);
  }

  let fadingOut = false;
  function fadeOut() {
    if (!fadingOut) {
      fadingOut = true;
      for (let f = 0; f < 20; f++) {
        setTimeout(() => {
          black.opacity += 0.05;
        }, (f * FADE_TIME) / 20);
      }
    }
  }

  add([
    sprite("logo"),
    pos(center().sub(0, SCALE * 0.9)),
    origin("center"),
    scale(TILE * 7),
    z(Z.ui),
  ]);

  for (let i = 0; i < 1; i++) {
    let btnPos = vec2(center().add(0, SCALE * (0.9 + i)));

    add([
      text([window.self == window.top ? "PLAY" : "PLAY", "HELP"][i], {
        align: "center",
        size: SCALE * 0.4,
        font: "manrope",
      }),
      pos(btnPos.add(0, SCALE * 0.03)),
      origin("center"),
      color(WHITE),
      z(Z.ui + 1),
    ]);

    add([
      rect(SCALE * 3.25, SCALE * 0.75),
      pos(btnPos),
      origin("center"),
      color(BLACK),
      z(Z.ui),
      area(),
      "button",
      "btnOutline",
    ]);

    add([
      rect(SCALE * 3.2, SCALE * 0.7),
      pos(btnPos),
      origin("center"),
      color(rgb(80, 80, 80)),
      z(Z.ui),
      area(),
      "button",
      "clickable",
      {
        goTo: ["game", "help"][i],
      },
    ]);

    add([
      rect(SCALE * 3.0, SCALE * 0.5),
      pos(btnPos),
      origin("center"),
      color(rgb(100, 100, 100)),
      z(Z.ui),
      "button",
    ]);
  }

  every("button", (r) => {
    r.radius = SCALE / 5;
  });

  onClick("clickable", (b) => {
    fadeOut();
    setTimeout(() => {
      go(b.goTo);
    }, FADE_TIME);
  });

  function newCloud(p) {
    add([
      sprite("cloud"),
      pos(p),
      scale(TILE * rand(2, 4)),
      move(180, SCALE),
      z(Z.bg),
      opacity(0.3),
    ]);
  }

  for (let i = 0; i < 6; i++) {
    newCloud(vec2(rand(0, width()), rand(0, height())));
  }

  onUpdate(() => {
    if (rand(0, 100) < 6) {
      let speed = rand(15, 22);
      let angle = randi(45, 80);
      add([
        sprite("chicken"),
        pos(rand(-2, 9) * SCALE, -SCALE),
        origin("center"),
        move(angle, SCALE * speed),
        scale(TILE * 1.5),
        rotate(angle),
        z(Z.bg + 1),
      ]);
    }

    every("btnOutline", (o) => {
      o.color = o.isHovering() ? WHITE : BLACK;
    });

    if (rand(0, 400) < 2) {
      newCloud(vec2(width() + 10, rand(-1, 7) * SCALE));
    }
  });
});

go("menu");
