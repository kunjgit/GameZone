// kick animation using William Malone's code 
// http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/

// Copyright 2013 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 
(function() {
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



// stopping the oscillating indicators, recording values of indicators and keeping track of goals
var verticalBallStopped = false;
var horizontalBallStopped = false;
var powerBallStopped = false;
var x1, x2, x3;
var chanceCount = 0;
// recording the direction of the jump by the player, goal or not and the end co-ordinates of the ball
var direction;
var endTop = 440;
var endLeft = 390;
var score = 0;     
// variables to store user information
var thisName;
var thisTel;
var thisEmail;
var thisCity;

function kick(el, et) {
  
	var player,
		playerImage,
		canvas,
		isItOver;
		
	isItOver = false;

	function gameLoop () {
	  if (isItOver == false) {
	    window.requestAnimationFrame(gameLoop);

	    player.update();
	    player.render();
	  }
	}
	
	function sprite (options) {
	
		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;
		
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		
		that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

				    tickCount = 0;
				
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 2) {
                    // Go to the next frame
                    frameIndex += 1;
                }
                else if (frameIndex == numberOfFrames - 2) {
                    frameIndex += 1;
                    // start moving the ball
                    moveBall(el, et);
                    // make the goal keeper jump
                    keeperJump();
                }
                else if (frameIndex < numberOfFrames - 1) {
                    frameIndex += 1;
                }
                else {
                    // frameIndex = 0; // don't repeat the animation
                    isItOver = true;
                }
            }
        };
		
		that.render = function () {
		
		  // Clear the canvas
		  that.context.clearRect(0, 0, that.width, that.height);
		  
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    0,
		    0,
		    that.width / numberOfFrames,
		    that.height);
		};
		
		return that;
	}
	
	// Get canvas
	canvas = document.getElementById("kickAnimation");
	canvas.width = 150;
	canvas.height = 270;
	
	// Create sprite sheet
	playerImage = new Image();	
	
	// Create sprite
	player = sprite({
		context: canvas.getContext("2d"),
		width: 300,
		height: 270,
		image: playerImage,
		numberOfFrames: 2,
		ticksPerFrame: 20
	});
	
	// Load sprite sheet
	playerImage.addEventListener("load", gameLoop);
	playerImage.src = "img/slow-kick-right.png";
	
}

function keeperJump() {
                    var randomBinary = Math.floor(Math.random()*2);
                    var someTimeAfter = window.setTimeout(function() {
                      if ((randomBinary == 0) && (x3 >= 0.55)) {
                    document.getElementById('goal-keeper-state-1').style.display = "none";
                        document.getElementById('goal-keeper-state-2').style.display = "block";
                        direction = "left";
                      }
                      else if ((randomBinary == 1) && (x3 >= 0.55)) {
                    document.getElementById('goal-keeper-state-1').style.display = "none";
                        document.getElementById('goal-keeper-state-3').style.display = "block";
                        direction = "right";
                      }
                    }, 0);
}

function moveBall(el, et) {
  var path = "M " + "390" + "," + "440" + " "+ el + "," + et; // Ml Mt Ql Qt El Et " Q " + "460" + "," + "340" + 
	  pathAnimator = new PathAnimator( path ),	// initiate a new pathAnimator object
	  objToAnimate = document.getElementById('zee-ball'),	// The object that will move along the path
	  speed = 0.5,	 		// seconds that will take going through the whole path
	  reverse = false,	// go back of forward along the path
	  startOffset = 0		// between 0% to 100%
	  
  // start animating the ball
  pathAnimator.start( speed, step, reverse, startOffset, finish);

  // make the ball smaller in size with respect to the distance from the eye please!

  function step( point, angle ){
	  // do something every "frame" with: point.x, point.y & angle
	  objToAnimate.style.cssText = "top:" + point.y + "px;" +
								  "left:" + point.x + "px;" +
								  "transform:rotate("+ angle +"deg);" +
								  "-webkit-transform:rotate("+ angle +"deg);";
  }
  
  function finish(){
	  // see if the ball has reached the goal
	  if ((endTop >= 98)&&(endTop <= 292)&&(endLeft >= 114)&&(endLeft <= 710)) {
	    if ((direction == "right")&&(endLeft < 362)) {
	      // increase the score and indicate it on the score board
	      incrementScore();
	      if (chanceCount < 4) {modalElem5.setAttribute("class","modal active");}
	      else {
	        if (score > 4) {modalElem7.setAttribute("class","modal active");}
	        else {modalElem6.innerHTML = "You scored " + score + " goal(s) out of 5. Click to try again";
	              modalElem6.setAttribute("class","modal active");}
	      }
	    }
	    else if ((direction == "left")&&(endLeft >= 362)) {
	      // increase the score and indicate it on the score board
	      incrementScore();
	      if (chanceCount < 4) {modalElem5.setAttribute("class","modal active");}
	      else {
	        if (score > 4) {modalElem7.setAttribute("class","modal active");}
	        else {modalElem6.innerHTML = "You scored " + score + " goal(s) out of 5. Click to try again";
	              modalElem6.setAttribute("class","modal active");}
	      }
	    }
	    else {
	      if (chanceCount < 4) {modalElem4.setAttribute("class","modal active");}
	      else {
	        modalElem6.innerHTML = "You scored " + score + " goal(s) out of 5. Click to try again";
	        modalElem6.setAttribute("class","modal active");
	      }
	    }
	  }
	  else {
	      if (chanceCount < 4) {modalElem4.setAttribute("class","modal active");}
	      else {
	        modalElem6.innerHTML = "You scored " + score + " goal(s) out of 5. Click to try again";
	        modalElem6.setAttribute("class","modal active");
	      }
	  }
  }
}

