//THREEJS RELATED VARIABLES 

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  gobalLight, shadowLight, backLight,
  renderer,
  container,
  controls, 
  clock;
var delta = 0;
var floorRadius = 200;
var speed = 6;
var distance = 0;
var level = 1;
var levelInterval;
var levelUpdateFreq = 3000;
var initSpeed = 5;
var maxSpeed = 48;
var monsterPos = .65;
var monsterPosTarget = .65;
var floorRotation = 0;
var collisionObstacle = 10;
var collisionBonus = 20;
var gameStatus = "play";
var cameraPosGame = 160;
var cameraPosGameOver = 260;
var monsterAcceleration = 0.004;
var malusClearColor = 0xb44b39;
var malusClearAlpha = 0;
var audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3');

var fieldGameOver, fieldDistance;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };

//3D OBJECTS VARIABLES

var hero;


// Materials
var blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    shading:THREE.FlatShading,
  });
  
var brownMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess:0,
    shading:THREE.FlatShading,
  });

var greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess:0,
    shading:THREE.FlatShading,
  });
  
  var pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess:0,
    shading:THREE.FlatShading,
  });
  
  var lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
    shading:THREE.FlatShading,
  });
  
  var whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789, 
    shading:THREE.FlatShading,
  });
  var skinMat = new THREE.MeshPhongMaterial({
    color: 0xff9ea5,
    shading:THREE.FlatShading
  });


// OTHER VARIABLES

var PI = Math.PI;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  
  scene.fog = new THREE.Fog(0xd6eae6, 160,350);
  
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.z = cameraPosGame;
  camera.position.y = 30;
  camera.lookAt(new THREE.Vector3(0, 30, 0));

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio); 
  renderer.setClearColor( malusClearColor, malusClearAlpha);
  
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousedown', handleMouseDown, false);
  document.addEventListener("touchend", handleMouseDown, false);

  /*
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.minPolarAngle = -Math.PI / 2; 
  //controls.maxPolarAngle = Math.PI / 2;
  //controls.noZoom = true;
  controls.noPan = true;
  //*/
  
  clock = new THREE.Clock();

}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


function handleMouseDown(event){
  if (gameStatus == "play") hero.jump();
  else if (gameStatus == "readyToReplay"){
    replay();
  }
}

function createLights() {
  globalLight = new THREE.AmbientLight(0xffffff, .9);

  shadowLight = new THREE.DirectionalLight(0xffffff, 1);
  shadowLight.position.set(-30, 40, 20);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 2000;
  shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;

  scene.add(globalLight);
  scene.add(shadowLight);
  
}

function createFloor() {
  
  floorShadow = new THREE.Mesh(new THREE.SphereGeometry(floorRadius, 50, 50), new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    specular:0x000000,
    shininess:1,
    transparent:true,
    opacity:.5
  }));
  //floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.receiveShadow = true;
  
  floorGrass = new THREE.Mesh(new THREE.SphereGeometry(floorRadius-.5, 50, 50), new THREE.MeshBasicMaterial({
    color: 0x7abf8e
  }));
  //floor.rotation.x = -Math.PI / 2;
  floorGrass.receiveShadow = false;
  
  floor = new THREE.Group();
  floor.position.y = -floorRadius;
  
  floor.add(floorShadow);
  floor.add(floorGrass);
  scene.add(floor);
  
}

Hero = function() {
  this.status = "running";
  this.runningCycle = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.mesh.add(this.body);
  
  var torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);
  
  this.torso = new THREE.Mesh(torsoGeom, brownMat);
  this.torso.position.z = 0;
  this.torso.position.y = 7;
  this.torso.castShadow = true;
  this.body.add(this.torso);
  
  var pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
  this.pants = new THREE.Mesh(pantsGeom, whiteMat);
  this.pants.position.z = -3;
  this.pants.position.y = 0;
  this.pants.castShadow = true;
  this.torso.add(this.pants);
  
  var tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
  tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-2));
  this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
  this.tail.position.z = -4;
  this.tail.position.y = 5;
  this.tail.castShadow = true;
  this.torso.add(this.tail);
  
  this.torso.rotation.x = -Math.PI/8;
  
  var headGeom = new THREE.CubeGeometry(10, 10, 13, 1);
  
  headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7.5));
  this.head = new THREE.Mesh(headGeom, brownMat);
  this.head.position.z = 2;
  this.head.position.y = 11;
  this.head.castShadow = true;
  this.body.add(this.head);
  
  var cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
  this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
  this.cheekR.position.x = -5;
  this.cheekR.position.z = 7;
  this.cheekR.position.y = -2.5;
  this.cheekR.castShadow = true;
  this.head.add(this.cheekR);
  
  this.cheekL = this.cheekR.clone();
  this.cheekL.position.x = - this.cheekR.position.x;
  this.head.add(this.cheekL);
  
  
  var noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
  this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
  this.nose.position.z = 13.5;
  this.nose.position.y = 2.6;
  this.nose.castShadow = true;
  this.head.add(this.nose);
  
  var mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
  mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,3));
  mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/12));
  this.mouth = new THREE.Mesh(mouthGeom, brownMat);
  this.mouth.position.z = 8;
  this.mouth.position.y = -4;
  this.mouth.castShadow = true;
  this.head.add(this.mouth);
  
  
  var pawFGeom = new THREE.CubeGeometry(3,3,3, 1);
  this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
  this.pawFR.position.x = -2;
  this.pawFR.position.z = 6;
  this.pawFR.position.y = 1.5;
  this.pawFR.castShadow = true;
  this.body.add(this.pawFR);
  
  this.pawFL = this.pawFR.clone();
  this.pawFL.position.x = - this.pawFR.position.x;
  this.pawFL.castShadow = true;
  this.body.add(this.pawFL);
  
  var pawBGeom = new THREE.CubeGeometry(3,3,6, 1);
  this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
  this.pawBL.position.y = 1.5;
  this.pawBL.position.z = 0;
  this.pawBL.position.x = 5;
  this.pawBL.castShadow = true;
  this.body.add(this.pawBL);
  
  this.pawBR = this.pawBL.clone();
  this.pawBR.position.x = - this.pawBL.position.x;
  this.pawBR.castShadow = true;
  this.body.add(this.pawBR);
  
  var earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
  earGeom.vertices[6].x+=2;
  earGeom.vertices[6].z+=.5;
  
  earGeom.vertices[7].x+=2;
  earGeom.vertices[7].z-=.5;
  
  earGeom.vertices[2].x-=2;
  earGeom.vertices[2].z-=.5;
  
  earGeom.vertices[3].x-=2;
  earGeom.vertices[3].z+=.5;
  earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,9,0));
  
  this.earL = new THREE.Mesh(earGeom, brownMat);
  this.earL.position.x = 2;
  this.earL.position.z = 2.5;
  this.earL.position.y = 5;
  this.earL.rotation.z = -Math.PI/12;
  this.earL.castShadow = true;
  this.head.add(this.earL);
  
  this.earR = this.earL.clone();
  this.earR.position.x = -this.earL.position.x;
  this.earR.rotation.z = -this.earL.rotation.z;
  this.earR.castShadow = true;
  this.head.add(this.earR);
  
  var eyeGeom = new THREE.CubeGeometry(2,4,4);
  
  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 5;
  this.eyeL.position.z = 5.5;
  this.eyeL.position.y = 2.9;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);
  
  var irisGeom = new THREE.CubeGeometry(.6,2,2);
  
  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = 1.2;
  this.iris.position.y = 1;
  this.iris.position.z = 1;
  this.eyeL.add(this.iris);
  
  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;
  
  
  this.eyeR.position.x = -this.eyeL.position.x;
  this.head.add(this.eyeR);

  this.body.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

