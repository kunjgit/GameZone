
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 0);
  };
})();

function init(){
 cvs = document.createElement('canvas');
 cvs_viewport = document.getElementById('canvas13k');
 //cvs = document.getElementById('canvas13k');
 //cvs2 = document.createElement('canvas');
 ctx_viewport = cvs_viewport.getContext('2d');
 ctx = cvs.getContext('2d');
 mobile = false;
 //agentTest = navigator.userAgent.indexOf;
 if ((navigator.userAgent.indexOf('iPhone') != -1) 
  || (navigator.userAgent.indexOf('iPod') != -1) 
  || (navigator.userAgent.indexOf('iPad') != -1)) {
    cvs.height = 500;
    cvs.width = 800;
    mobile = true;
  }
 else {
  cvs.height = window.innerHeight-20;
  cvs.width = window.innerWidth-20;
  //cvs.height = 500;
  //cvs.width = 800;
 }
 cvs_viewport.height = cvs.height;
 cvs_viewport.width = cvs.width;
 menu = document.getElementById('menu'); //menu div
 menuGraphic = document.getElementById('menuGraphic');
 var tempsize = (cvs.height > cvs.width) ? cvs.width : cvs.height;
 menuGraphic.height = tempsize;
 menuGraphic.width = tempsize;



 //menuImage = new Image;
 //menuImage.src = 'instructions.svg';

 menu.addEventListener('click', menuclick, false);
 menu.addEventListener('touchend', menuclick, false);
 window.addEventListener('mousedown', onMouseDown, false);
 window.addEventListener('mousemove', onMouseMove, false);
 window.addEventListener('mouseup', onMouseUp, false);
 //cvs.addEventListener('mouseout', onMouseUp, false);
 window.addEventListener('touchstart', onMouseDown, false);
 window.addEventListener('touchmove', onMouseMove, false);
 window.addEventListener('touchend', onMouseUp, false);
 isMouseDown = false;
 mouseSensitivity = 100;
 currentMouseCoords = {x:0, y:0};
 sphereVelocity = {x: 0, y: 0}; //used for swiping events.
 sphereDecel = 10; //arbitrary units.
 r = cvs.height <= cvs.width ? cvs.height/2 : cvs.width/2 ;
 r -= 10; //shrink by 10.
 delta = {theta:0, phi:0};
 sphere_tau = -Math.PI/6; //declination angle of the sphere relative to camera
 starBoxSize = 0; //gets set in makestars();
 score = 0;
 menuState = true;
 playingState = false;
 sphereShaker = new Vibration();

 tm = {
  current: Date.now(),
  last: null,
  step: function(){
   this.last = this.current;
   this.current = Date.now();		
  },
  delta: function(){
   return this.current - this.last;
  }
 }
 sphere = makesphere();
 paddle = new Paddle('rgba(20,160,80,0.9)', 'rgba(20,160,80,0.4)', sphere[15][15]);
 
 if (!mobile){
  stars = makestars();
 //stars = [];
 }
 else {
  stars = makestars();
  //stars = [];
 }

 balls = [new Ball('green', 0,0,0, 0,0,0)];
 //-r/2000 is a good starting speed.
 balls[0].isCaught = true;
 //balls = [];
}
function shpereMain(){
	init();
	loop();
  //setInterval(loop, 33); //30 fps roughly
}

function loop(){
	clear();
	update();
	draw();
  flip();
  window.requestAnimFrame(function(){
    loop();
  });
}

function clear(){
	ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx_viewport.clearRect(0,0,cvs.width,cvs.height);
	var w = cvs.width;
	cvs.width = 1;
  cvs_viewport.width = 1;
	cvs.width = w;
  cvs_viewport.width = w;
}

