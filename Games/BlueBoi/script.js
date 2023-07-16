var canvas = document.getElementById("game");
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(1, -1);

var world = {
  player: {
    x: 25,
    y: 100,
    velx: 0,
    vely: 0,
    spawnx: 25,
    spawny: 100,
    jumping: true,
    slowed: false
  },
  cam: {
    x: 0,
    y: 0
  },
  sounds: {
    bigBoing: document.getElementById('bigBoing'),
    oops: document.getElementById('oops'),
    spiral: document.getElementById('spiral'),
    connect: document.getElementById('connect')
  },
  background: {
    bg1: ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 1, canvas.width / 2, canvas.height / 2, canvas.width),
    bg2: ctx.createLinearGradient(canvas.width / 2, 0, canvas.width / 2, canvas.height)
  },
  resistance: 80,
  speed: 1.5,
  message: '',
  start: new Date(),
  time: 0,
  keymap: { 37: false, 38: false, 39: false, 40: false },
  platforms: [],
  obstacles: [],
  jumps: [],
  portals: [],
  checkpoints: []
}

{ //background gradient setup
  world.background.bg1.addColorStop(0, "#FFFFFF");
  world.background.bg1.addColorStop(0.25, "#000000");
  world.background.bg1.addColorStop(0.5, "#000000");
  world.background.bg1.addColorStop(0.75, "#000000");
  world.background.bg1.addColorStop(1, "#000000");

  world.background.bg2.addColorStop(0, "#0000FF");
  world.background.bg2.addColorStop(1, "#00FFFF");
}

function rgb(r, g, b) { //r,g,b to rgb string
  return `rgb(${r}, ${g}, ${b})`;
}