BonusParticles = function(){
  this.mesh = new THREE.Group();
  var bigParticleGeom = new THREE.CubeGeometry(10,10,10,1);
  var smallParticleGeom = new THREE.CubeGeometry(5,5,5,1);
  this.parts = [];
  for (var i=0; i<10; i++){
    var partPink = new THREE.Mesh(bigParticleGeom, pinkMat);
    var partGreen = new THREE.Mesh(smallParticleGeom, greenMat);
    partGreen.scale.set(.5,.5,.5);
    this.parts.push(partPink);
    this.parts.push(partGreen);
    this.mesh.add(partPink);
    this.mesh.add(partGreen);
  }
}

BonusParticles.prototype.explose = function(){
  var _this = this;
  var explosionSpeed = .5;
  for(var i=0; i<this.parts.length; i++){
    var tx = -50 + Math.random()*100;
    var ty = -50 + Math.random()*100;
    var tz = -50 + Math.random()*100;
    var p = this.parts[i];
    p.position.set(0,0,0);
    p.scale.set(1,1,1);
    p.visible = true;
    var s = explosionSpeed + Math.random()*.5;
    TweenMax.to(p.position, s,{x:tx, y:ty, z:tz, ease:Power4.easeOut});
    TweenMax.to(p.scale, s,{x:.01, y:.01, z:.01, ease:Power4.easeOut, onComplete:removeParticle, onCompleteParams:[p]});
  }
}

function removeParticle(p){
  p.visible = false;
}

Hero.prototype.run = function(){
  this.status = "running";
  
  var s = Math.min(speed,maxSpeed);
  
  this.runningCycle += delta * s * .7;
  this.runningCycle = this.runningCycle % (Math.PI*2);
  var t = this.runningCycle;
  
  var amp = 4;
  var disp = .2;
  
  // BODY
  
  this.body.position.y = 6+ Math.sin(t - Math.PI/2)*amp;
  this.body.rotation.x = .2 + Math.sin(t - Math.PI/2)*amp*.1;
  
  this.torso.rotation.x =  Math.sin(t - Math.PI/2)*amp*.1;
  this.torso.position.y =  7 + Math.sin(t - Math.PI/2)*amp*.5;
  
  // MOUTH
  this.mouth.rotation.x = Math.PI/16 + Math.cos(t)*amp*.05;
  
  // HEAD
  this.head.position.z = 2 + Math.sin(t - Math.PI/2)*amp*.5;
  this.head.position.y = 8 + Math.cos(t - Math.PI/2)*amp*.7;
  this.head.rotation.x = -.2 + Math.sin(t + Math.PI)*amp*.1;
  
  // EARS
  this.earL.rotation.x = Math.cos(-Math.PI/2 + t)*(amp*.2);
  this.earR.rotation.x = Math.cos(-Math.PI/2 + .2 + t)*(amp*.3);
  
  // EYES
  this.eyeR.scale.y = this.eyeL.scale.y = .7 +  Math.abs(Math.cos(-Math.PI/4 + t*.5))*.6;
  
  // TAIL
  this.tail.rotation.x = Math.cos(Math.PI/2 + t)*amp*.3;
  
  // FRONT RIGHT PAW
  this.pawFR.position.y = 1.5 + Math.sin(t)*amp;
  this.pawFR.rotation.x = Math.cos(t ) * Math.PI/4;
  
  
  this.pawFR.position.z = 6 - Math.cos(t)*amp*2;
  
  // FRONT LEFT PAW
  
  this.pawFL.position.y = 1.5 + Math.sin(disp + t)*amp;
  this.pawFL.rotation.x = Math.cos( t ) * Math.PI/4;
  
  
  this.pawFL.position.z = 6 - Math.cos(disp+t)*amp*2;
  
  // BACK RIGHT PAW
  this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t)*amp;
  this.pawBR.rotation.x = Math.cos(t + Math.PI*1.5) * Math.PI/3;
  
  
  this.pawBR.position.z = - Math.cos(Math.PI + t)*amp;
  
  // BACK LEFT PAW
  this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t)*amp;
  this.pawBL.rotation.x = Math.cos(t + Math.PI *1.5) * Math.PI/3;
  
  
  this.pawBL.position.z = - Math.cos(Math.PI + t)*amp;
  
  
}