function update(){
 tm.step();
 paddle.update();
 for (var i=0; i<stars.length; i++){
  stars[i].update();
 }
 
 for (var j=0; j<balls.length; j++){
  balls[j].update();
 }
 //sortBalls();

 if (!isMouseDown){
    delta.theta += sphereVelocity.x;
  }
  //sphere_tau += -sphereVelocity.y;
  /*
  if (sphere_tau > Math.PI*9/20){
    sphere_tau = Math.PI*9/20;
  }
  else if (sphere_tau < -Math.PI*9/20){
    sphere_tau = -Math.PI*9/20;
  }
  */

  sphereVelocity.x = sphereVelocity.x * .95;
  //sphereVelocity.y = sphereVelocity.y * .90;
  if (Math.abs(sphereVelocity.x) < 0.005 ){
    sphereVelocity.x = 0;
  }

  sphereShaker.update();
  /*
  if (Math.abs(sphereVelocity.y) < 0.005 ){
    sphereVelocity.y = 0;
  }
 }
 */

 for (var i=balls.length-1; i>=0; i--){
  //go through backwards and clean up pucks.
  if (balls[i].deleteMe == true){
    if (balls.length == 1){
      balls[i].isCaught;
    }
    else {
     delete balls[i];
     balls.splice(i,1);
    }
  }
 }

 if (menuState){
  delta.theta += 0.0001 * tm.delta();
  if (!mobile){
   menu.style.top = 0;
  }
  else {
    menu.style.visibility = 'visible';
  }
 }

 //delta.theta += tm.delta() * 0.0001;
 //delta.phi += tm.delta() * 0.0002;
 //delta.theta += tm.delta() * 0.001;
 //delta.phi += tm.delta() * -0.003;
}

function draw(){
 ctx.save();
 ctx.translate(cvs.width/2, cvs.height/2);
 for (var i=0; i<stars.length; i++){
  ctx.beginPath();
  stars[i].draw();
  ctx.fill();
 }
 if (!paddle.isInFront) { paddle.draw() ;}
 for (var j=0; j<balls.length; j++){
  balls[j].draw();
 }
 drawLongitudes();
 if (paddle.isInFront) { paddle.draw() ;}
 
 drawScore();

 /*
 if (menuState){
  ctx.restore();
  var menuSize = (cvs.height > cvs.width) ? cvs.width : cvs.height; 

  ctx.drawImage(menuImage,cvs.width/2 - menuSize/2, cvs.height/2 - menuSize/2 ,menuSize,menuSize);
 }
 */
}

function flip(){
  ctx_viewport.drawImage(cvs,0,0);
}

function drawScore(){
  ctx.font = '50px Impact,Charcoal,sans-serif';
  ctx.textBaseline = 'Top';
  ctx.fillStyle = 'rgba(100,100,100,0.9)';
  ctx.fillText(score, -cvs.width*5/11, -cvs.height*5/11 + 60);
  ctx.fillStyle = 'rgba(200,200,200,0.9)';
  ctx.fillText(score, -cvs.width*5/11 -3, -cvs.height*5/11 + 57)
}

function drawLongitudes(){
 var frontColor = 'rgba(255,255,255,0.8)';
 var rearColor = 'rgba(190,190,190,0.6)';
 ctx.lineWidth=2.5;
 var step = (mobile) ? 2 : 1;
 for (var j=0; j<sphere.length; j+=step){
  ctx.beginPath();
  var pt0 = sphereToRect(r + sphereShaker.magnitude,sphere[j][0].theta + delta.theta, sphere[j][0].phi);
  pt0 = rotateAboutY(pt0.x, pt0.y, pt0.z, sphere_tau);
  ctx.moveTo(Math.round(pt0.x), Math.round(pt0.y));
  for (var i=1; i<sphere[j].length; i+=step){
   var pt = sphereToRect(r + sphereShaker.magnitude,sphere[j][i].theta + delta.theta, sphere[j][i].phi);
   pt = rotateAboutY(pt.x, pt.y, pt.z, sphere_tau);
   ctx.lineTo(Math.round(pt.x), Math.round(pt.y));
   if (i == 15){
    ctx.strokeStyle = pt.z > 0 ? frontColor : rearColor;
   }
  }
  ctx.stroke();
  //ctx.closePath();
 }
 //ctx.stroke();
}

function makesphere(){
 //makes a big list full of sphere coordinates in spherical coordinates
 var sphere = [];
 for (var t=0; t<30; t++){ //every 12 degrees
  sphere.push([]);
  for (var p=0; p < 30; p++){ //every 6 degrees
   sphere[t].push({theta: t * 12 / 360 * Math.PI * 2, phi: p * 6 / 360 * Math.PI *2}); 
  }
 }
 return sphere;
}

function makestars(){
 var starsArray = [];
 starBoxSize = cvs.width;
 for (var i=0; i<500; i++){
  starsArray.push(new Star('white', randomRange(-starBoxSize, starBoxSize), randomRange(-starBoxSize, starBoxSize), randomRange(-starBoxSize, starBoxSize)));
 }
 return starsArray;
}

