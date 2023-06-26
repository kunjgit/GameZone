"use strict";

var boids = window.boids = [];
var pingeonCounter = 0;
var boidsCenter;

var logThePingeon = (...args)=> console.log('ThePingeon', ...args);

function mkPingeon(x, y, z, color='#DDD') {
  var me = mk('sphere', { // Body
    position: `${x} ${y} ${z}`,
    'radius': .3,
    color
  });
  me.mk('sphere', { // head
    position: '0 .3 0',
    'radius': .18,
    color
  });
  me.mk('cone', { // Bick
    position: '0 .5 0',
    'radius-bottom': .1,
    'radius-top': 0,
    height: .2,
    color: '#E80'
  });
  me.mk('sphere', { // Left Wing
    position: '-.3 0 0',
    scale:'1 1 .3',
    'radius': .25,
    color
  }).mk('animation', { // Animate Left Wing
    dur:400, repeat:'indefinite', easing:'linear', loop:'true', direction:'alternate',
    attribute:'rotation', from:'0 -30 0', to:'0 30 0'
  });
  me.mk('sphere', { // Right Wing
    position: '.3 0 0',
    scale:'1 1 .3',
    'radius': .25,
    color
  }).mk('animation', { // Animate Right Wing
    dur:400, repeat:'indefinite', easing:'linear', loop:'true', direction:'alternate',
    attribute:'rotation', from:'0 30 0', to:'0 -30 0'
  });
  me.mk('sphere', { // Tail
    position: '0 -.3 0',
    scale:'1 1 .3',
    'radius': .2,
    color
  });
//  me.debug = mk('entity', {
//    position: `${x} ${y} ${z}`,
//    line: `start: 0, 0, 0; end: 2 0 0; color: red`,
//    line__2: `start: 0, 0, 0; end: 0 0 2; color: blue`
//  });
//  me.debug.pos = me.debug.object3D.position;
//  setTimeout(()=> me.debugLineToNear = me.debug.getObject3D('line').geometry.attributes.position, 1 );
//  setTimeout(()=> me.debugLineToMid = me.debug.getObject3D('line__2').geometry.attributes.position, 1 );
  me.id = 'pingeon' + pingeonCounter++;
  boids.push(me);
  me.distTo = {};
  me.vecTo = {};
  me.pos = me.object3D.position;
  me.rotation = me.object3D.rotation;
  me.rotation.order = 'ZYX';
  me.rotation.x = -deg90;
  me.rotation.y = deg45;
  me.scale = 1;
  me.will = me.rotation.clone();
  me.nearest = null;
  me.speedMult = 1;
  return me;
}