// to osciallte the vertical direction indicator
function moveVerticalSmallBall() {
  var thing = document.getElementById('vertical-direction-indicator');
  if (thing.getAttribute('class') == "small-ball one-end") {
    thing.setAttribute('class','small-ball other-end');
  }
  else if (thing.getAttribute('class') == "small-ball other-end") {
    thing.setAttribute('class','small-ball one-end');
  }
}

var verticalIndicatorOscillate = window.setInterval(moveVerticalSmallBall, 320);

// to osciallte the horizontal direction indicator
function moveHorizontalSmallBall() {
  var thing = document.getElementById('horizontal-direction-indicator');
  if (thing.getAttribute('class') == "small-ball one-end") {
    thing.setAttribute('class','small-ball other-end');
  }
  else if (thing.getAttribute('class') == "small-ball other-end") {
    thing.setAttribute('class','small-ball one-end');
  }
}

var verticalIndicatorOscillate = window.setInterval(moveHorizontalSmallBall, 320);

// to osciallte the vertical direction indicator
function movePowerSmallBall() {
  var thing = document.getElementById('power-level-indicator');
  if (thing.getAttribute('class') == "small-ball one-end") {
    thing.setAttribute('class','small-ball other-end');
  }
  else if (thing.getAttribute('class') == "small-ball other-end") {
    thing.setAttribute('class','small-ball one-end');
  }
}

var powerLevelOscillate = window.setInterval(movePowerSmallBall, 320);

function refreshScene() {
  // stop the meters
  document.getElementById('vertical-direction-indicator').setAttribute('style','')
  document.getElementById('vertical-direction-indicator').setAttribute('class','small-ball one-end');
  document.getElementById('horizontal-direction-indicator').setAttribute('style','')
  document.getElementById('horizontal-direction-indicator').setAttribute('class','small-ball one-end');
  document.getElementById('power-level-indicator').setAttribute('style','')
  document.getElementById('power-level-indicator').setAttribute('class','small-ball one-end');
  verticalBallStopped = false;
  horizontalBallStopped = false;
  powerBallStopped = false;
  
  // stop the ball
  document.getElementById('zee-ball').setAttribute('style','')
  document.getElementById('zee-ball').setAttribute('class','');
  
  // clear the canvas or in other words, make the player vanish
  var contextForNow = document.getElementById('kickAnimation').getContext('2d');
  contextForNow.clearRect(0,0,150,270);
  
  // reset position of the goal keeper
  document.getElementById('goal-keeper-state-2').style.display = "none";
  document.getElementById('goal-keeper-state-3').style.display = "none";
  document.getElementById('goal-keeper-state-1').style.display = "block";
}

function stopVerticalBall() {
      var element = document.getElementById('vertical-direction-indicator'),
        style = window.getComputedStyle(element),
        top = style.getPropertyValue('top');
      x1 = parseInt(top.substring(0,3), 10);
      x1 = (459-x1)/117;
      console.log(x1);
      // fix the position of the small ball to wherever it is
      element.setAttribute("class", "small-ball");
      element.style.top = top;
      verticalBallStopped = true;
}

