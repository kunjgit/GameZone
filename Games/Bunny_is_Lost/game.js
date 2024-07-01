"use strict";

var d = document;
var rnd = Math.random;
var round = Math.round;
var find = d.querySelector.bind(d);
var worldDeg = 0;
var life = 100;
var jumpPrepare = 0;
var jumpForce = 0;
var unblockKeys = ['F5','F11','F12'];
var timeout = (secs, fn)=> setTimeout(fn, secs*1000);
var distM = 0;
var gameTic = null;

function resizeGame() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.style.transform = `scale(${w/1400})`;
  if (w < h) {
    d.body.className = 'vertical'
    e.style.top = `-${h*.8}px`;
  } else {
    d.body.className = 'horizontal'
    e.style.top = `-${h/5}px`;
  }
}
resizeGame();
window.onresize = resizeGame;

var offAudioCtx = new OfflineAudioContext(2,44100*21,44100);

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

//   Cc   Eb        Fc   Gc   Bb
// C    D    E    F    G    A    B
var notes = [{
  C:16.35, Cc:17.32, D:18.35, Eb:19.45, E:20.60, F:21.83,
  Fc:23.12, G:24.50, Gc:25.96, A:27.50, Bb:29.14, B:30.87
}];
for (var i=1; i<=8; i++) {
  notes[i] = { };
  for (var n in notes[0]) notes[i][n] = notes[0][n] * Math.pow(2, i+1);
}

function playTone(freq, length, attack) {
  if (!attack) attack = 2;
  var o = audioCtx.createOscillator();
  o.frequency.value = freq;
  var g = audioCtx.createGain();
  g.connect(audioCtx.destination);
  g.gain.value = 0;
  g.gain.setValueAtTime(attack, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + length);
  o.connect(g);
  o.start(0);
}

function playOffMusicNote(freq, start, end, attack) {
  if (!attack) attack = 2;
  var o = offAudioCtx.createOscillator();
  o.frequency.value = freq;
  var g = offAudioCtx.createGain();
  g.connect(offAudioCtx.destination);
  g.gain.value = 0;
  g.gain.setValueAtTime(attack, offAudioCtx.currentTime + start);
  g.gain.linearRampToValueAtTime(0, offAudioCtx.currentTime + end);
  o.connect(g);
  o.start(0);
}

// Parse and play ABC notation
function playABC(opts) {
  var callback = arguments[arguments.length-1] || function(){};
  if (!opts.time) opts.time = 1;
  if (!opts.attack) opts.attack = 1;
  var timePos = 0;
  var music = '';
  for (var i=1; i<arguments.length-1; i++) music += ' ' + arguments[i];
  music
  .replace(/([a-gzx])/ig, ' $1') // Separate notes
  .replace(/^\s*|\s*$/g,'')   // Trim
  .split(/\s+/).forEach((n)=>{
    var octave = ( 'abcdefg'.indexOf(n[0]) > -1 ) ? 4 : 3;
    if (n[1] === ',') {
      octave--;
      n = n[0] + n.substring(2);
    }
    if (n[1] === "'") {
      octave++;
      n = n[0] + n.substring(2);
    }
    var length = (n[1] ? n.substring(1) : '1');
    length = (length[0]==='/') ? (length.length===1) ? .5 : 1/parseInt(length[1]) : parseInt(length);
    length *= opts.time;
    n = n[0].toUpperCase();
    if (n !== 'Z') {
      playOffMusicNote(notes[octave][n], timePos, timePos+length, opts.attack);
    }
    timePos += length;
  });
  timeout(timePos+.1, callback);
}

// Create Song
playABC(
  {time:1/6, attack:1},
  'a2ed cAce eaae cAce a2ed cAce d2B2 B2ef',
  'a2ed cAce eaae cAce defg afed c2A2 A2',
  'ce',
  'f2cB AFce f2cB ABce f2cB AFGA G2E2 E2ce',
  'f2cB AFce fecB ABce fefg afed c2A2 A2',
  null
);

// Render and loop play
offAudioCtx.startRendering()
.then((renderedBuffer)=> {
  var song = audioCtx.createBufferSource();
  song.buffer = renderedBuffer;
  song.connect(audioCtx.destination);
  song.loop = true;
  song.start();
})
.catch((err)=> console.error('Music Fail', err) );