function line(x1, y1, x2, y2, color = '#000000', add = true) { //line platform
  if (add) {
    world.platforms.push([x1, y1, x2, y2, (world.platforms.length + 1)]);
  };
  ctx.beginPath();
  ctx.moveTo(x1 - world.cam.x, y1 - world.cam.y);
  ctx.lineTo(x2 - world.cam.x, y2 - world.cam.y);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function rectangle(x, y, width, height, color = '#000000', color2 = color, player = false, round = true) { //decorative rectangle
  ctx.fillStyle = color;
  ctx.fillRect(x - world.cam.x, (y - world.cam.y) - height, width, height);
  if (player) {
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7.5;
    ctx.strokeRect(x - world.cam.x, (y - world.cam.y) - height, width, height);
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = color2;
    ctx.strokeRect(x - world.cam.x, (y - world.cam.y) - height, width, height);
  }
}

function obstacle(x1, y1, x2, y2) { //obstacle that resets when touched
  world.obstacles.push([x1, y1, x2, y2]);
  ctx.beginPath();
  ctx.moveTo(x1 - world.cam.x, y1 - world.cam.y);
  ctx.lineTo(x2 - world.cam.x, y2 - world.cam.y);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#FF0000';
  ctx.lineCap = 'round';
  ctx.stroke();
}

function jump(x1, y1, x2, y2, invisible = false) { //jumps when touched
  world.jumps.push([x1, y1, x2, y2]);
  if (!invisible) {  
    ctx.beginPath();
    ctx.moveTo(x1 - world.cam.x, y1 - world.cam.y);
    ctx.lineTo(x2 - world.cam.x, y2 - world.cam.y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFFF00';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

function portal(xa, ya, xb, yb, color = '#000F7F', size = 16) {
  world.portals.push([xa, ya, xb, yb]);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(xa - world.cam.x, ya - world.cam.y, size, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(xb - world.cam.x, yb - world.cam.y, size, 0, Math.PI * 2, true);
  ctx.fill();
}

function checkpoint(x, y, size = 10, color = '#00FFAF') {
  world.checkpoints.push([x, y, world.checkpoints.length + 1]);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - world.cam.x, y - world.cam.y, size, 0, Math.PI * 2, true);
  ctx.fill();
}

function playerdraw(x, y, size, fill = false) { //draws player
  if (!fill) {
    line(x + size, y + size, x + size, y - size, color = '#00FFFF', add = false);
    line(x - size, y - size, x + size, y - size, color = '#00FFFF', add = false);
    line(x - size, y + size, x - size, y - size, color = '#00FFFF', add = false);
    line(x - size, y + size, x + size, y + size, color = '#00FFFF', add = false);
  } else if (fill) {
    rectangle(x - size, y + size, size * 2, size * 2, color = "#00FFFF", color2 = '#40FFFF', player = true);
  }
}

onkeydown = onkeyup = function (e) { //keeps track of the keys
  e = e || event; // to deal with IE
  world.keymap[e.keyCode] = e.type == 'keydown';
}

function adjustX() { //shifts world.player.x away from line
  if (touching()) {
    while (touching()) {
      world.player.x += (0 - (world.player.velx / Math.abs(world.player.velx)));
    }
    //world.player.velx = 0;
  }
}

function adjustY() { //shifts world.player.y away from line
  if (touching()) {
    while (touching()) {
      world.player.y += (0 - (world.player.vely / Math.abs(world.player.vely)));
    }
    if (world.player.vely < 0) {
      world.player.jumping = 0;
    }
    world.player.vely = 0;
  }
}

function touching() { //checks if touching
  let ret = false;
  for (lin of world.platforms) {
    if ((world.player.x - 16) < lin[2]) {
      if ((world.player.x + 16) > lin[0]) {
        if ((world.player.y - 16) < lin[3]) {
          if ((world.player.y + 16) > lin[1]) {
            ret = true;
          }
        }
      }
    }
  }
  return (ret);
}

function touchingObstacle() {
  let ret = false;
  for (lin of world.obstacles) {
    if ((world.player.x - 12) < lin[2]) {
      if ((world.player.x + 12) > lin[0]) {
        if ((world.player.y - 12) < lin[3]) {
          if ((world.player.y + 12) > lin[1]) {
            ret = true;
          }
        }
      }
    }
  }
  return (ret);
}

function touchingPortal() {
  let ret = false;
  let coor;

  for (port of world.portals) {
    if ((world.player.x - 20) < port[0]) {
      if ((world.player.x + 20) > port[0]) {
        if ((world.player.y - 20) < port[1]) {
          if ((world.player.y + 20) > port[1]) {
            ret = true;
            coor = [port[2], port[3]]
          }
        }
      }
    }
  }
  return ([ret, coor]);
}

function touchingJump() {
  let ret = false;
  for (lin of world.jumps) {
    if ((world.player.x - 16) < lin[2]) {
      if ((world.player.x + 16) > lin[0]) {
        if ((world.player.y - 16) < lin[3]) {
          if ((world.player.y + 16) > lin[1]) {
            ret = true;
          }
        }
      }
    }
  }
  return (ret);
}

function touchingCheckpoint() {
  let ret = false;
  let coor;
  let id;
  for (lin of world.checkpoints) {
    if ((world.player.x - 20) < lin[0]) {
      if ((world.player.x + 20) > lin[0]) {
        if ((world.player.y - 20) < lin[1]) {
          if ((world.player.y + 20) > lin[1]) {
            ret = true;
            coor = [lin[0], lin[1]]
            id = lin[2]
          }
        }
      }
    }
  }
  return ([ret, coor, id]);
}

function render() {
  obstacle(0, -40, 0, 40);
  obstacle(0, -40, 190, -40);
  obstacle(40, 40, 40, 0);
  line(0, 40, 40, 40);
  obstacle(40, 0, 150, 0);
  obstacle(150, 0, 150, 60);
  obstacle(190, -40, 190, 60);
  line(150, 60, 190, 60);
  jump(250, 75, 300, 75);
  jump(350, 150, 400, 150);
  line(500, 200, 1000, 200);
  line(1000, 200, 2000, 200);
  line(600, 200, 600, 650);
  jump(575, 225, 575, 625);
  line(550, 650, 750, 650);

  obstacle(600, 205, 950, 205);
  checkpoint(1275, 215);
  for (let i = 0; i < 5; i++) {
    obstacle(1350 + i * 100, 225 + (Math.sin(world.time * 2) * 25), 1350 + i * 100, 275 + (Math.sin(world.time * 2) * 25));
    obstacle(1400 + i * 100, 225 + (Math.cos(world.time * 2) * 25), 1400 + i * 100, 275 + (Math.cos(world.time * 2) * 25));
  }
  obstacle(1350, 300, 1800, 300)
}

function main() {
  world.time = (new Date() - world.start)/1000;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = world.background.bg2;
  ctx.fill();

  world.message = `Time: ${Math.round(world.time * 100) / 100}`;
  ctx.lineWidth = 2;
  ctx.strokeStyle = rgb(0, 255, 100);
  ctx.font = '30px Verdana';
  ctx.strokeText(world.message, 20, 30)
  ctx.strokeText(`(${Math.round(world.player.x)}, ${Math.round(world.player.y)})`, 20, 70)

  ctx.restore();

  if (world.player.y < -300 || touchingObstacle()) {
    world.sounds.oops.play();
    world.player.velx = 0;
    world.player.vely = 0;
    world.player.x = world.player.spawnx;
    world.player.y = world.player.spawny;
  }

  if (touchingPortal()[0]) {
    world.sounds.spiral.play();
    world.player.velx = 0;
    world.player.vely = 0;
    world.player.x = touchingPortal()[1][0];
    world.player.y = touchingPortal()[1][1];
  }

  if (touchingCheckpoint()[0]) {
    world.sounds.connect.play();
    world.player.spawnx = touchingCheckpoint()[1][0];
    world.player.spawny = touchingCheckpoint()[1][1];
    if (localStorage.getItem(touchingCheckpoint()[2].toString() !== null)) {
      if (parseInt(localStorage.getItem(touchingCheckpoint()[2].toString())) > world.time) {
        localStorage.setItem(touchingCheckpoint()[2].toString(), world.time.toString());
      }
    } else {
      localStorage.setItem(touchingCheckpoint()[2].toString(), world.time.toString());
    }
  }

  if (world.keymap[40]) {
    world.player.vely -= 2;
  } else {
    world.player.vely -= 1;
  }

  if (world.keymap[38] && !world.player.jumping && world.player.vely > -2) {
    world.player.vely = world.speed * 8.666666666667;
    world.player.jumping = true;
  }
  if (touchingJump() && !world.keymap[40]) {
    world.sounds.bigBoing.play();
    world.player.vely = 22;
    world.player.jumping = true;
  } else if (touchingJump() && world.keymap[40] && !world.player.slowed) {
    world.player.slowed = true;
    world.speed = world.speed * 0.5333333333333
  } else if (world.player.slowed && !touchingJump()) {
    world.player.slowed = false;
    world.speed = world.speed * 1.875
  }
  world.player.y += world.player.vely;
  adjustY();

  world.player.velx += (world.keymap[39] - world.keymap[37]) * world.speed;
  world.player.velx = world.player.velx * (world.resistance / 100);
  world.player.x += world.player.velx;
  adjustX();

  world.platforms = [];
  world.obstacles = [];
  world.jumps = [];
  world.portals = [];

  world.cam.x = Math.floor(world.player.x);
  world.cam.y = world.player.y + 150;

  render();
  playerdraw(Math.floor(world.player.x), world.player.y, 9, true);
}

setInterval(main, 32)