function rectToSphere(x,y,z){
  var rho = Math.sqrt(x*x + y*y + z*z);
  var S = Math.sqrt(z*z + x*x);
  var theta = -z >= 0 ? Math.asin(x/S) : Math.PI - Math.asin(x/S);
  if (S==0){theta = 0};
  var phi = Math.acos(-y/rho);
  return {rho:rho, theta:theta, phi:phi};
}

function sphereToRect(rho, theta, phi){
  //for orthographic transform
 x = rho * Math.sin(phi) * Math.cos(theta);
 y = rho * Math.sin(phi) * Math.sin(theta);
 z = rho * Math.cos(phi)
 return {x:y, y:-z, z:-x};
}

function sphereToStereoRect(rho, theta, phi){
  //for stereoscopic transform
  //assuming z, the camera lens is at 3r pixels from the screen.
  //assuming the sphere's origin is -3r pixels from the screen.
  //basically just a parallax maker.
  var pt = sphereToRect(rho,theta,phi);
  return rectToStereoRect(pt.x, pt.y, pt.z);
}

function rectToStereoRect(x,y,z){
 //parallax maker where input is cartesian and not spherical
  var pt = {x:x, y:y, z:z};
  var pt1 = {x:0, y:0, z:0};
  pt1.x = pt.x * (-3*r) / (pt.z + -3*r + -3*r);
  pt1.y = pt.y * (-3*r) / (pt.z + -3*r + -3*r);
  pt1.z = pt.z;
  return pt1;
}

function rotateAboutY(x,y,z,phi){
 //takes a vector and rotates it about the y axis according to the canvas an
 //angle phi.
 //var xprime = x * Math.cos(phi) + z * Math.sin(phi);
 //var zprime = z * Math.cos(phi) - x * Math.sin(phi);
 var xprime = x;
 var yprime = y * Math.cos(phi) - z * Math.sin(phi);
 var zprime = y * Math.sin(phi) + z * Math.cos(phi);
 return {x:xprime, y:yprime, z:zprime};
}

function rotateAboutAxisInXZPlane(){}

function Star(color, x, y, z){
 this.pos = {x:x, y:y, z:z};
 this.vel = {x:0, y:0, z:0.1};
 //this.pos = {rho:rho, theta:theta, phi:phi};
 this.color = color;
 this.radius = 1;
 this.update = function(){
  this.pos.x += this.vel.x * tm.delta();
  this.pos.y += this.vel.y * tm.delta();
  this.pos.z += this.vel.z * tm.delta();

  if (this.pos.z > starBoxSize){
    this.pos.z = -starBoxSize;
  }
 }
 this.draw = function(){
  //ctx.beginPath();
  var pt = {x:0, y:0, z:0};
  pt = rectToStereoRect(this.pos.x, this.pos.y, this.pos.z);
  ctx.arc(pt.x, pt.y, this.radius, 0, 2*Math.PI, false);
  ctx.fillStyle = this.color;
  //ctx.closePath();
  //ctx.fill();
 }
}