HTMLElement.prototype.mkEl = function mkEl(tag, css, attrs) {
  var att, el = d.createElement(tag);
  for (att in css) el.style[att] = css[att];
  if (attrs) for (att in attrs) el[att] = attrs[att];
  this.appendChild(el);
  el.del = ()=> this.removeChild(el);
  return el;
}

var bloodList = [];
function mkBlood(x, y, vx, vy) {
  var b = e.mkEl('blood', {border:round((1+rnd())*5)+'px solid #B00', top:'50%', left:'50%', zIndex:2});
  b.x = x;
  b.y = y;
  b.vx = vx;
  b.vy = vy;
  bloodList.push(b);
  return b;
}
function updateBlood() {
  bloodList.forEach((b)=> {
    b.x += b.vx;
    b.y += b.vy;
    b.vy -= 3;
    if (b.y <= 0) b.y = b.vx = b.vy = 0;
    b.style.transform = `rotate(${b.x}deg) translate(0,-${1500+b.y}px)`;
  });
}

function Bunny() {
  // <bw> wrapper
  //   <b> body
  //     <bl></bl> back leg
  //     <bh></bh> head
  //   </b>
  // </bw>
  this.x = 0;
  this.y = 33;
  this.radius = 33;
  this.wrap = e.mkEl('bw',{},{className:'stopped'});
  var b = this.wrap.mkEl('b');
  this.wrap.body = b;
  b.mkEl('bl');
  b.mkEl('bh');
  //this.wrap.mkEl('div', {border:'1px solid red', outline:this.radius+'px solid rgba(0,255,0,.4)'});
  this.update();
}
Bunny.prototype.status = function(s) {
  if (s) this.wrap.className = s;
  return this.wrap.className;
}
Bunny.prototype.statusIs = function(s) {
  return this.status().indexOf(s) > -1;
}
Bunny.prototype.statusIsnt = function(s) {
  return this.status().indexOf(s) === -1;
}
Bunny.prototype.update = function() {
  this.wrap.style.transform = `rotate(${this.x+1.5}deg) translate(0,-${1460+this.y}px)`;
}

var player = new Bunny();

function Carrot(x, y) {
  Carrot.list.push(this);
  this.x = x;
  this.y = y;
  this.radius = 17;
  this.el = e.mkEl('carrot-wrap', {transform:`rotate(${x}deg)`, zIndex:2});
  this.el.mkEl('leaves', {transform:`translate(-20px, ${-1503-y}px)`} );
  this.el.mkEl('carrot', {transform:`translate(-20px, ${-1503-y}px)`} );
  //this.el.mkEl('div', {transform:`translate(0, ${-1503-y}px)`, border:'1px solid red', outline:this.radius+'px solid rgba(0,255,0,.4)'});
}
Carrot.list = [];

Carrot.prototype.remove = function() {
  Carrot.list = Carrot.list.filter((c)=> c!==this );
  this.el.del();
}

function updateCarrots() {
  // Create carrots
  if ( round(worldDeg*10) % 80 === 0 ) {
    if (rnd()<.7) {
      new Carrot(-worldDeg+30, 35+rnd()*200);
    } else {
      var y = 100 + rnd()*200
      new Carrot(-worldDeg+28, y);
      new Carrot(-worldDeg+30.5, y+40);
      new Carrot(-worldDeg+32, y);
    }
  }
  // Remove ast carrots
  Carrot.list.forEach((c)=> {
    if (c.x < -worldDeg-90) c.remove();
  });
  // Eat carrots
  Carrot.list.forEach((c)=> {
    if (touch(player, c, 20)) {
      life += 10;
      if (life>100) life=100;
      timeout(.0, ()=> playTone(1900, .3) );
      timeout(.1, ()=> playTone(1100, .3) );
      c.remove();
    }
  });
}

new Carrot( 6, 40);
new Carrot( 8, 40);
new Carrot(10, 40);
new Carrot(12, 40);
new Carrot(15, 40);
new Carrot(19, 40);
new Carrot(24, 40);
new Carrot(30, 40);

function Bird(x, y) {
  Bird.list.push(this);
  this.velocity = 0.1 + rnd()/2;
  this.x = x;
  this.y = y;
  this.radius = 75;
  this.wrap = e.mkEl('bird-wrap', {transform:`rotate(${x}deg)`, zIndex:2});
  //this.wrap.mkEl('test', {transform:`translate(0, ${-1500-y}px)`, zIndex:99, border:'1px solid red', outline:this.radius+'px solid rgba(0,255,0,.5)'}); // test mark
  this.el = this.wrap.mkEl('div', {transform:`translate(0, ${-1500-y}px)`})
  var bird = this.el.mkEl('bird');
  this.el.mkEl('wing-right', {}, {className:'wing'});
  this.el.mkEl('wing-left', {}, {className:'wing'});
  bird.mkEl('head');
}