Hero.prototype.jump = function(){
  if (this.status == "jumping") return;
  this.status = "jumping";
  var _this = this;
  var totalSpeed = 10 / speed;
  var jumpHeight = 45;
  
  TweenMax.to(this.earL.rotation, totalSpeed, {x:"+=.3", ease:Back.easeOut});
  TweenMax.to(this.earR.rotation, totalSpeed, {x:"-=.3", ease:Back.easeOut});
  
  TweenMax.to(this.pawFL.rotation, totalSpeed, {x:"+=.7", ease:Back.easeOut});
  TweenMax.to(this.pawFR.rotation, totalSpeed, {x:"-=.7", ease:Back.easeOut});
  TweenMax.to(this.pawBL.rotation, totalSpeed, {x:"+=.7", ease:Back.easeOut});
  TweenMax.to(this.pawBR.rotation, totalSpeed, {x:"-=.7", ease:Back.easeOut});
  
  TweenMax.to(this.tail.rotation, totalSpeed, {x:"+=1", ease:Back.easeOut});
  
  TweenMax.to(this.mouth.rotation, totalSpeed, {x:.5, ease:Back.easeOut});
  
  TweenMax.to(this.mesh.position, totalSpeed/2, {y:jumpHeight, ease:Power2.easeOut});
  TweenMax.to(this.mesh.position, totalSpeed/2, {y:0, ease:Power4.easeIn, delay:totalSpeed/2, onComplete: function(){
    //t = 0;
    _this.status="running";
  }});
  
}


Monster = function(){
  
  this.runningCycle = 0;
  
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  
  var torsoGeom = new THREE.CubeGeometry(15,15,20, 1);
  this.torso = new THREE.Mesh(torsoGeom, blackMat);
  
  var headGeom = new THREE.CubeGeometry(20,20,40, 1);
  headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,20));
  this.head = new THREE.Mesh(headGeom, blackMat);
  this.head.position.z = 12;
  this.head.position.y = 2;
  
  var mouthGeom = new THREE.CubeGeometry(10,4,20, 1);
  mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2,10));
  this.mouth = new THREE.Mesh(mouthGeom, blackMat);
  this.mouth.position.y = -8;
  this.mouth.rotation.x = .4;
  this.mouth.position.z = 4;
  
  this.heroHolder = new THREE.Group();
  this.heroHolder.position.z = 20;
  this.mouth.add(this.heroHolder);
  
  var toothGeom = new THREE.CubeGeometry(2,2,1,1);
  
  toothGeom.vertices[1].x-=1;
  toothGeom.vertices[4].x+=1;
  toothGeom.vertices[5].x+=1;
  toothGeom.vertices[0].x-=1;
  
  for(var i=0; i<3; i++){
    var toothf = new THREE.Mesh(toothGeom, whiteMat);
    toothf.position.x = -2.8 + i*2.5;
    toothf.position.y = 1;
    toothf.position.z = 19;
    
    var toothl = new THREE.Mesh(toothGeom, whiteMat);
    toothl.rotation.y = Math.PI/2;
    toothl.position.z = 12 + i*2.5;
    toothl.position.y = 1;
    toothl.position.x = 4;
    
    var toothr = toothl.clone();
    toothl.position.x = -4;
    
    this.mouth.add(toothf);
    this.mouth.add(toothl);
    this.mouth.add(toothr);
  }
  
  var tongueGeometry = new THREE.CubeGeometry(6,1,14);
  tongueGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7));
  
  this.tongue = new THREE.Mesh(tongueGeometry, pinkMat);
  this.tongue.position.z = 2;
  this.tongue.rotation.x = -.2;
  this.mouth.add(this.tongue);
  
  var noseGeom = new THREE.CubeGeometry(4,4,4, 1);
  this.nose = new THREE.Mesh(noseGeom, pinkMat);
  this.nose.position.z = 39.5;
  this.nose.position.y = 9;
  this.head.add(this.nose);
  
  this.head.add(this.mouth);
  
  var eyeGeom = new THREE.CubeGeometry(2,3,3);
  
  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 10;
  this.eyeL.position.z = 5;
  this.eyeL.position.y = 5;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);
  
  var irisGeom = new THREE.CubeGeometry(.6,1,1);
  
  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = 1.2;
  this.iris.position.y = -1;
  this.iris.position.z = 1;
  this.eyeL.add(this.iris);
  
  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;
  this.eyeR.position.x = -this.eyeL.position.x;
  this.head.add(this.eyeR);
  
  
  var earGeom = new THREE.CubeGeometry(8, 6, 2, 1);
  earGeom.vertices[1].x-=4;
  earGeom.vertices[4].x+=4;
  earGeom.vertices[5].x+=4;
  earGeom.vertices[5].z-=2;
  earGeom.vertices[0].x-=4;
  earGeom.vertices[0].z-=2;

 
  earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,3,0));
  
  this.earL = new THREE.Mesh(earGeom, blackMat);
  this.earL.position.x = 6;
  this.earL.position.z = 1;
  this.earL.position.y = 10;
  this.earL.castShadow = true;
  this.head.add(this.earL);
  
  this.earR = this.earL.clone();
  this.earR.position.x = -this.earL.position.x;
  this.earR.rotation.z = -this.earL.rotation.z;
  this.head.add(this.earR);
  
  var eyeGeom = new THREE.CubeGeometry(2,4,4);
  
  var tailGeom = new THREE.CylinderGeometry(5,2, 20, 4, 1);
  tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));
  tailGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  tailGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));
  
  this.tail = new THREE.Mesh(tailGeom, blackMat);
  this.tail.position.z = -10;
  this.tail.position.y = 4;
  this.torso.add(this.tail);
  
  
  var pawGeom = new THREE.CylinderGeometry(1.5,0,10);
  pawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-5,0));
  this.pawFL = new THREE.Mesh(pawGeom, blackMat);
  this.pawFL.position.y = -7.5;
  this.pawFL.position.z = 8.5;
  this.pawFL.position.x = 5.5;
  this.torso.add(this.pawFL);
  
  this.pawFR = this.pawFL.clone();
  this.pawFR.position.x = - this.pawFL.position.x;
  this.torso.add(this.pawFR);
  
  this.pawBR = this.pawFR.clone();
  this.pawBR.position.z = - this.pawFL.position.z;
  this.torso.add(this.pawBR);
  
  this.pawBL = this.pawBR.clone();
  this.pawBL.position.x = this.pawFL.position.x;
  this.torso.add(this.pawBL);
  
  this.mesh.add(this.body);
  this.torso.add(this.head);
  this.body.add(this.torso);
  
  this.torso.castShadow = true;
  this.head.castShadow = true;
  this.pawFL.castShadow = true;
  this.pawFR.castShadow = true;
  this.pawBL.castShadow = true;
  this.pawBR.castShadow = true;
  
  this.body.rotation.y = Math.PI/2;
}

