"use strict";

(()=>{
var i;
var color = '#C00';
const moveRadius = 500;
var angPos = 0;

// Draw Drago Eye pattern
(()=> {
  var w = cEye.width = 128;
  var h = cEye.height = 32;
  var ctx = cEye.getContext('2d');
  ctx.fillStyle = '#FA0';
  ctx.fillRect(0,0, w,h);
  ctx.fillStyle = '#C60';
  ctx.fillRect(w/2-10,0, 20,h);
  ctx.fillStyle = '#A40';
  for (i=0; i<h; i+=2) {
    ctx.fillRect(w/2-10,i, 20,1);
  }
  ctx.fillStyle = '#000';
  ctx.fillRect(w/2-4,0, 8,h);
  ctx.fillStyle = color;
  ctx.fillRect(w*2/3,0, w/3,h);
})();

var dragoLength = 27;
var bodyNodes = [];

for (i=0; i<dragoLength/3; i++) {
  bodyNodes.push(dragBody.mk('sphere', {
    position:`0 0 -${i*1.2}`, radius:1.4, class:'solid', color
  }));
}
var z = (dragoLength/3)*1.2;
for (i=1; i<=dragoLength*2/3; i++) {
  let r = 1.4 - i*2.8/(dragoLength*1.8);
  bodyNodes.push(dragBody.mk('sphere', {
    position:`0 0 -${z}`, radius:r, class:'solid', id:`dTail${i}`, color
  }));
  z += r-.1;
}

var wingNode = bodyNodes[1];
var lastNode = bodyNodes[dragoLength-1];

lastNode.mk('cone', {
  position: '0 0 .15', rotation: '90 0 0', scale:'1 1 .1',
  'radius-bottom': .6, 'radius-top': 0, height: .9, color
});
lastNode.mk('cone', {
  position: '0 0 -.9', rotation: '-90 0 0', scale:'1 1 .1',
  'radius-bottom': .6, 'radius-top': 0, height: 1.2, color
});

var wingLeft = wingNode.mk('cone', {
  position: '1.7 0 0', rotation: '0 0 90', scale:'.1 1 1',
  'radius-bottom': 2, 'radius-top': 0, height: 2, color
});
wingLeft.mk('cone', {
  position: '0 -1.5 0', rotation: '0 0 180', scale:'1 1 1',
  'radius-bottom': 2, 'radius-top': 0, height: 1, color
});

var wingRight = wingNode.mk('cone', {
  position: '-1.7 0 0', rotation: '0 0 -90', scale:'.1 1 1',
  'radius-bottom': 2, 'radius-top': 0, height: 2, color
});
wingRight.mk('cone', {
  position: '0 -1.5 0', rotation: '0 0 180', scale:'1 1 1',
  'radius-bottom': 2, 'radius-top': 0, height: 1, color
});

const nodeWaveY = (pos, ticCount, m=sin)=> m((ticCount/8-pos)/(dragoLength/20))

window.dragoTic = function (ticCount) {
  // move it:
  // angSpeed = .017/fps =~ 8.5m/s in a 500m radius circle path.
  angPos += .017/fps;
  drago.object3D.position.x = cos(angPos) * moveRadius;
  drago.object3D.position.z = sin(angPos) * moveRadius;
  drago.object3D.rotation.y = -angPos;
  // wave it:
  bodyNodes.forEach((node, i)=> {
    node.object3D.position.y = nodeWaveY(i, ticCount) * .666 //* (dragoLength-i+2)/(dragoLength*2);
  });
  dragoHead.object3D.position.y = nodeWaveY(-1, ticCount) * 1.2;
  dragoHead.object3D.rotation.x = -nodeWaveY(0, ticCount, cos) * .3;
  lastNode.object3D.rotation.x = -nodeWaveY(dragoLength-1, ticCount, cos);
  var wingWave = -nodeWaveY(1, ticCount, cos);
  wingLeft.object3D.rotation.z = deg90 + wingWave*.8;
  wingLeft.object3D.position.y = wingWave*.6;
  wingRight.object3D.rotation.z = -deg90 - wingWave*.8;
  wingRight.object3D.position.y = wingWave*.6;
  if (typeof(camDrago) != 'undefined') {
    camDrago.object3D.position.x = drago.object3D.position.x - 10;
    camDrago.object3D.position.z = drago.object3D.position.z;
  }
}

})();