function Ball(color, x,y,z, dx,dy,dz){
  this.trueRadius = 25;
  deleteMe = false; //flag to mark it for deletion at the end of update;
  this.color = color;
  this.pos = {x:x, y:y, z:z};
  this.vel = {x:dx, y:dy, z:dz};
  this.tolerance = 10;
  this.insideSphere = true;
  this.hasBounced = false;
  this.bounceTimerCounter = 0;
  this.isCaught = false;

  this.update = function(){
    this.vel.y = 0;
    this.pos.y = 0;
   var rho = Math.sqrt(this.pos.x*this.pos.x + this.pos.y*this.pos.y + this.pos.z*this.pos.z);
   if (this.isCaught){
    var paddleLoc = sphereToRect(r-20, paddle.vertex.theta + delta.theta, paddle.vertex.phi);
    this.pos.x = paddleLoc.x;
    this.pos.y = paddleLoc.y;
    this.pos.z = paddleLoc.z;
   }
   else if (rho > r + r/2){
    //ball is out of bounds
    if (balls.length == 1){
      this.isCaught = true;
      menuState = true;
      this.vel.x = 0;
      this.vel.y = 0;
      this.vel.z = 0;
    }
    else{
     this.kill();
    }
   }
   else if (rho < r + this.tolerance && rho > r - this.tolerance){
    var spherePos = rectToSphere(this.pos.x, this.pos.y, this.pos.z);
    spherePos.theta = spherePos.theta%(2*Math.PI);
    spherePos.theta = Math.acos(Math.cos(spherePos.theta));
    var paddleTheta = (paddle.vertex.theta + delta.theta)%(2*Math.PI)
    paddleTheta = Math.acos(Math.cos(paddleTheta));
    var paddlePosRect = sphereToRect(r,paddle.vertex.theta + delta.theta, Math.PI/2);

    //var paddleTheta = (paddle.vertex.theta + delta.theta)%(2*Math.PI);
    if (spherePos.theta < 0){
      spherePos.theta += Math.PI * 2;
    }
    if (  !this.hasBounced &&
          spherePos.theta < (paddleTheta + paddle.deg/2)%(Math.PI*2) &&
          spherePos.theta > (paddleTheta - paddle.deg/2)%(Math.PI*2) &&
          paddlePosRect.x * this.pos.x >= 0

          ){
          //spherePos.phi < paddle.vertex.phi + paddle.deg/2 + sphere_tau && 
          //spherePos.phi > paddle.vertex.phi - paddle.deg/2 + sphere_tau){
      this.hasBounced = true;
      var N = sphereToRect(r, paddle.vertex.theta + delta.theta, paddle.vertex.phi);
      var normalFactor = Math.sqrt(N.x*N.x + N.y*N.y + N.z*N.z);
      N.x = N.x/normalFactor;
      //N.y = N.y/normalFactor;
      N.y = 0;
      N.z = N.z/normalFactor;
      this.vel = reflect(N, this.vel);
      this.vel.x *= 1.05;
      this.vel.z *= 1.05;
      score += 13;
      sphereShaker.shake(300);

      if (score % 39 == 0){
        this.multiball(2, N, normalFactor);
      }
      
    }
    if (rho > r){
      this.insideSphere = false;
    }
    
   }
   this.pos.x += this.vel.x * tm.delta();
   //this.pos.y += this.vel.y * tm.delta();
   this.pos.z += this.vel.z * tm.delta();
   if (this.hasBounced){
    this.bounceTimerCounter++;
    if (this.bounceTimerCounter > 10){
      this.bounceTimerCounter = 0;
      this.hasBounced = false;
    }
   }
  }
  this.draw = function(){
    //var pt = rectToStereoRect(this.pos.x, this.pos.y, this.pos.z);
    var pt = rotateAboutY(this.pos.x, this.pos.y, this.pos.z, sphere_tau);
    var radius_temp = rectToStereoRect(this.trueRadius, this.trueRadius, pt.z*3);
    var radius = radius_temp.x;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, 2*Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='black';
    ctx.stroke();
    if (this.insideSphere){
      //this.drawRay();
    }
  }
  this.kill = function(){
    this.deleteMe = true;
  }
  this.explode = function(){
    this.deleteMe = true;
  }
  this.checkCollision = function(){

  }
  this.pitch = function(){
    this.hasBounced = true;
    this.isCaught = false;
    score = 0;
    //var speed = 0.017
    var speed = r/2000;
    var normalFactor = Math.sqrt(this.pos.x*this.pos.x + this.pos.y*this.pos.y + this.pos.z*this.pos.z);
    this.vel.x = -this.pos.x/normalFactor * speed;
    this.vel.y = -this.pos.y/normalFactor* speed;
    this.vel.z = -this.pos.z/normalFactor * speed;
    //this.vel.z = -this.pos.z/normalFactor1 * speed1;
  }
  /*
  this.drawRay = function(that){
    //var this = that;
    //var startPoint = rectToSphere(this.pos.x, this.pos.y, this.pos.z);
    var velocity = rectToSphere(this.vel.x, this.vel.y, this.vel.z);
    var endPoint = {rho:r, theta:velocity.theta, phi: velocity.phi};
    var pt0 = this.pos;
    var pt1 = sphereToRect(endPoint.rho, endPoint.theta, endPoint.phi);
    //pt1.y = pt1.y;
    ctx.beginPath();
    ctx.moveTo(pt0.x, pt0.y);
    ctx.lineTo(pt1.x, pt1.y);
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }*/

  this.multiball = function(number, Normal, normalFactor){
    for (var i=0; i<number; i++){
      var newColor = 'rgb(' + Math.floor(randomRange(120,190)) + ',' + Math.floor(randomRange(120,190)) + ',' + Math.floor(randomRange(120,190)) + ')';
      var newSpeed = Math.sqrt(this.vel.x*this.vel.x + this.vel.z*this.vel.z);
      balls.push(new Ball(newColor, Normal.x*normalFactor,Normal.y*normalFactor,Normal.z * normalFactor, 
                                          -Normal.x * (newSpeed + randomRange(-.03,.03)),
                                          //-Normal.y * (.15 + randomRange(-.03,.03)),
                                          0,
                                          -Normal.z * (newSpeed + randomRange(-.03,.03))
        ));
      var tb = balls[balls.length-1];
      tb.pos.x += tb.vel.x * tm.delta();
      //tb.pos.y += tb.vel.y * tm.delta();
      tb.pos.z += tb.vel.z * tm.delta();
      tb.hasBounced = true;
    }
  }

  //this.multiply = function(number, Normal) { //unit vector normal to paddle
   //for (var i=0; i<number; i++){
    //var color = 'blue';
    //var newColor = 'rgb(' + randomRange(20,150) + ',' + randomRange(20,150) + ',' + randomRange(20,150) + ')';
    /*
    balls.push(new Ball(newColor, 0,0,0, Normal.x*(.15+randomRange(-.02,.02)),
                                         Normal.y*(.15+randomRange(-.02,.02)), 
                                         Normal.z*(.15+randomRange(-.02,.02))));
    */
  //}
}