Bird.list = [];

Bird.prototype.update = function() {
  this.x -= this.velocity;
  if (this.x-5 > -worldDeg) this.y -= this.velocity*4;
  if (this.x+5 < -worldDeg) this.y += this.velocity*8;
  if (this.y < 200) this.y = 200;
  this.wrap.style.transform = `rotate(${this.x}deg)`;
  this.el.style.transform = `translate(0, ${-1500-this.y}px)`;
  if (this.x < -worldDeg-90) this.die();
  this.testGetBunny();
  if (this.hunted) {
    this.hunted.x = (this.hunted.x*2 + (this.x-2)) / 3;
    this.hunted.y = (this.hunted.y*2 + (this.y-100)) / 3;
    mkBlood(this.hunted.x+rnd()*2, this.hunted.y, 0, 0);
  }
}
Bird.update = function() {
  Bird.list.forEach((b)=> b.update() );
  if ( round(worldDeg*10) % 80 === 0 && rnd() < .4 )
    new Bird(-worldDeg+25, 200+rnd()*300);
};

Bird.prototype.testGetBunny = function() {
  if (player.y < this.y && player.statusIsnt('hunted')) {
    if (touch(player, this)) {
      die('hunted');
      this.hunted = player;
    }
  }
}

Bird.prototype.die = function() {
  Bird.list = Bird.list.filter((b)=> b!==this );
  this.wrap.del();
}

var sin = (deg)=> Math.sin((deg%180)*Math.PI/180);
var cos = (deg)=> Math.cos((deg%180)*Math.PI/180);

function dist(obj1, obj2) {
  var x1 = sin(obj1.x) * (obj1.y+1500);
  var y1 = cos(obj1.y) * (obj1.y+1500);
  var x2 = sin(obj2.x) * (obj2.y+1500);
  var y2 = cos(obj2.y) * (obj2.y+1500);
  var dX = x1 - x2;
  var dY = y1 - y2;
  return Math.sqrt(dX*dX + dY*dY);
}

function touch(obj1, obj2, inc) {
  if (!inc) inc = 0;
  return dist(obj1, obj2) <= (obj1.radius + obj2.radius + inc);
}

//new Bird(30, 300);
//var bird = new Bird(20, 200);

//player.status('dead');
//player.status('hunted');
//bird.hunted = player;
//e.mkEl('qqqqq', {left:'50%',top:'50%',transform:'translate(0,-1500px)',border:'1px solid #00f', zIndex:99});

for (var x=0; x<360; x++) { // grass (capim)
  //e.mkEl('k', {transform:'rotate('+(x+rnd()*.4-.2)+'deg) translate(0,-'+(1511-rnd()*10)+'px)'});
  if (rnd()<0.3) e.mkEl('f', {transform:'rotate('+(x+rnd()-.5)+'deg) translate(0,-'+(1498-rnd()*20)+'px)'});
}

jumpPF.update = function() {
  if (player.status() == 'prepare') {
    jumpPrepare += 1.5;
    if (jumpPrepare > 50) jumpPrepare = 50;
    this.style.height = jumpPrepare*2+'%';
  }
};

var montains = { bg1:[], bg2:[] };
function updateMontains(bg, prob) {
  if (rnd()<prob) {
    var w = round(180+rnd()*100);
    var h = round(1350+rnd()*80);
    var curMid = -worldDeg + worldDeg/2;
    if (bg.id==='bg2') curMid += worldDeg/4;
    var posX = curMid + 40;
    var m = bg.mkEl('m', {
      borderRadius: round(w/2.2)+'px', width:w+'px', marginLeft:'-'+round(w/2)+'px',
      transform:'rotate('+posX+'deg) translate(0,-'+h+'px)', zIndex: round(rnd()*5)
    });
    m.posX = posX;
    montains[bg.id].push(m);
  }
  if (montains[bg.id][0] && (montains[bg.id][0].posX < curMid - 40) ) {
    montains[bg.id].shift().del();
  }
}

for (worldDeg=200; worldDeg>0; worldDeg-=0.1) {
  if ( round(worldDeg*10) % 80 === 0 ) updateMontains(bg1, 0.6);
  if ( round(worldDeg*10) % 60 === 0 ) updateMontains(bg2, 0.6);
}