Monster.prototype.run = function(){
  var s = Math.min(speed,maxSpeed);
  this.runningCycle += delta * s * .7;
  this.runningCycle = this.runningCycle % (Math.PI*2);
  var t = this.runningCycle;
  
  this.pawFR.rotation.x = Math.sin(t)*Math.PI/4;
  this.pawFR.position.y = -5.5 - Math.sin(t);
  this.pawFR.position.z = 7.5 + Math.cos(t);
  
  this.pawFL.rotation.x = Math.sin(t+.4)*Math.PI/4;
  this.pawFL.position.y = -5.5 - Math.sin(t+.4);
  this.pawFL.position.z = 7.5 + Math.cos(t+.4);
  
  this.pawBL.rotation.x = Math.sin(t+2)*Math.PI/4;
  this.pawBL.position.y = -5.5 - Math.sin(t+3.8);
  this.pawBL.position.z = -7.5 + Math.cos(t+3.8);
  
  this.pawBR.rotation.x = Math.sin(t+2.4)*Math.PI/4;
  this.pawBR.position.y = -5.5 - Math.sin(t+3.4);
  this.pawBR.position.z = -7.5 + Math.cos(t+3.4);
  
  this.torso.rotation.x = Math.sin(t)*Math.PI/8;
  this.torso.position.y = 3-Math.sin(t+Math.PI/2)*3;
  
  //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
  this.head.rotation.x = -.1+Math.sin(-t-1)*.4;
  this.mouth.rotation.x = .2 + Math.sin(t+Math.PI+.3)*.4;
  
  this.tail.rotation.x = .2 + Math.sin(t-Math.PI/2);
  
  this.eyeR.scale.y = .5 + Math.sin(t+Math.PI)*.5;
}

