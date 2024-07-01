"use strict";

var startTime, started = false;
var maxPlaneY = 200;
var skyColor = '#6AE';
const scene = cam.sceneEl; //document.querySelector('a-scene');
const deg360 = Math.PI*2;
const deg180 = Math.PI;
const deg90 = Math.PI/2;
const deg45 = Math.PI/4;
const oneTurn = deg360;
const halfTurn = deg180;
const quarterTurn = deg90;
var g = {x:1, y:0, z:0};
var fps = 30; // initialization only
var alphaPingeon;
var thePingeon;
var thePingeonWasCatched = false;
var armEndRealPos;

const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;
const round = Math.round;

const dbgXYZ = (obj)=> `x:${round(obj.x*10)/10}, y:${round(obj.y*10)/10}, z:${round(obj.z*10)/10}`

const xyzDo = (func)=> ['x','y','z'].forEach((k)=> func(k));

function rnd(a, b) {
  if (typeof(b) == 'undefined' || b == null) {
    b = a;
    a = 0;
  }
  return (Math.random() * (b-a)) + a;
}

const rRnd = (a, b)=> Math.round(rnd(a, b));

window.mk = function mk(type, attrs, parent) {
  var el = document.createElement('a-'+type);
  for (var att in attrs) el.setAttribute(att, attrs[att]);
  if (parent) parent.appendChild(el);
  else scene.appendChild(el);
  return el;
}
HTMLElement.prototype.mk = function (type, attrs) {
  return mk(type, attrs, this);
}
HTMLElement.prototype.selfRemove = function () {
  this.parentNode.removeChild(this);
}

function roundDec(n,d) {
  var m = 10**d;
  return Math.round(n*m)/m;
}

function debugXYZ(desc, obj, d=3) {
  console.log(desc+` x:${roundDec(obj.x,d)} y:${roundDec(obj.y,d)} z:${roundDec(obj.z,d)}`)
}
