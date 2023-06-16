(()=>{

"use strict";

var keyPressed = {};
var x,y,z,i;

window.start = function (counter=10) {
  intro.style.display = 'none';
  info.setAttribute('position', '2.4 0 -.5');
  info.setAttribute('width', 5);
  info.setAttribute('value', counter);
  if (counter == 0) realStart();
  else setTimeout(()=> start(--counter), 1000);
};
function realStart() {
  started = true;
  startTime = Date.now();
  info.setAttribute('position', '.8 0 -.5');
  info.setAttribute('width', 2);
  info.setAttribute('value', '');
}

// Draw Sky pattern
//(()=> {
//  var w = cSky.width = 2000;
//  var h = cSky.height = 1000;
//  var ctx = cSky.getContext('2d');
//  ctx.fillStyle = '#000';
//  ctx.fillRect(0,0, w,h);
//  var rv = 1; // vertical radius;
//  ctx.fillStyle='#fff';
//  for (var y=rv*3; y<(h-rv*3); y+=rv*2) {
//    ctx.beginPath();
//    var vStep = Math.abs(y-(h/2))/(h/2);
//    var rh = rv+w*(.001*Math.asin(vStep)**10); // horizontal radius;
//    for (var x=rh*2; x<(w-rh*2); x+=rh*2) {
//      if (Math.random()<.01) {
//        let incR = Math.random()+.5;
//        ctx.ellipse(x,y, rh*incR,rv*incR, 0, 0,2*Math.PI);
//      }
//    }
//    ctx.fill();
//  }
//})();

// Draw Ground pattern
(()=> {
  var w = cGround.width = 128;
  var h = cGround.height = 128;
  var ctx = cGround.getContext('2d');
  ctx.fillStyle = '#170';
  ctx.fillRect(0,0, w,h);
  ctx.fillStyle = '#280';
  ctx.fillRect(0,0, w/2,h/2);
  ctx.fillRect(w/2,h/2, w,h);
//  for (x=0; x<w; x+=2) for (y=0; y<h; y+=2)
//    if (Math.random()<.5) ctx.fillRect(x,y, 2,2);
})();

// Draw Clouds pattern
(()=> {
  var w = cCloud.width = 64;
  var h = cCloud.height = 64;
  var ctx = cCloud.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(0,0, w,h);
  ctx.fillStyle = '#FFF';
  ctx.fillRect(0,0, w/2,h/2);
  ctx.fillRect(w/2,h/2, w,h);
})();

// Draw Tree pattern
(()=> {
  var w = cTree.width = 8;
  var h = cTree.height = 32;
  var ctx = cTree.getContext('2d');
  ctx.fillStyle = '#280';
  ctx.fillRect(0,0, w,h);
  ctx.fillStyle = '#170';
  ctx.fillRect(0,h/2, w,h);
})();

// Draw Mountain pattern
(()=> {
  var w = cMountain.width = 8;
  var h = cMountain.height = 128;
  var ctx = cMountain.getContext('2d');
  ctx.fillStyle = '#280';
  ctx.fillRect(0,0, w,h);
  ctx.fillStyle = '#170';
  ctx.fillRect(0,h/2, w,h);
})();

// Create Pingeons
for (i=0; i<30; i++) mkPingeon(rnd(10)+200, rnd(95,105), rnd(10)+500);
thePingeon = alphaPingeon = mkPingeon(205, 100, 500, '#D00');
thePingeon.id = 'thePingeon';
//window.boidsCenterEl = mk('sphere', {radius:.3, color:'blue'});

// Clouds
var clouds = [];
for (i=0; i<8; i++) {
  var cloud = mk('plane', {
    position: `${rnd(-1500,1500)} ${maxPlaneY + rnd(-60,30)} ${rnd(-1200,1200)}`,
    width: rnd(400,600),
    height: rnd(400,600),
    rotation: '-90 0 0',
    color: '#FFF',
    opacity: 0.5,
    material: 'side: double',
    src:'#cCloud',
    repeat:'15 15'
  });
  cloud.pos = cloud.object3D.position;
  cloud.w = parseInt(cloud.getAttribute('width'));
  cloud.speed = rnd(5,8);
  clouds.push(cloud);
}

var mkMountain = (x,z,r,h)=> {
  var red = rRnd(0,4).toString(16);
  var green = rRnd(7,10).toString(16);
  var color = `#${red}${green}0`;
  mk('sphere', {class:'solid', position:`${x} ${h} ${z}`, radius:r,
    src:'#cMountain', repeat:'1 12', color
  });
  if (h>0) mk('cylinder', {
    class:'solid', position:`${x} ${h-maxPlaneY} ${z}`, radius:r, height:maxPlaneY*2,
    src:'#cMountain', repeat:'1 12', color
  });
}

// Border Mountains
var totMountains = 33;
var inc = oneTurn/totMountains;
for (i=0; i<oneTurn; i+=inc) {
  x = sin(i)*1200;
  z = cos(i)*1200;
  mkMountain(x, z, rnd(110,140), rnd(maxPlaneY, maxPlaneY*2));
}
for (i=0; i<oneTurn; i+=inc) {
  x = sin(i+inc/2)*1000;
  z = cos(i+inc/2)*1000;
  mkMountain(x, z, rnd(100,150), rnd(-100, maxPlaneY*.8));
}

var forrest = [];
function mkTree(x, z, h, delay=200) {
  var tree = mk('cone', {
    position:`${x} ${-h/2} ${z}`,
    'radius-bottom':10, 'radius-top':0, height:h,
    src:'#cTree', repeat:'1 5', color
  });
  tree.mk('animation', { // Animate Right Wing
    dur:delay, easing:'linear',
    attribute:'position', from:`${x} ${-h/2} ${z}`, to:`${x} ${h/2} ${z}`
  });
  tree.x = x;
  tree.z = z;
  tree.h = h;
  forrest.push(tree);
  return tree;
}
function removeTree(tree) {
  if (!tree) return;
  var yRotate = rnd(360);
  tree.mk('animation', { // Animate Right Wing
    dur:1000, easing:'linear',
    attribute:'rotation', from:`0 ${yRotate} 0`, to:`0 ${yRotate} 90`
  });
  tree.mk('animation', { // Animate Right Wing
    dur:1000, easing:'linear',
    attribute:'position', from:`${tree.x} ${tree.h/2} ${tree.z}`, to:`${tree.x} 5 ${tree.z}`
  });
  setTimeout(()=> tree.mk('animation', { // Animate Right Wing
    dur:1500, easing:'linear',
    attribute:'position', from:`${tree.x} 5 ${tree.z}`, to:`${tree.x} -7 ${tree.z}`
  }), 1500);
  setTimeout(()=> tree.selfRemove(), 3000);
}

var rForrest = 850;
for (x=-rForrest; x<rForrest; x+=20) for (z=-rForrest; z<rForrest; z+=20) {
  if (Math.random() < .02 && (x**2 + z**2) < rForrest**2) {
    var red = rRnd(0,1).toString(16);
    var green = rRnd(6,8).toString(16);
    var blue = rRnd(0,2).toString(16);
    var color = `#${red}${green}${blue}`;
    var h = rnd(35, 50);
    mkTree(x, z, h);
  }
}
// Rand initial forrest Array:
forrest = forrest.sort((a,b)=>rnd(-1,1));
// controll forrest size by the FPS:
setInterval(()=> {
  if (fps < 22 && forrest.length > 80) {
    removeTree(forrest.shift());
  }
  if (fps > 25 && forrest.length < 700) {
    var x = rForrest*2, y = rForrest*2;
    while ((x**2 + z**2) > rForrest**2) {
      x = rnd(-rForrest, rForrest);
      z = rnd(-rForrest, rForrest);
    }
    mkTree(x, z, rnd(35, 50), 10000);
  }
}, 500);

window.addEventListener("devicemotion", (ev)=>{
  var ag = event.accelerationIncludingGravity;
  window.g = { x:ag.x, y:ag.y, z:ag.z }
}, true);

var lastTime = Date.now(), ticCount = 0, ticsCheckout = 10;
setInterval(function(){
  ticCount++;
  if (ticCount%ticsCheckout == 0) {
    var frameDalay = (Date.now() - lastTime) / ticsCheckout;
    lastTime = Date.now();
    fps = 1000/frameDalay;
    if (ticCount%(ticsCheckout*Math.round(fps/2)) == 0) console.log('FPS', Math.round(fps*10)/10);
  }
  if (g.x < 10) g.x += .2
  if (keyPressed.ARROWLEFT)  g.y -= .2, g.x /= 1.2;
  if (keyPressed.ARROWRIGHT) g.y += .2, g.x /= 1.2;
  if (keyPressed.ARROWUP)    g.z += .3, g.x /= 1.2;
  if (keyPressed.ARROWDOWN)  g.z -= .3, g.x /= 1.2;
  if (abs(g.y) > 0) g.y -= g.y/100;
  if (abs(g.z) > 0) g.z -= g.z/100;
  planeTic(ticCount);
  boidTic(ticCount);
  dragoTic(ticCount);
  balloonTic(ticCount);
  // Clouds Tic:
  clouds.forEach((cloud)=> {
    cloud.pos.x += cloud.speed / fps;
    if (cloud.pos.x > 1200+cloud.w) {
      cloud.pos.x = -1200-cloud.w;
      cloud.pos.z = rnd(-1200, 1200);
    }
  });
  //debugG();
} ,30);

if (typeof(camDebug) != 'undefined') {
  var camDbgPos = camDebug.object3D.position;
  setInterval(()=> {
    xyzDo((k)=>
      camDbgPos[k] = (camDbgPos[k]*4 + thePingeon.object3D.position[k])/5
    );
    camDbgPos.y = thePingeon.object3D.position.y + 40;
  }, 30);
}

function limitRotationVal(rotation) {
  if (-oneTurn > rotation.z || rotation.z > oneTurn) rotation.z %= oneTurn;
}

document.addEventListener('keydown', (ev)=> { keyPressed[ev.key.toUpperCase()]=true; ev.stopPropagation() });
document.addEventListener('keyup', (ev)=> { keyPressed[ev.key.toUpperCase()]=false; ev.stopPropagation() });

window.updateSolidList();

})();