function stopHorizontalBall() {
      var element = document.getElementById('horizontal-direction-indicator'),
        style = window.getComputedStyle(element),
        left = style.getPropertyValue('left');
      x2 = parseInt(left.substring(0,3), 10);
      x2 = (x2-60)/119;
      console.log(x2);
      // fix the position of the small ball to wherever it is
      element.setAttribute("class", "small-ball");
      element.style.left = left;
      horizontalBallStopped = true;
}

function stopPowerBallAndKick() {
      // get position of the small ball
      var element = document.getElementById('power-level-indicator'),
        style = window.getComputedStyle(element),
        right = style.getPropertyValue('right');
      x3 = parseInt(right.substring(0,3), 10);
      x3 = (191-x3)/121;
      console.log(x3);
      
      // fix the position of the small ball to wherever it is
      element.setAttribute("class", "small-ball");
      element.style.right = right;
      powerBallStopped = true;
      
      // Calculate the ending position of the ball
      var Et, El, Qt, Ql;
      Et = 440 - ((0.8 + x1)/1.8)*x3*440 + 0.3*x3*((Math.abs(0.5-x2))/0.5)*440;
      var stringEt = Et.toString(10);
      El = 405 + x3*(x2-0.5)*810
      var stringEl = El.toString(10);
                      
      // ending co-ordinates of the ball
      endTop = Et;
      endLeft = El;
      
      // let the player kick the ball now!
      console.log(stringEl + " " + stringEt);
      kick(stringEl, stringEt)
}

function kickingProcess() {
    if ((verticalBallStopped == false) && (horizontalBallStopped == false) && (powerBallStopped == false)) {
      stopVerticalBall();
    }
    else if ((verticalBallStopped == true) && (horizontalBallStopped == false) && (powerBallStopped == false)) {
      stopHorizontalBall();
    }
    else if ((verticalBallStopped == true) && (horizontalBallStopped == true) && (powerBallStopped == false)) {
      stopPowerBallAndKick();
    }
    else if ((verticalBallStopped == true) && (horizontalBallStopped == true) && (powerBallStopped == true)) {
      if (chanceCount < 4) {
        chanceCount += 1;
      }
      else {
        chanceCount = 0;
        score = 0;
        document.getElementById('score-board').getElementsByTagName('li')[0].setAttribute('class', '');
        document.getElementById('score-board').getElementsByTagName('li')[1].setAttribute('class', '');
        document.getElementById('score-board').getElementsByTagName('li')[2].setAttribute('class', '');
        document.getElementById('score-board').getElementsByTagName('li')[3].setAttribute('class', '');
        document.getElementById('score-board').getElementsByTagName('li')[4].setAttribute('class', '');
      }
      modalElem4.setAttribute("class","modal");
      modalElem5.setAttribute("class","modal");
      modalElem6.setAttribute('class','modal');
      modalElem7.setAttribute('class','modal');
      refreshScene();
    }
}

function incrementScore() {
  if ((chanceCount == 0)) {
      document.getElementById('score-board').getElementsByTagName('li')[0].setAttribute('class', 'scored');
      score += 1;
  }
  else if ((chanceCount == 1)) {
      document.getElementById('score-board').getElementsByTagName('li')[1].setAttribute('class', 'scored');
      score += 1;
  }
  else if ((chanceCount == 2)) {
      document.getElementById('score-board').getElementsByTagName('li')[2].setAttribute('class', 'scored');
      score += 1;
  }
  else if ((chanceCount == 3)) {
      document.getElementById('score-board').getElementsByTagName('li')[3].setAttribute('class', 'scored');
      score += 1;
  }
  else if ((chanceCount == 4)) {
      document.getElementById('score-board').getElementsByTagName('li')[4].setAttribute('class', 'scored');
      score += 1;
  }
}

// =======================================================================================================

window.onclick = function() {
  kickingProcess();
}

// all the modals to be displayed
modalElem1 = document.getElementById('modal-1');
modalElem2 = document.getElementById('modal-2');
modalElem3 = document.getElementById('modal-3');
modalElem4 = document.getElementById('modal-4');
modalElem5 = document.getElementById('modal-5');
modalElem6 = document.getElementById('modal-6');
modalElem7 = document.getElementById('modal-7');