function sortBalls(){
  //sorts them by Z via bubble sort, lowest z first;
  var switchCounter = 1;
  while (switchCounter){
   switchCounter = 0;
   for (var i=0; i<balls.length-1; i++){
    if (balls[i] > balls[i+1]){
      var temp = balls[i];
      balls[i] = balls[i+1];
      balls[i+1] = temp;
      switchCounter ++;
    }
   }
  }
}

function Paddle(frontColor, rearColor, vertex){
 //made of a sphere vertex, and extends 10 pixels in a square with
 //that vertex as its center
 this.vertex = vertex;
 this.frontColor = frontColor;
 this.rearColor = rearColor;
 this.deg = 0.5084;
 isInFront = true;

 this.update = function(){
  var ptv = sphereToRect(r, this.vertex.theta + delta.theta, this.vertex.phi);
  ptv = rotateAboutY(ptv.x, ptv.y, ptv.z, sphere_tau);
  this.isInFront = ptv.z > 0 ? true : false;
 }

 this.draw = function(){
  ctx.beginPath();
  var center = this.vertex;
  var ptv = sphereToRect(r, this.vertex.theta + delta.theta, this.vertex.phi);
  ptv = rotateAboutY(ptv.x, ptv.y, ptv.z, sphere_tau);


  var pt0 = sphereToRect(r, this.vertex.theta - this.deg/2 + delta.theta, this.vertex.phi - this.deg/2 );
  pt0 = rotateAboutY(pt0.x, pt0.y, pt0.z, sphere_tau);
  var pt1 = sphereToRect(r, this.vertex.theta + this.deg/2 + delta.theta, this.vertex.phi - this.deg/2 );
  pt1 = rotateAboutY(pt1.x, pt1.y, pt1.z, sphere_tau);
  var pt2 = sphereToRect(r, this.vertex.theta + this.deg/2 + delta.theta, this.vertex.phi + this.deg/2 );
  pt2 = rotateAboutY(pt2.x, pt2.y, pt2.z, sphere_tau);
  var pt3 = sphereToRect(r, this.vertex.theta - this.deg/2 + delta.theta, this.vertex.phi + this.deg/2 );
  pt3 = rotateAboutY(pt3.x, pt3.y, pt3.z, sphere_tau);

  ctx.moveTo(Math.round(pt0.x), Math.round(pt0.y));
  ctx.lineTo(Math.round(pt1.x), Math.round(pt1.y));
  ctx.lineTo(Math.round(pt2.x), Math.round(pt2.y));
  ctx.lineTo(Math.round(pt3.x), Math.round(pt3.y));

  //ctx.closePath();
  ctx.fillStyle = this.isInFront ? this.frontColor: this.rearColor;
  ctx.fill();
  //ctx.fillRect(pt0.x, pt0.y, 20, 20);
 }

}