function burnTest() {
  if ( player.statusIs('stopped') ) {
    if ( player.x < (-worldDeg-15) ) {
      die('burned');
      for (var i=0; i<15; i++) mkBlood(player.x, player.y, rnd(), 15+rnd()*5);
    }
  }
}

function die(status) {
  player.status('dead '+status);
  timeout(2, ()=> {
    timeout(0, ()=> playTone(300, 1, 4) );
    timeout(1, ()=> playTone(200, 2, 4) );
    timeout(2, ()=> playTone(100, 4, 6) );
    distEl.mkEl('div').innerText = `The bunny die ${status}, lost and alone.`;
    timeout(3, ()=> {
      d.body.style.transition = '2s';
      d.body.style.filter = 'sepia(90%)';
    });
    timeout(4, ()=> clearInterval(gameTic) );
  });
}

function start() {

  intro.style.display = 'none';

  // Make Fire
  timeout(0.3, ()=> fire.mkEl('w', {left:'40%'}, {className:'fireBack fireBig'}) );
  timeout(0.6, ()=> fire.mkEl('w', {left:'50%'}, {className:'fireMid fireBig'}) );
  timeout(0.9, ()=> fire.mkEl('w', {left:'60%', zIndex:1}, {className:'fireBack fireBig'}) );
  timeout(1.2, ()=> fire.mkEl('w', {left:'70%'}, {className:'fireMid fireBig'}) );
  timeout(1.5, ()=> fire.mkEl('w', {right:'112px', zIndex:1}, {className:'fireBackEdge'}) );
  timeout(1.8, ()=> fire.mkEl('w', {right:'60px'}, {className:'fireEdge'}) );

  gameTic = setInterval(()=>{ // Tic
    worldDeg -= 0.1;
    if ( round(worldDeg*10) % 80 === 0 ) updateMontains(bg1, 0.6);
    if ( round(worldDeg*10) % 60 === 0 ) updateMontains(bg2, 0.6);

    // Roll the world
    e.style.transform = 'rotate('+(worldDeg)+'deg)'
    bg1.style.transform = 'rotate('+(-worldDeg/2)+'deg)'
    bg2.style.transform = 'rotate('+(-worldDeg/4)+'deg)'

    // Move fire
    fireWrap.style.transform = 'rotate('+(-worldDeg-26)+'deg)'

    // Update pitfals
    burnTest();
    Bird.update();
    updateBlood();

    // Update life;
    life -= 0.05;
    if (player.statusIs('prepare')) life -= 0.2;
    if (life < 0) life = 0;
    if (player.statusIs('stopped') && life === 0) die('hungry');
    updateCarrots();

    // Update Ctrl
    lifePF.style.height = life + '%';
    jumpPF.update();
    if (round(player.x/6) !== distM) {
      distM = round(player.x/6);
      distEl.innerText = `Distance: ${distM}m`
    }

    var pStatus = player.status();
    if ((jumpForce > 0 || player.y > player.radius) && ['jump','landing'].indexOf(pStatus)>-1) {
      player.x += 0.5;
      player.y += jumpForce;
      jumpForce -= 4;
      if (jumpForce < 0 && player.y < player.radius*3) player.status('landing');
      if (player.y <= player.radius) { player.status('stopped'); player.y = player.radius; }
    }
    player.update();
  }, 40);
}

function doJumpPrepare() {
  if (player.statusIs('stopped')) {
    player.status('prepare');
    jumpPrepare = 5;
    jumpPF.update();
  }
}

function doJump() {
  if (player.statusIs('prepare')) {
    playTone(400, jumpPrepare/22);
    playTone(300, jumpPrepare/20);
    player.status('jump');
    jumpForce = jumpPrepare;
    jumpPrepare = 0;
    jumpPF.style.height = 0;
  }
}

d.addEventListener('keydown', function(ev) {
  if (unblockKeys.indexOf(ev.key)==-1) ev.preventDefault();
  if (ev.key==='ArrowUp' || ev.key===' ') doJumpPrepare();
});

d.addEventListener('keyup', function(ev) {
  if (unblockKeys.indexOf(ev.key)==-1) ev.preventDefault();
  if (ev.key==='ArrowUp' || ev.key===' ') doJump();
});

d.addEventListener('touchstart', doJumpPrepare);
d.addEventListener('touchend', doJump);