addEventListener("load", function() {

  var f = 2, //friction
      g = 5, //gravity
      b = 32, //block size
      died = false;
      
  var applyFriction = function(dt, s) {
    if((this[s] > 0 && this[s] < f) || (this[s] < 0 && this[s] > -f)) {
      this[s] = 0;
    }
    if(this[s] > 0) {
      this[s] -= f * dt;
    }else if(this[s] < 0) {
      this[s] += f * dt;
    }
  };

  Turtle.init({
    container: '#g',
    block: b,
    height: 20,
    width: 30,
    collisionHandler: function(a, b, side) {
      if(a.is('entity')) {
        if(b.is('block')) {
          if(side == 'bottom') {
            a.y = b.y - a.h;
            a.inAir = false;
            a.sy = 0;
            if(a.is('player')) {
              if(b.is('d')) {
                b.sy = 3;
              } else if(b.is('u')) {
                b.sy = -3;
              } else if(b.is('l')) {
                b.sx = -3;
              } else if(b.is('r')) {
                b.sx = 3;
              }
            }
          }
          if(side == 'top') {
            a.y = b.y + b.h;
            a.sy = 0;
          }
          if(side == 'left') {
            a.x = b.x + b.w;
            a.sx = 0;
          }
          if(side == 'right') {
            a.x = b.x - a.w;
            a.sx = 0;
          }
        }
      }

      if(a.is('player') && !a.dead){
        if(b.is('key')) {
          a.collect('key');
          b.destroy();
          Turtle.sound.play("hurt");
        }
        if(b.is('exit') && b.has('open')) {
          message("WELL DONE!", true, "LEVEL " + currentLevel + " COMPLETED!");
          ++currentLevel;
          Turtle.sound.play("hurt");
        }
        if(b.is('mob') && !b.dead) {
          Turtle.sound.play("hurt");
          if(a.y < b.y - 7) {
            b.dead = 100;
            a.sy = -15;
            b.sy = -15;
            Turtle.sound.play("jump");
          }else {
            a.dead = 500;
            Turtle.sound.play("hurt");
            died = true;
            setTimeout(function() {
              message("OH NO! YOU DIED!", false, "password: " + levels[currentLevel].msg, 6000);
              setTimeout(function() {
                location.reload();
              }, 6000);
            }, 2000);
          }
        }
      }

      if(a.is('mob') && !a.dead) {
        if(b.is('block')) {
          if(Math.random() > 0.95) {
            a.sy = -15;
          }
        }
      }
    },
    objectBehavior: {
      pre: function(dt) {

        if(this.is('entity')) {
          this.sy += g * dt;
          if(this.sy > 33) this.sy = 33;
        }

        this.y += this.sy * dt;
        this.x += this.sx * dt;

        applyFriction.apply(this, [dt, 'sx']);

        if(this.is('block')) {
          applyFriction.apply(this, [dt, 'sy']);
        }
      }, 
      post: function(dt) {
        if(this.id == 'p1' && !this.dead) {
          if (Turtle.controls.isKeyPressed(Turtle.keyCodes.RIGHT)) {
            this.sx = 10;
          }
          if(Turtle.controls.isKeyPressed(Turtle.keyCodes.LEFT)) {
            this.sx = -10;
          }
          if(Turtle.controls.isKeyPressed(Turtle.keyCodes.UP) && !this.inAir && this.sy === 0) {
            this.sy += -20;
            this.inAir = true;
            Turtle.sound.play("jump");
          }
        }
        if(this.is('mob')) {
          if(!this.dead) {
            if(!this.dir) {
              this.dir = 15;
            }else {
              if(Math.random() > 0.99) {
                this.dir = -this.dir;
              }
            }
            this.sx = this.dir;
          }
        }
        if(this.is('entity')) {
          if(this.dead === 1) {
            this.destroy();
          } else {
            this.dead--;
          }
        }
      }
    }
  });

  var sprites = {
    ps: {x: 0, y: 0}, //player stopped
    pjr: {x: 32*9, y: 0}, //player jump right
    pjl: {x: 32*10, y: 0}, //player jump left
    pr: {x: 32, y: 0, nr: 4}, //player walk right
    pl: {x: 32*5, y: 0, nr: 4}, //player walk left
    pd: {x: 324, y: 32}, //player dead
    bx: {x: 0, y: 32}, //block static
    bd: {x: 32, y: 32}, //block down
    bl: {x: 64, y: 32}, //block left
    bu: {x: 96, y: 32}, //block up
    br: {x: 128, y: 32}, //block right
    k: {x: 160, y: 32}, //key
    e: {x: 192, y: 32}, //exit
    eo: {x: 224, y: 32}, //exit opened
    m: {x: 256, y: 32, nr: 2}, //mob
    md: {x: 305, y: 32} //mob dead
  };

  var player1 = function(x, y) {
    return new Turtle.Object('p1', {
      type: ['entity', 'player'],
      x: x*b, y: y*b,
      zIndex: 10,
      sprite: function() {
        var s;
        if(this.dead) {
          s = sprites.pd;
        } else if(this.inAir || this.sy > 10) {
          if(this.sx < 0) {
            s = sprites.pjl;
          } else {
            s = sprites.pjr;
          }
        } else if(this.sx > 0) {
          s = sprites.pr;
        } else if(this.sx < 0) {
          s = sprites.pl;
        } else {
          s = sprites.ps;
        }
        return s;
      }
    });
  };

  var block = function(x, y, type) {
    return new Turtle.Object('block', {
      type: ['block', type],
      x: x*b, y: y*b,
      zIndex: type == 'x' ? 1 : -1,
      sprite: function() {
        return sprites['b'+type];
      }
    });
  };

  var key = function(x, y) {
    return new Turtle.Object('key', {
      type: ['key'],
      x: x*b, y: y*b,
      sprite: function() {
        return sprites.k;
      }
    });
  };

  var exit = function(x, y) {
    return new Turtle.Object('exit', {
      type: ['exit'],
      x: x*b, y: y*b,
      zIndex: -10,
      sprite: function() {
        if(this.has('open')) {
          return sprites.eo;
        }
        return sprites.e;
      }
    });
  };

  var mob = function(x, y, i) {
    return new Turtle.Object('mob'+i, {
      type: ['mob','entity'],
      h: 25, w: 25,
      x: x*b, y: y*b,
      animspeed: 0.3,
      zIndex: 5,
      sprite: function() {
        return this.dead ? sprites.md : sprites.m;
      }
    });
  };

  var runlevel = function(nr) {
    
    document.getElementById('g').style.opacity = 1;
    died = false;
    
    if(nr == levels.length) {
      message("THE END", false, "Bubu return safe to home", true);
      return;
    }
    
    var keys = 0, player, door, mobs = 0;

    var lev = new Turtle.Scene('level'+nr, {
      update: function(dt) {
        if(door && !door.has('open') && keys == player.has('key')) {
          door.collect('open');
        }
        if (!died && Turtle.controls.isKeyPressed(Turtle.keyCodes.R)) {
          runlevel(currentLevel);
        }
      }
    });

    var tile_map = Turtle.Map.fromStrings(levels[nr].map, {
      x: function(x, y) {
        return block(x, y, 'x');
      },
      d: function(x, y) {
        return block(x, y, 'd');
      },
      u: function(x, y) {
        return block(x, y, 'u');
      },
      r: function(x, y) {
        return block(x, y, 'r');
      },
      l: function(x, y) {
        return block(x, y, 'l');
      },
      p: function(x, y) {
        player = player1(x, y);
        return player;
      },
      k: function(x, y) {
        keys++;
        return key(x, y);
      },
      e: function(x, y) {
        door = exit(x, y);
        return door;
      },
      m: function(x, y) {
        ++mobs;
        return mob(x, y, mobs);
      }
    });

    lev.addObject(tile_map);

    var h = 400, w = 600;
    lev.center = {
      getX: function() {
        return player.x - w/2;
      },
      getY: function() {
        return player.y - h/2;
      },
      getW: function() {
        return w;
      },
      getH: function() {
        return h;
      }
    };

    Turtle.addScene(lev);
    var pwdMsg = '';
    if(levels[nr].msg) {
      pwdMsg = "password: " + levels[nr].msg;
    }
    message("LEVEL "+nr, false, pwdMsg);
    setTimeout(function(){
      Turtle.runScene('level'+nr);
    }, 600);
    
  };

  var levels = [
    {
      map: [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxx                 xxxxxx",
        "xxxxxxx                 xxxxxx",
        "xxxxxxx                 xxxxxx",
        "xxxxxxxp               exxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "                              ",
        "                              "
      ]
    },
    {
      map: [
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "xp                          ex",
        "xx                          xx",
        "xxx                        xxx",
        "xxxx               m      xxxx",
        "xxxxx   xxxxxxxxxxxxxx   xxxxx",
        "xxxxxx   xxxxxxxxxxxx   xxxxxx",
        "xxxxxxx   xxxxxxxxxx   xxxxxxx",
        "xxxxxxxx   xxxxxxxx   xxxxxxxx",
        "xxxxxxxxx   xxxxxx   xxxxxxxxx",
        "xxxxxxxxxx   xxxx   xxxxxxxxxx",
        "xxxxxxxxxxx   xx   xxxxxxxxxxx",
        "xxxxxxxxxxxx  k   xxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: '3 + 5',
      pwd: '8'
    },
    {
      map: [
        "                              ",
        "                              ",
        "                              ",
        "                              ",
        "x            x x             x",
        "x           xx xx            x",
        "x          xxx xxx           x",
        "x         xxxx xxxx          x",
        "x        xxxxx xxxxx         x",
        "x       xxxxxx xxxxxx        x",
        "x      xxxxxxx xxxxxxx       x",
        "x     xxxxxxxx xxxxxxxx      x",
        "x    xxxxxxxxx      xxxx     x",
        "x  pxxxk  xxxx xxxx xxxxx    x",
        "x  xxxxxx  xxx xxxx xxxxxx   x",
        "x xxxxxxxx     xxxx    xxxx  x",
        "xxxxxxxxxxxxxx xxxxxxx xxxxxmx",
        "xxxxxxxxxxxxxx xxxxxxx xxxxxxx",
        "xxxxxxxxxxxxxxuxxxxxxx   mexxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'the country with pyramids',
      pwd: 'egypt'
    },
    {
      map: [
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "x                            x",
        "x                xxxxxxxxxxx x",
        "x              xxxxxxxxxxxxx x",
        "xp           xxxxxxxxxxxxxxx x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxx x",
        "x                xxxxxxxxxxx x",
        "x         x      xxxxxxxxxxx x",
        "x         xx     xxxxxxxxxxx x",
        "x    m    xxxx   x           x",
        "x         xxx  xxx  xxxxxx   x",
        "x         xxxx  m   xxxxxxx  x",
        "xxdxxxxxxxxxxxxxxxxxxxxxxxxx x",
        "x                            x",
        "x                            x",
        "x    k                       x",
        "x   xxx                      x",
        "x                            x",
        "x           m             e  x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: '1989 Queen album',
      pwd: 'the miracle'
    },
    {
      map: [
        "x                            x",
        "x                            x",
        "x                           px",
        "x x x x x x x x x x x xxxxxxxx",
        "x x x xmxmxmxmxmxmxmx xxxxxxxx",
        "xdxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "x                            x",
        "x                            x",
        "x                            x",
        "x   xx                       x",
        "x        xx                  x",
        "x             xx             x",
        "x                  xx        x",
        "x                      xx   kx",
        "x                          xxx",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                           ex",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'Pizza Margherita white ingredient',
      pwd: 'mozzarella'
    },
    {
      map: [
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "xp                           x",
        "xxxxr                        x",
        "x                            x",
        "x                            x",
        "x                  k         x",
        "x  x        lxxxxxxxxxxxxxxxxx",
        "x  x        xxxxxxxxxxxxxxxxxx",
        "x  xmmmmmm  xxxxxxxxxxxxxxxxxx",
        "x  xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "x                            x",
        "x                            x",
        "x                          e x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'Batman butler',
      pwd: 'alfred'
    },
    {
      map: [
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxx                        px",
        "x      x               lxxxxxx",
        "x      xk  mxxxxxxxxxxxxxxxxxx",
        "x xxxxxxxxxx   x    x   x    x",
        "x            x x  x   x   x  x",
        "xxxxxxxxxxxxxxe  xxxxxxxxxx  x",
        "x     k      xxxxxxxxxxxxxx  x",
        "x   xxxxxx   x               x",
        "x  xxxxxxxx  x               x",
        "xdxxxxxxxxxx x               x",
        "x xxxxxxxxxx x               x",
        "x xxxxxxxxxx x               x",
        "x xxxxxxxxxx x   xxxxxxxxxxx x",
        "x xxxxxxxxxx x   x           x",
        "x xxxxxxxxxx     x           x",
        "xk          u    xm          x",
        "xxxxxxxxxxxxxxxxuxxxxxxxxxxxux"
      ],
      msg: 'WWI end',
      pwd: '1918'
    },
    {
      map: [
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "xp                          ex",
        "xxxxxxxxxxxx rrrrxxxxxxxxxxxxx",
        "xxxxxxxxxxx  rrrrxxxxxxxxxxxxx",
        "xxxxxxxxxx   rrrrxxxxxxxxxxxxx",
        "xxxxxxxxx    rrrrxxxxxxxxxxxxx",
        "x         xxx                x",
        "x        xx                  x",
        "x       xx                   x",
        "xk     xx                   kx",
        "xx    xx mmmmmmmmm          xx",
        "xxx  xx                    xxx",
        "xxxx                      xxxx",
        "xxxxx                    xxxxx",
        "xxxxxx                  xxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'the answer to life the universe and everything',
      pwd: '42'
    },
    {
      map: [
        "xxxxxxxxxxxxxx               x",
        "x            x   xxx r       x",
        "xp           x   xxx       x x",
        "xxxxxxxxxxxxd  uxxxx       x x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxx x",
        "x                  xxx       x",
        "x     xxxxxxxxxxx  xxx xxxxxxx",
        "x    xxk          xxxx       x",
        "x   xxxxxxx  x xxxxxxxxxxxxx x",
        "x   xxxxxxxx   xxxxx       x x",
        "x        xxxx        xxxx  x x",
        "xxxxxxxx xxxxxxxxxxxx     xx x",
        "x        xxxxxxxxxxx  xxxxxx x",
        "x xxxxxxxxxxxxxxxxxxx     kx x",
        "x x                  l  xxxx x",
        "x x  xxr         xx  xl    x x",
        "x   xxx    m     xx  x l   x x",
        "xxxxxxxxxxxxxxxxxxx  xm l  x x",
        "xe                   xk  l  mx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'Napoli number 10',
      pwd: 'maradona'
    },
    {
      map: [
        "x                        xxx x",
        "x                      xxxxx x",
        "x  xr              lxxxxxxxx x",
        "x  x  m           m xxxxxxxx x",
        "x  xxxxxxxxxxxxxxxxxxxxxxxxx x",
        "x  x                xxxxx    x",
        "x  x                 xxxx    x",
        "x  x   xxxxx           xx    x",
        "xu    xxxxxxx           x    x",
        "xxxxxxxxxxxxxx          x    x",
        "xxxxxxxxxxxxxxx         x    x",
        "x             x  x      x    x",
        "x             x     x x x    x",
        "x             x       x x    x",
        "x             xxxxxxxx  x    x",
        "x                       x    x",
        "xk   m      m     xxxxxux e  x",
        "xxxxxxxxxxxxxxxxxxxxxxxxx x  x",
        "xp                          ux",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'π',
      pwd: '3.14'
    },
    {
      map: [
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "x                            x",
        "x             x              x",
        "x             x              x",
        "x             x              x",
        "x             x              x",
        "x             x              x",
        "x             x              x",
        "x             x              x",
        "xe   mmmmmm   x              x",
        "xxxxxxxxxxxxxxxuddddddxxxx   x",
        "x                        x   x",
        "x             x     k    xu  x",
        "x           x x     x       xx",
        "x         x x x            xxx",
        "x       x x x x           xxxx",
        "x     x x x x x          xxxxx",
        "xp  x x x x x x         xxxxxx",
        "xxx x x x x xmx   mmmmmxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'Guybrush Threepwood',
      pwd: 'monkey island'
    },
    {
      map: [
        "xk                           x",
        "xxx                         lx",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                         u  x",
        "x                     u      x",
        "x                 u          x",
        "x             u              x",
        "x         u                  x",
        "x     u                   x  x",
        "xpu                       x ex",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'Son Goku specie',
      pwd: 'saiyan'
    },
    {
      map: [
        "x                            x",
        "x px  dd  dd  dd  dd  dd  x  x",
        "xex                       x  x",
        "xxx          m            x  x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxx  x",
        "x                            x",
        "x x                          x",
        "x x x x x x x x x x x x      x",
        "x x                    x     x",
        "x x      m               x   x",
        "x xxxxxxxxxxxxxxxxxx  x  x   x",
        "x x               kx  x  x   x",
        "x x               xx  x  x   x",
        "x x              xxk  x  x   x",
        "x               xxxxx x  x   x",
        "xr             xxxx   x  x   x",
        "x             l       x  x   x",
        "xu                   ux  x  ux",
        "x       m             x  x   x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: 'Doctor Who enemies',
      pwd: 'daleks'
    },
    {
      map: [
        "x    x                       x",
        "x    x                       x",
        "x    x                       x",
        "x k  x                       x",
        "x x  xkm                     x",
        "x    xxxx                    x",
        "x    xxxx x                  x",
        "x    xxxx x x               kx",
        "x    xxxx x x x             ux",
        "x    xxxxxxxx xxxx     lr    x",
        "x                        d   x",
        "x   xxxxxx                  xx",
        "x        xx             xxl  x",
        "xu     x x              xxxx x",
        "x     xx x                   x",
        "x    xxx x                   x",
        "x   xxxx x                   x",
        "x  xxxxx x                   x",
        "xpxxxxxx      e     m       ux",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: '1984 main character',
      pwd: 'winston'
    },
    {
      map: [
        "x                             ",
        "x                            k",
        "xpx                          x",
        "xxxd              m      l   x",
        "x   d          xxxxxxx       x",
        "x    d              ex       x",
        "x     d       r   xxxx       x",
        "x      d                     x",
        "x       d                    x",
        "x        d                   x",
        "x         d                  x",
        "xk         d                 x",
        "xx          d                x",
        "xxx         x                x",
        "xxx         xl               x",
        "x           x  x             x",
        "x           xl xx            x",
        "x           x  xxx           x",
        "x k   m      d         m     x",
        "xxxxxxxxxxxxx xxxxxxxxxxxxxxux"
      ],
      msg: 'js13k 2012 winner',
      pwd: 'spacepi'
    },
    {
      map: [
        "x                            x",
        "xp                           x",
        "xxxxx                        x",
        "x                           kx",
        "x                           xx",
        "x    r r r r r r             x",
        "xk    l l l l l              x",
        "xx                           x",
        "xx                           x",
        "x                            x",
        "x              k             x",
        "x              x             x",
        "x                            x",
        "x                            x",
        "x                            x",
        "x                      m    ex",
        "x          m      xxxxxxxxxxxx",
        "x      xxxxxxxxxx            x",
        "x    xu        kxd          kx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: '~',
      pwd: 'tilde'
    },
    {
      map: [
        "x                             ",
        "x      xxxxxxxxxxxxxxxx     xx",
        "x     xxxxxxxxxxxxxxxxx     x ",
        "x    xxxxxxxxxxxxxxxxxx     xp",
        "x   xxxxxxxxxxxxxxxxxxx  e  xx",
        "x   x                 x  x  x ",
        "x   x xxxxxxxxxxxxxx  x     x ",
        "x   x x              xx     xx",
        "x   x x  xxxxxxxxxxxxxx     x ",
        "x   x xx                    xk",
        "x   x xxxxxxxxxxxxxxxxx     xx",
        "x                    kx     x ",
        "x  x     r          lxx     x ",
        "x  xxx     x          x     xx",
        "x  x         x        x     x ",
        "x  x           x      x     x ",
        "x  x             x    x     x ",
        "x   x  mmmmmmmmm   x  x       ",
        "xu  kx mmmmmmmmm     xx   u   ",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ],
      msg: '22 Ti',
      pwd: 'titanium'
    },
    {
      map: [
        "x                            x",
        "x                           ex",
        "x xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "x                            x",
        "x                            x",
        "xrrxxxxxxxxxxxxxxxxxxxxxllx  x",
        "x           mmmmmm        x  x",
        "x                         x  x",
        "x   x    mxm   mxm    x   x  x",
        "x  xxx   xxx   xxx   xxx  x  x",
        "x xxxxx xxxxxkxxxxx xxxxx x  x",
        "xuxxxxxxxxxxxxxxxxxxxxxxxxx  x",
        "x                            x",
        "x                            x",
        "x     x                      x",
        "x    xx                      x",
        "x   xxx                      x",
        "x  xxxxx mmmmmmmmmmmmmmmmmmm x",
        "xpxxxx  ummmmmmmmmmmmmmmmmmm x",
        "xxxxxx  xxxxxxxxxxxxxxxxxxxxux"
      ],
      msg: 'localhost',
      pwd: '127.0.0.1'
    }
  ];
  
  //sounds
  var jump = "data:audio/wav;base64,UklGRs8CAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YasCAACkpKSkfVtbW1uBpKSkoFtbW1tdpKSkpHtbW1tbhKSkpJxbW1tbY6SkpKR0W1tbW4ykpKSTW1tbW22kpKSkaVtbW1uZpKSkhltbW1t8pKSkoltbW1thpKSkpHRbW1tbkKSkpI1bW1tbd6SkpKRdW1tbX6SkpKR0W1tbW5GkpKSLW1tbW3ukpKSfW1tbW2ekpKSka1tbW1ubpKSkflxcXFyHo6OjkVxdXV12o6KioV1dXV1moqKiom1eXl5em6GhoXpeXl9fjaGhoIhfX19fgaCgoJNgYGBgdp+fn51gYGBgbJ+fn59pYWFhZJ6enp5yYmJiYpmenZ14YmJiYpKdnZ1/Y2NjY4ycnJyDY2NkZIecnJyIZGRkZIKbm5uMZWVlZX+bmpqPZWVlZXyampqQZmZmZnuZmZmRZmZnZ3qZmZmSZ2dnZ3qYmJiQaGhoaHuXl5ePaGhoaH2Xl5eNaWlpaX+WlpaKaWpqaoGWlpWHampqaoSVlZWEa2tra4eUlJSAa2trbIqUlJR9bGxsbI6Tk5N4bW1tbZOTk5J0bW1tc5KSkpJvbm5ueJGRkY1ubm5ufpGRkYdvb29vg5CQkIFvcHBwiZCQj3twcHBwj4+Pj3VxcXF3jo6OjHFxcXF+jo6OhHJycnKFjY2NfnJzc3OLjY2Md3Nzc3iMjIyKdHR0dH+Li4uDdHR0dIaLi4t8dXV1d4qKiop1dXV2foqKiYN2dnZ2hImJiX13d3d4iIiIiHd3d3d/iIiIgnh4eHiEh4eHfHh4eHuHh4eFeXl5eYGGhoZ/eXl6eoaFhYV6enp6f4WFhYF7e3t7g4SEhH17e3t+hISEgXx8fHyBg4ODfnx8fH6DgoKBfX19fYGCgoJ/fX1+foGBgYB+fn5+gIGBgX9/f39/gICAgH9/f3+AgA==";
  Turtle.sound.add("jump", jump);
  var hurt = "data:audio/wav;base64,UklGRr0AAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YZkAAACuh29gVouvinNlXG3CmX9vZF5byaaJd2xlYmCZvJqFd29raGdmeMmmj4F4c3BubW1tbm+9r5iJgHp3dXR0c3R0dHV1dnZ3p7Gcj4aBfXt6enl5eXp6enp7e3t7fHx8fH19fX19fX5+fn5+fn5+f39/f39/f39/gJ6Si4aDgYCAf39/f39/f39/f39/f39/f39/f39/f39/f38=";
  Turtle.sound.add("hurt",hurt);


  //msg elem
  var msge = document.createElement('div');
  msge.id = 'msg';
  document.body.appendChild(msge);

  //menu elem
  var menu = document.createElement('div');
  menu.id = 'm';
  menu.innerHTML = '<span>Press H for help</span><div class=\'h\'>Bubu while doing the poo unfortunately finds himself on a strange planet,<br>and now he need your help to escape from here!<br><br>ARROWS: move Bubu<br>H: show/hide this menu<br>R: restart current level (if you stuck)<br>P: enter password<br><br>Jump on enemy to kill him, collect keys to open the door.</div>';
  document.body.appendChild(menu);


  var message = function(msg, runlev, sub, nohide, time) {
  
    Turtle.pause(1);
    
    msge.className = "";
    msge.innerHTML = msg + "<span>"+ (sub || "") +"</span>";
    
    if(!nohide) {
      setTimeout(function() {
        msge.className = "h";
        Turtle.pause(0);
        if(runlev) {
          runlevel(currentLevel);
        }
      }, time || 4000);
    }
    
  };
  
  document.addEventListener('keypress', function(e) {
    if(e.charCode == 104) { //H
      menu.className = menu.className ? '' : 's';
    }
    if(e.charCode == 115 && currentLevel === -1) { //S
      runlevel(currentLevel = 0);
    }
    if(!died && e.charCode == 112) { //P
      var pwd = prompt("PASSWORD") || "";
      for(var x = 1; x < levels.length; x++) {
        if(levels[x].pwd.toLowerCase() == pwd.toLowerCase()) {
          runlevel(currentLevel = x);
          return;
        }
      }
      alert("wrong password!");
    }
  });
  
  var currentLevel = -1;
  message("BREAKAWAY", false, "Press 'S' to start", true);
  
}, false);