function onMouseDown(ev){
 ev.preventDefault();
 isMouseDown = true;
 currentMouseCoords = getMouseCoords(ev);
 if (balls[0].isCaught && !menuState){
  balls[0].pitch();
 }
}
function onMouseUp(ev){
 ev.preventDefault();
 isMouseDown = false;
 if (!menuState){
  sphereVelocity.x = -(currentMouseCoords.x - lastMouseCoords.x)/mouseSensitivity;
  sphereVelocity.y = -(currentMouseCoords.y - lastMouseCoords.y)/mouseSensitivity;
 }
}
function onMouseMove(ev){
 ev.preventDefault();
 lastMouseCoords = currentMouseCoords;
 currentMouseCoords = getMouseCoords(ev);
 if (isMouseDown && !menuState ){
  delta.theta += -(currentMouseCoords.x - lastMouseCoords.x)/mouseSensitivity;

  //sphere_tau += (currentMouseCoords.y - lastMouseCoords.y)/mouseSensitivity; 
  /*
  if (sphere_tau > Math.PI*9/20 ) {
    sphere_tau = Math.PI*9/20;
  }
  else if (sphere_tau < -Math.PI*9/20){
    sphere_tau = -Math.PI*9/20;
  }
  */

 }
}

function menuclick(ev){
  if (menuState == true){
    menuState = false;
    if (!mobile){
     menu.style.top = cvs.height; //slide menu down;
    }
    else {
      menu.style.visibility = "hidden";
    } 
  }
}

function getMouseCoords(ev) { //returns coords relative to 0,0 of the canvas
        var x = ev.x;
        var y = ev.y;
        if (ev.x || ev.x == 0){                     //chrome
            x = ev.x;
            y = ev.y;
            x -= cvs.offsetLeft;
            y -= cvs.offsetTop;
        }
        else if (ev.layerX || ev.layerX == 0){      //Firefox
            x = ev.layerX;
            y = ev.layerY;
        }
        else if (ev.offsetX || ev.offsetX == 0){    //Opera
            x = ev.offsetX;
            y = ev.offsetY;
        }
        else if (ev.pageX || ev.pageX == 0){        //Safari i think
            x = ev.pageX;
            y = ev.pageY;
            if (!ev.changedTouches){     //differentiates between a touch object, and a touchEvent object.  Safari treats them different for some reason.
                y -= cvs.offsetTop;   //adjusts for having a scrolled window
                x -= cvs.offsetLeft;
            }            
        }
        else{                                       //Anything Else
            x = 0;
            y = 0;
        }
        return {x:x, y:y};
}
function randomRange(a,b){
 return Math.random() * ((a<b)?(b-a):(a-b)) + ((a<b)?a:b);
}

function reflect(N, V0){
  //reflects a vector V0 about a normal vector N.
  //vectors should be in cartesian coordinates
  var normalFactor = Math.sqrt(N.x*N.x + N.y*N.y + N.z*N.z)
  var scalar =  -2 * (N.x*V0.x/normalFactor + N.y*V0.y/normalFactor + N.z*V0.z/normalFactor)  ;
  var Vnew = {x:scalar*N.x/normalFactor + V0.x, 
              y:scalar*N.y/normalFactor + V0.y, 
              z:scalar*N.z/normalFactor + V0.z};
  return Vnew;
}

function Vibration(){
  this.magnitude = 0;
  this.last_magnitude = 0;
  this.vel = 0;
  this.accel = 0;
  this.k = 150; //spring constant
  this.c = 10; //damping constant
  this.m = 1; //mass
  this.update = function(){
    var time = tm.delta()/1000;
    this.last_magnitude = this.magnitude;
    this.accel = (-this.k*this.magnitude + -this.c*this.vel)/this.m;
    this.vel = this.vel + this.accel * time;
    this.magnitude = this.magnitude + this.vel * time;
    if (Math.abs(this.vel) <= 0.0001 && Math.abs(this.magnitude) > 0){
      this.vel = 0;
      this.magnitude = 0;
      this.accel = 0;
    }
  }

  this.shake = function(amplitude){
    this.vel += amplitude;

  }

}