(()=>{

var up = new THREE.Vector3(0,1,0);
var boidTicsCheckout = 4;
var maxDistCenter = 8;
var minDist = .5;

window.boidTic = function boidTic(ticCount) {

  if ((ticCount)%boidTicsCheckout == 0) {
    boidsCenter = new THREE.Vector3();
    for (var b1,i1=0; b1=boids[i1]; i1++) {
      // Update distance between boids:
      for (var b2,i2=i1+1; b2=boids[i2]; i2++) {
        var dist = b1.pos.distanceTo(b2.pos);
        b1.distTo[b2.id] = b2.distTo[b1.id] = dist;
        if (!b1.nearest || b1.nearest.distTo[b1.id] > dist) b1.nearest = b2;
        if (!b2.nearest || b2.nearest.distTo[b2.id] > dist) b2.nearest = b1;
        b1.vecTo[b2.id] = b2.pos.clone().sub(b1.pos);
        b2.vecTo[b1.id] = b1.pos.clone().sub(b2.pos);
      }
      boidsCenter.add(b1.pos);
      //boidsCenter.add(alphaPingeon.pos); // Makes the center of mass near to the master.
//      b1.debugLineToNear.array[3] = b1.vecTo[b1.nearest.id].x+.4;
//      b1.debugLineToNear.array[4] = b1.vecTo[b1.nearest.id].y+.4;
//      b1.debugLineToNear.array[5] = b1.vecTo[b1.nearest.id].z;
//      b1.debugLineToNear.needsUpdate = true;
    }
    //xyzDo((k)=> boidsCenter[k] /= boids.length*2);
    xyzDo((k)=> boidsCenter[k] = ( (boidsCenter[k]/boids.length) + alphaPingeon.pos[k]*2) / 3 );
    //boidsCenterEl.object3D.position.copy(boidsCenter);

    for (var b,i=0; b=boids[i]; i++) {
      b.speedMult = ( b.speedMult*9 + 1 ) / 10;
      b.distToCenter = b.pos.distanceTo(boidsCenter);
      b.vecToCenter = boidsCenter.clone().sub(b.pos);
//      b.debugLineToMid.array[3] = b.vecToCenter.x;
//      b.debugLineToMid.array[4] = b.vecToCenter.y;
//      b.debugLineToMid.array[5] = b.vecToCenter.z;
//      b.debugLineToMid.needsUpdate = true;
      // Update boid will:
      if      ( b.pos.x < -550 ) b.will.y = -deg90;
      else if ( b.pos.x > +550 ) b.will.y = +deg90;
      else if ( b.pos.z < -550 ) b.will.y = (b.will.y<0)? -deg180 : deg180;
      else if ( b.pos.z > +550 ) b.will.y = (b.will.y<deg180)? 0 : deg360;
      else if ( b.pos.y < 75 ) { // Stop drop
        b.will.x = -deg90 +.2;
        //logThePingeon('stop drop', b.will.x);
      }
      else if ( b.pos.y > 120 ) { // Stop up
        //logThePingeon('stop up');
        b.will.x = -deg90 -.2;
      }
      else if ( b.nearest.distTo[b.id] < minDist ) { // Too near! Go away.
        var nearestPos = b.nearest.pos;
        if (nearestPos.x > b.pos.x) b.will.y += .05;
        if (nearestPos.x < b.pos.x) b.will.y -= .05;
        if (nearestPos.y > b.pos.y) b.will.x -= .05;
        if (nearestPos.y < b.pos.y) b.will.x += .05;
        //logThePingeon('go away! will: '+ dbgXYZ(b.will));
      }
      else if ( b.distToCenter > maxDistCenter ) { // Too away! Get near.
        var rcY = ((new THREE.Vector2(b.vecToCenter.x, -b.vecToCenter.z)).angle() - deg90) % deg360;
        //logThePingeon(`Angle Y to center ${Math.round(360*rcY/deg360)}deg.`)
        var bwY = b.will.y % deg360;
        //logThePingeon(`Angle Y of will ${Math.round(360*bwY/deg360)}deg.`)
        var deltaY = abs(bwY - rcY) % deg360;
        deltaY = Math.min( deltaY, deg360-deltaY );
        //logThePingeon(`Delta Y to center pos ${Math.round(360*deltaY/deg360)}deg.`)
        if ( deltaY > deg90 && Math.random() < .666 ) {
          //logThePingeon('Slooooooowww Doowwwwwwwnnn');
          b.speedMult = .3
        } else {
          if ( abs(boidsCenter.x - b.pos.x) > abs(boidsCenter.z - b.pos.z) ) {
            if (boidsCenter.x > b.pos.x) b.will.y = -deg90;
            if (boidsCenter.x < b.pos.x) b.will.y = +deg90;
          } else {
            if (boidsCenter.z > b.pos.z) b.will.y = (b.will.y<0)? -deg180 : deg180;
            if (boidsCenter.z < b.pos.z) b.will.y = (b.will.y<deg180)? 0 : deg360;
          }
        }
        if (boidsCenter.y > b.pos.y) b.will.x = (b.will.x + deg45 ) / 2;
        if (boidsCenter.y < b.pos.y) b.will.x = (b.will.x - deg45 ) / 2;
        //logThePingeon('get near! will: '+ dbgXYZ(b.will));
      }
      else if ((ticCount)%(boidTicsCheckout*30) == 0) { // Free move
        //logThePingeon('Free move');
        b.will.y += rnd(-deg90, deg90);
        b.will.x += rnd(-.2, .2)-deg90;
      } else { // align neighbors boids
        //logThePingeon('Align neighbors');
        b.will.copy(b.nearest.will);
      }
      //logThePingeon('will X', b.will.x, (Math.abs(b.will.x) > deg45));
      if (b.will.x > -deg45) b.will.x = -deg45;
      if (b.will.x < -deg90-deg45) b.will.x = -deg90-deg45;
      b.will.y = b.will.y % 360;
      b.will.z *= .05;
    }
  }

  var speed = 7/fps;
  for (var b,i=0; b=boids[i]; i++) {
    if (thePingeonWasCatched && b == thePingeon) {
      if (thePingeon.scale > .12) {
        thePingeon.scale -= .04;
        if (thePingeon.scale < .12) thePingeon.scale = .12;
        let s = thePingeon.scale;
        thePingeon.setAttribute('scale', `${s} ${s} ${s}`);
      }
      xyzDo((k)=> {
        if (abs(b.pos[k] - armEndRealPos[k]) < .5) b.pos[k] = armEndRealPos[k];
        else b.pos[k] = (b.pos[k]*4 + armEndRealPos[k]) / 5;
      });
    } else {
      xyzDo((k)=> b.rotation[k] = (b.rotation[k]*9 + b.will[k]) / 10 );
      var vecVel = (new THREE.Vector3(0,speed*b.speedMult,0)).applyEuler(b.rotation);
      xyzDo((k)=> {
        b.pos[k] += vecVel[k];
        //b.debug.pos[k] = b.pos[k];
      });
    }
  }
}

})();