Hero.prototype.nod = function(){
  var _this = this;
  var sp = .5 + Math.random();
  
  // HEAD
  var tHeadRotY = -Math.PI/6 + Math.random()* Math.PI/3;
  TweenMax.to(this.head.rotation, sp, {y:tHeadRotY, ease:Power4.easeInOut, onComplete:function(){_this.nod()}});
  
  // EARS
  var tEarLRotX =  Math.PI/4 + Math.random()* Math.PI/6;
  var tEarRRotX =  Math.PI/4 + Math.random()* Math.PI/6;
  
  TweenMax.to(this.earL.rotation, sp, {x:tEarLRotX, ease:Power4.easeInOut});
  TweenMax.to(this.earR.rotation, sp, {x:tEarRRotX, ease:Power4.easeInOut});
  
  
  // PAWS BACK LEFT
  
  var tPawBLRot = Math.random()*Math.PI/2;
  var tPawBLY = -4 + Math.random()*8;
  
  TweenMax.to(this.pawBL.rotation, sp/2, {x:tPawBLRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
  TweenMax.to(this.pawBL.position, sp/2, {y:tPawBLY, ease:Power1.easeInOut, yoyo:true, repeat:2});
  
  
  // PAWS BACK RIGHT
  
  var tPawBRRot = Math.random()*Math.PI/2;
  var tPawBRY = -4 + Math.random()*8;
  TweenMax.to(this.pawBR.rotation, sp/2, {x:tPawBRRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
  TweenMax.to(this.pawBR.position, sp/2, {y:tPawBRY, ease:Power1.easeInOut, yoyo:true, repeat:2});
  
  // PAWS FRONT LEFT
  
  var tPawFLRot = Math.random()*Math.PI/2;
  var tPawFLY = -4 + Math.random()*8;
  
  TweenMax.to(this.pawFL.rotation, sp/2, {x:tPawFLRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
  
  TweenMax.to(this.pawFL.position, sp/2, {y:tPawFLY, ease:Power1.easeInOut, yoyo:true, repeat:2});
  
  // PAWS FRONT RIGHT
  
  var tPawFRRot = Math.random()*Math.PI/2;
  var tPawFRY = -4 + Math.random()*8;
  
  TweenMax.to(this.pawFR.rotation, sp/2, {x:tPawFRRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
  
  TweenMax.to(this.pawFR.position, sp/2, {y:tPawFRY, ease:Power1.easeInOut, yoyo:true, repeat:2});
  
  // MOUTH
  var tMouthRot = Math.random()*Math.PI/8;
  TweenMax.to(this.mouth.rotation, sp, {x:tMouthRot, ease:Power1.easeInOut});
  // IRIS
  var tIrisY = -1 + Math.random()*2;
  var tIrisZ = -1 + Math.random()*2;
  var iris1 = this.iris;
  var iris2 = this.eyeR.children[0];
  TweenMax.to([iris1.position, iris2.position], sp, {y:tIrisY, z:tIrisZ, ease:Power1.easeInOut});
  
  //EYES
  if (Math.random()>.2) TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp/8, {y:0, ease:Power1.easeInOut, yoyo:true, repeat:1});
  
}

Hero.prototype.hang = function(){
  var _this = this;
  var sp = 1;
  var ease = Power4.easeOut;
  
  TweenMax.killTweensOf(this.eyeL.scale);
  TweenMax.killTweensOf(this.eyeR.scale);
  
  this.body.rotation.x = 0;
  this.torso.rotation.x = 0;
  this.body.position.y = 0;
  this.torso.position.y = 7;
  
  TweenMax.to(this.mesh.rotation, sp, {y:0, ease:ease});
  TweenMax.to(this.mesh.position, sp, {y:-7, z:6, ease:ease});
  TweenMax.to(this.head.rotation, sp, {x:Math.PI/6, ease:ease, onComplete:function(){_this.nod();}});
  
  TweenMax.to(this.earL.rotation, sp, {x:Math.PI/3, ease:ease});
  TweenMax.to(this.earR.rotation, sp, {x:Math.PI/3, ease:ease});
  
  TweenMax.to(this.pawFL.position, sp, {y:-1, z:3, ease:ease});
  TweenMax.to(this.pawFR.position, sp, {y:-1, z:3, ease:ease});
  TweenMax.to(this.pawBL.position, sp, {y:-2, z:-3, ease:ease});
  TweenMax.to(this.pawBR.position, sp, {y:-2, z:-3, ease:ease});
  
  TweenMax.to(this.eyeL.scale, sp, {y:1, ease:ease});
  TweenMax.to(this.eyeR.scale, sp, {y:1, ease:ease});
}

Monster.prototype.nod = function(){
  var _this = this;
  var sp = 1 + Math.random()*2;
  
  // HEAD
  var tHeadRotY = -Math.PI/3 + Math.random()*.5;
  var tHeadRotX = Math.PI/3 - .2 +  Math.random()*.4;
  TweenMax.to(this.head.rotation, sp, {x:tHeadRotX, y:tHeadRotY, ease:Power4.easeInOut, onComplete:function(){_this.nod()}});
  
  // TAIL
  
  var tTailRotY = -Math.PI/4;
  TweenMax.to(this.tail.rotation, sp/8, {y:tTailRotY, ease:Power1.easeInOut, yoyo:true, repeat:8});
  
  // EYES
  
  TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp/20, {y:0, ease:Power1.easeInOut, yoyo:true, repeat:1});
}

Monster.prototype.sit = function(){
  var sp = 1.2;
  var ease = Power4.easeOut;
  var _this = this;
  TweenMax.to(this.torso.rotation, sp, {x:-1.3, ease:ease});
  TweenMax.to(this.torso.position, sp, {y:-5, ease:ease, onComplete:function(){
    _this.nod();
    gameStatus = "readyToReplay";
  }});
  
  TweenMax.to(this.head.rotation, sp, {x:Math.PI/3, y :-Math.PI/3, ease:ease});
  TweenMax.to(this.tail.rotation, sp, {x:2, y:Math.PI/4, ease:ease});
  TweenMax.to(this.pawBL.rotation, sp, {x:-.1, ease:ease});
  TweenMax.to(this.pawBR.rotation, sp, {x:-.1, ease:ease});
  TweenMax.to(this.pawFL.rotation, sp, {x:1, ease:ease});
  TweenMax.to(this.pawFR.rotation, sp, {x:1, ease:ease});
  TweenMax.to(this.mouth.rotation, sp, {x:.3, ease:ease});
  TweenMax.to(this.eyeL.scale, sp, {y:1, ease:ease});
  TweenMax.to(this.eyeR.scale, sp, {y:1, ease:ease});
  
  //TweenMax.to(this.body.rotation, sp, {y:Math.PI/4});
  
}


Carrot = function() {
  this.angle = 0;
  this.mesh = new THREE.Group();
  
  var bodyGeom = new THREE.CylinderGeometry(5,3, 10, 4,1);
  bodyGeom.vertices[8].y+=2;
  bodyGeom.vertices[9].y-=3;
  
  this.body = new THREE.Mesh(bodyGeom, pinkMat);
  
  var leafGeom = new THREE.CubeGeometry(5,10,1,1);
  leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,5,0));
  leafGeom.vertices[2].x-=1;
  leafGeom.vertices[3].x-=1;
  leafGeom.vertices[6].x+=1;
  leafGeom.vertices[7].x+=1;
  
  this.leaf1 = new THREE.Mesh(leafGeom,greenMat);
  this.leaf1.position.y = 7;
  this.leaf1.rotation.z = .3;
  this.leaf1.rotation.x = .2;
  
  this.leaf2 = this.leaf1.clone();
  this.leaf2.scale.set(1,1.3,1);
  this.leaf2.position.y = 7;
  this.leaf2.rotation.z = -.3;
  this.leaf2.rotation.x = -.2;
  
  this.mesh.add(this.body);
  this.mesh.add(this.leaf1);
  this.mesh.add(this.leaf2);

  this.body.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Hedgehog = function() {
  this.angle = 0;
  this.status="ready";
  this.mesh = new THREE.Group();
  var bodyGeom = new THREE.CubeGeometry(6,6,6,1);
  this.body = new THREE.Mesh(bodyGeom, blackMat);
  
  var headGeom = new THREE.CubeGeometry(5,5,7,1);
  this.head= new THREE.Mesh(headGeom, lightBrownMat);
  this.head.position.z = 6;
  this.head.position.y = -.5;
  
  var noseGeom = new THREE.CubeGeometry(1.5,1.5,1.5,1);
  this.nose = new THREE.Mesh(noseGeom, blackMat);
  this.nose.position.z = 4;
  this.nose.position.y = 2;
  
  var eyeGeom = new THREE.CubeGeometry(1,3,3);
  
  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 2.2;
  this.eyeL.position.z = -.5;
  this.eyeL.position.y = .8;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);
  
  var irisGeom = new THREE.CubeGeometry(.5,1,1);
  
  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = .5;
  this.iris.position.y = .8;
  this.iris.position.z = .8;
  this.eyeL.add(this.iris);
  
  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;
  this.eyeR.position.x = -this.eyeL.position.x;
  
  var spikeGeom = new THREE.CubeGeometry(.5,2,.5,1);
  spikeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,1,0));
  
  for (var i=0; i<9; i++){ 
    var row = (i%3);
    var col = Math.floor(i/3);
    var sb = new THREE.Mesh(spikeGeom, blackMat);
    sb.rotation.x =-Math.PI/2 + (Math.PI/12*row) -.5 +  Math.random();
    sb.position.z = -3;
    sb.position.y = -2 + row*2;
    sb.position.x = -2 + col*2; 
    this.body.add(sb); 
    var st = new THREE.Mesh(spikeGeom, blackMat);
    st.position.y = 3;
    st.position.x = -2 + row*2;
    st.position.z = -2 + col*2;
    st.rotation.z = Math.PI/6 - (Math.PI/6*row) -.5 +  Math.random();
    this.body.add(st);
    
    var sr = new THREE.Mesh(spikeGeom, blackMat);
    sr.position.x = 3;
    sr.position.y = -2 + row*2;
    sr.position.z = -2 + col*2;
    sr.rotation.z = -Math.PI/2 + (Math.PI/12*row) -.5 +  Math.random();
    this.body.add(sr);
    
    var sl = new THREE.Mesh(spikeGeom, blackMat);
    sl.position.x = -3;
    sl.position.y = -2 + row*2;
    sl.position.z = -2 + col*2;
    sl.rotation.z = Math.PI/2  - (Math.PI/12*row) -.5 +  Math.random();;
    this.body.add(sl); 
  }

  this.head.add(this.eyeR);
  var earGeom = new THREE.CubeGeometry(2, 2, .5, 1);
  this.earL = new THREE.Mesh(earGeom, lightBrownMat);
  this.earL.position.x = 2.5;
  this.earL.position.z = -2.5;
  this.earL.position.y = 2.5;
  this.earL.rotation.z = -Math.PI/12;
  this.earL.castShadow = true;
  this.head.add(this.earL);
  
  this.earR = this.earL.clone();
  this.earR.position.x = -this.earL.position.x;
  this.earR.rotation.z = -this.earL.rotation.z;
  this.earR.castShadow = true;
  this.head.add(this.earR);
  
  var mouthGeom = new THREE.CubeGeometry( 1, 1,.5, 1);
  this.mouth = new THREE.Mesh(mouthGeom, blackMat);
  this.mouth.position.z = 3.5;
  this.mouth.position.y = -1.5;
  this.head.add(this.mouth);
  
  
  this.mesh.add(this.body);
  this.body.add(this.head);
  this.head.add(this.nose);

  this.mesh.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Hedgehog.prototype.nod = function(){
  var _this = this;
  var speed = .1 + Math.random()*.5;
  var angle = -Math.PI/4 + Math.random()*Math.PI/2;
  TweenMax.to(this.head.rotation, speed, {y:angle, onComplete:function(){
    _this.nod();
  }});
}


function createHero() {
  hero = new Hero();
  hero.mesh.rotation.y = Math.PI/2;
  scene.add(hero.mesh);
  hero.nod();
}

function createMonster() {
  
  monster = new Monster();
  monster.mesh.position.z = 20;
  //monster.mesh.scale.set(1.2,1.2,1.2);
  scene.add(monster.mesh);
  updateMonsterPosition();
  
}

function updateMonsterPosition(){
  monster.run();
  monsterPosTarget -= delta*monsterAcceleration;
  monsterPos += (monsterPosTarget-monsterPos) *delta;
  if (monsterPos < .56){
    gameOver();
  }
  
  var angle = Math.PI*monsterPos;
  monster.mesh.position.y = - floorRadius + Math.sin(angle)*(floorRadius + 12);
  monster.mesh.position.x = Math.cos(angle)*(floorRadius+15);
  monster.mesh.rotation.z = -Math.PI/2 + angle;
}

function gameOver(){
  fieldGameOver.className = "show";
  gameStatus = "gameOver";
  monster.sit();
  hero.hang();
  monster.heroHolder.add(hero.mesh);
  TweenMax.to(this, 1, {speed:0});
  TweenMax.to(camera.position, 3, {z:cameraPosGameOver, y: 60, x:-30});
  carrot.mesh.visible = false;
  obstacle.mesh.visible = false;
  clearInterval(levelInterval);
}

function replay(){
  
  gameStatus = "preparingToReplay"
  
  fieldGameOver.className = "";
  
  TweenMax.killTweensOf(monster.pawFL.position);
  TweenMax.killTweensOf(monster.pawFR.position);
  TweenMax.killTweensOf(monster.pawBL.position);
  TweenMax.killTweensOf(monster.pawBR.position);
  
  TweenMax.killTweensOf(monster.pawFL.rotation);
  TweenMax.killTweensOf(monster.pawFR.rotation);
  TweenMax.killTweensOf(monster.pawBL.rotation);
  TweenMax.killTweensOf(monster.pawBR.rotation);
  
  TweenMax.killTweensOf(monster.tail.rotation);
  TweenMax.killTweensOf(monster.head.rotation);
  TweenMax.killTweensOf(monster.eyeL.scale);
  TweenMax.killTweensOf(monster.eyeR.scale);
  
  //TweenMax.killTweensOf(hero.head.rotation);
  
  monster.tail.rotation.y = 0;
    
  TweenMax.to(camera.position, 3, {z:cameraPosGame, x:0, y:30, ease:Power4.easeInOut});
  TweenMax.to(monster.torso.rotation,2, {x:0, ease:Power4.easeInOut});
  TweenMax.to(monster.torso.position,2, {y:0, ease:Power4.easeInOut});
  TweenMax.to(monster.pawFL.rotation,2, {x:0, ease:Power4.easeInOut});
  TweenMax.to(monster.pawFR.rotation,2, {x:0, ease:Power4.easeInOut});
  TweenMax.to(monster.mouth.rotation,2, {x:.5, ease:Power4.easeInOut});
  
  
  TweenMax.to(monster.head.rotation,2, {y:0, x:-.3, ease:Power4.easeInOut});
  
  TweenMax.to(hero.mesh.position, 2, { x:20, ease:Power4.easeInOut});
  TweenMax.to(hero.head.rotation, 2, { x:0, y:0, ease:Power4.easeInOut});
  TweenMax.to(monster.mouth.rotation, 2, {x:.2, ease:Power4.easeInOut});
  TweenMax.to(monster.mouth.rotation, 1, {x:.4, ease:Power4.easeIn, delay: 1, onComplete:function(){
    
    resetGame();
  }});
  
}

Fir = function() {
  var height = 200;
  var truncGeom = new THREE.CylinderGeometry(2,2,height, 6,1);
  truncGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,height/2,0));
  this.mesh = new THREE.Mesh(truncGeom, greenMat);
  this.mesh.castShadow = true;
}

var firs = new THREE.Group();

function createFirs(){
  
  var nTrees = 100;
   for(var i=0; i< nTrees; i++){
    var phi = i*(Math.PI*2)/nTrees;
    var theta = Math.PI/2;
    //theta += .25 + Math.random()*.3; 
    theta += (Math.random()>.05)? .25 + Math.random()*.3 : - .35 -  Math.random()*.1;
   
    var fir = new Tree();
    fir.mesh.position.x = Math.sin(theta)*Math.cos(phi)*floorRadius;
    fir.mesh.position.y = Math.sin(theta)*Math.sin(phi)*(floorRadius-10);
    fir.mesh.position.z = Math.cos(theta)*floorRadius; 
     
    var vec = fir.mesh.position.clone();
    var axis = new THREE.Vector3(0,1,0);
    fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
    floor.add(fir.mesh); 
  }
}

function createCarrot(){
  carrot = new Carrot();
  scene.add(carrot.mesh);
}

function updateCarrotPosition(){
  carrot.mesh.rotation.y += delta * 6;
  carrot.mesh.rotation.z = Math.PI/2 - (floorRotation+carrot.angle);
  carrot.mesh.position.y = -floorRadius + Math.sin(floorRotation+carrot.angle) * (floorRadius+50);
  carrot.mesh.position.x = Math.cos(floorRotation+carrot.angle) * (floorRadius+50);
  
}

function updateObstaclePosition(){
  if (obstacle.status=="flying")return;
  
  // TODO fix this,
  if (floorRotation+obstacle.angle > 2.5 ){
    obstacle.angle = -floorRotation + Math.random()*.3;
    obstacle.body.rotation.y = Math.random() * Math.PI*2;
  }
  
  obstacle.mesh.rotation.z = floorRotation + obstacle.angle - Math.PI/2;
  obstacle.mesh.position.y = -floorRadius + Math.sin(floorRotation+obstacle.angle) * (floorRadius+3);
  obstacle.mesh.position.x = Math.cos(floorRotation+obstacle.angle) * (floorRadius+3);
  
}

function updateFloorRotation(){
  floorRotation += delta*.03 * speed;
  floorRotation = floorRotation%(Math.PI*2);
  floor.rotation.z = floorRotation;
}

function createObstacle(){
  obstacle = new Hedgehog();
  obstacle.body.rotation.y = -Math.PI/2;
  obstacle.mesh.scale.set(1.1,1.1,1.1);
  obstacle.mesh.position.y = floorRadius+4;
  obstacle.nod();
  scene.add(obstacle.mesh);
}

function createBonusParticles(){
  bonusParticles = new BonusParticles();
  bonusParticles.mesh.visible = false;
  scene.add(bonusParticles.mesh);
  
}



function checkCollision(){
  var db = hero.mesh.position.clone().sub(carrot.mesh.position.clone());
  var dm = hero.mesh.position.clone().sub(obstacle.mesh.position.clone());
  
  if(db.length() < collisionBonus){
    getBonus();
  }
  
  if(dm.length() < collisionObstacle && obstacle.status != "flying"){
    getMalus();
  }
}

function getBonus(){
  bonusParticles.mesh.position.copy(carrot.mesh.position);
  bonusParticles.mesh.visible = true;
  bonusParticles.explose();
  carrot.angle += Math.PI/2;
  //speed*=.95;
  monsterPosTarget += .025;
  
}

function getMalus(){
  obstacle.status="flying";
  var tx = (Math.random()>.5)? -20-Math.random()*10 : 20+Math.random()*5;
  TweenMax.to(obstacle.mesh.position, 4, {x:tx, y:Math.random()*50, z:350, ease:Power4.easeOut});
  TweenMax.to(obstacle.mesh.rotation, 4, {x:Math.PI*3, z:Math.PI*3, y:Math.PI*6, ease:Power4.easeOut, onComplete:function(){
    obstacle.status = "ready";
    obstacle.body.rotation.y = Math.random() * Math.PI*2;
    obstacle.angle = -floorRotation - Math.random()*.4;
    
    obstacle.angle = obstacle.angle%(Math.PI*2);
    obstacle.mesh.rotation.x = 0;
    obstacle.mesh.rotation.y = 0;
    obstacle.mesh.rotation.z = 0;
    obstacle.mesh.position.z = 0;
    
  }});
  //
  monsterPosTarget -= .04;
  TweenMax.from(this, .5, {malusClearAlpha:.5, onUpdate:function(){
    renderer.setClearColor(malusClearColor, malusClearAlpha );
  }})
}

function updateDistance(){
  distance += delta*speed;
  var d = distance/2;
  fieldDistance.innerHTML = Math.floor(d);
}

function updateLevel(){
  if (speed >= maxSpeed) return;
  level++;
  speed += 2; 
}

function loop(){
  delta = clock.getDelta();
  updateFloorRotation();
  
  if (gameStatus == "play"){
    
    if (hero.status == "running"){
      hero.run();
    }
    updateDistance();
    updateMonsterPosition();
    updateCarrotPosition();
    updateObstaclePosition();
    checkCollision();
  }
  
  render();  
  requestAnimationFrame(loop);
}

function render(){
  renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

function init(event){
  initScreenAnd3D();
  createLights();
  createFloor()
  createHero();
  createMonster();
  createFirs();
  createCarrot();
  createBonusParticles();
  createObstacle();
  initUI();
  resetGame();
  loop();
  
  //setInterval(hero.blink.bind(hero), 3000);
}

function resetGame(){
  scene.add(hero.mesh);
  hero.mesh.rotation.y = Math.PI/2;
  hero.mesh.position.y = 0;
  hero.mesh.position.z = 0;
  hero.mesh.position.x = 0;

  monsterPos = .56;
  monsterPosTarget = .65;
  speed = initSpeed;
  level = 0;
  distance = 0;
  carrot.mesh.visible = true;
  obstacle.mesh.visible = true;
  gameStatus = "play";
  hero.status = "running";
  hero.nod();
  audio.play();
  updateLevel();
  levelInterval = setInterval(updateLevel, levelUpdateFreq);
}

function initUI(){
  fieldDistance = document.getElementById("distValue");
  fieldGameOver = document.getElementById("gameoverInstructions");
  
}



////////////////////////////////////////////////
//                                        MODELS
////////////////////////////////////////////////

// TREE

Tree = function(){
	this.mesh = new THREE.Object3D();
	this.trunc = new Trunc();
	this.mesh.add(this.trunc.mesh);
}


Trunc = function(){
  var truncHeight = 50 + Math.random()*150;
  var topRadius = 1+Math.random()*5;
  var bottomRadius = 5+Math.random()*5;
  var mats = [blackMat, brownMat, pinkMat, whiteMat, greenMat, lightBrownMat, pinkMat];
  var matTrunc = blackMat;//mats[Math.floor(Math.random()*mats.length)];
  var nhSegments = 3;//Math.ceil(2 + Math.random()*6);
  var nvSegments = 3;//Math.ceil(2 + Math.random()*6);
  var geom = new THREE.CylinderGeometry(topRadius,bottomRadius,truncHeight, nhSegments, nvSegments);
  geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,truncHeight/2,0));
  
  this.mesh = new THREE.Mesh(geom, matTrunc);
  
  for (var i=0; i<geom.vertices.length; i++){
    var noise = Math.random() ;
    var v = geom.vertices[i];
    v.x += -noise + Math.random()*noise*2;
    v.y += -noise + Math.random()*noise*2;
    v.z += -noise + Math.random()*noise*2;
    
    geom.computeVertexNormals();
    
    // FRUITS
    
    if (Math.random()>.7){
      var size = Math.random()*3;
      var fruitGeometry = new THREE.CubeGeometry(size,size,size,1);
      var matFruit = mats[Math.floor(Math.random()*mats.length)];
      var fruit = new THREE.Mesh(fruitGeometry, matFruit);
      fruit.position.x = v.x;
      fruit.position.y = v.y+3;
      fruit.position.z = v.z;
      fruit.rotation.x = Math.random()*Math.PI;
      fruit.rotation.y = Math.random()*Math.PI;
      
      this.mesh.add(fruit);
    }
    
    // BRANCHES
    
    if (Math.random()>.5 && v.y > 10 && v.y < truncHeight - 10){
      var h = 3 + Math.random()*5;
      var thickness = .2 + Math.random();
      
      var branchGeometry = new THREE.CylinderGeometry(thickness/2, thickness, h, 3, 1);
      branchGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,h/2,0));
      var branch = new THREE.Mesh(branchGeometry, matTrunc);
      branch.position.x = v.x;
      branch.position.y = v.y;
      branch.position.z = v.z;
      
      var vec = new THREE.Vector3(v.x, 2, v.z);
      var axis = new THREE.Vector3(0,1,0);
      branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
      
      
      this.mesh.add(branch);
    }
    
  }
  
  
  this.mesh.castShadow = true;
}
