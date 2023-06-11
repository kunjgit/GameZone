/******* INITIATE CANVAS *******/
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;
canvas.style.left = "0";
canvas.style.top = "0";
canvas.style.position = "fixed";
document.body.appendChild(canvas);


/******* SET SUPER IMPORTANT VARIABLES *******/

// Platform and browser related
var onMobile = false;
var lineDashSupported = false;
var synth = null;
var browserName = browserDetect();


// Touch control related
var hueUp = false;
var hueDown = false;
var saturationUp = false;
var saturationDown = false;
var lightnessUp = false;
var lightnessDown = false;

var isTapping = false;
var dragStartPos = {x: 0, y: 0};
var colorAreaInterval = canvas.width / 3;
var lastTap = null;
var keysDown = [];

// Fonts
var fontLargeTitle;
var fontSmallerTitle;
var fontRegular;
var fontSmallRegular;
var fontLargeTitleInterval;
var fontSmallerTitleInterval;
var fontRegularInterval;
var fontSmallRegularInterval;
var instructionsArr = ['Help Lucky cross the screen before time runs','out by matching the target color.','The closer you are the faster he goes!'];
var mobileInstructions = ['Swipe up and down in the marked color areas','to increase/decrease hue, lightness, saturation.'];

// Colors and patterns
var targetColor = {
	h: 0,
	s: 0,
	l: 0,
	lab: null
};
var playerColor = {
	h: 127,
	s: 100,
	l: 50
}
var patternsArr = ['circles','squares','vertbars','quadratic', 'lotus'];
var fadePattern = false;
var patternKind = 'squares';
var patternElementsArr = [];
var screenAlpha = 0;


// State and Score
var currentMode = 'main';
var finalScore = 0;
var stageResultsArr = [];
var stage = 1;

// Time related
var elapsedTime = 0;
var startTime = 0;
var totalTime = 0;
var timeLimit = 30;
var timeLeft = 30;
var modifier = 0;

var explosionParticlesArr = []; 



/******* SET FONTS AND PLATFORM VARIABLES! *******/
setFonts();
setPlatformVars();

/******* UTILITY FUNCTIONS *******/

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	window.setTimeout(callback, 1000 / 60);
	};
})();


function bindEvent(el, eventName, eventHandler) {
	if (el.addEventListener) {
		el.addEventListener(eventName, eventHandler, false); 
	} 
	else if (el.attachEvent) {
		el.attachEvent('on' + eventName, eventHandler);
	}
};

// Listen for orientation changes
bindEvent(window,"orientationchange", function() {
	setFonts();
}, false);

// Set platform variables
function setPlatformVars() {
	// If the orientation is set to an integer, assume player is on mobile.
	if (window.orientation >= 0) {
		onMobile = true;
		// Bind touch events.
		bindEvent(document.body,"touchstart", doTouchStart, false);
		bindEvent(document.body,"touchend", doTouchEnd, false);
		bindEvent(document.body,"touchmove", doTouchMove, false);

	}

	// Set other browser-specific variables
	if (browserName[0] !== 'MSIE') {
		// If on Chrome or Opera, use lineDash
		if (browserName[0] === 'Chrome' || browserName[0] === 'Opera') {
			lineDashSupported = true;
		}

		// If on any browser but IE, assume that it can play sound effects
		synth = new SfxrSynth();
		
		// State change sound
		stateChangeSound = new Audio();
		stateChangeSound.src = synth.getWave('2,,0.1173,,0.08,0.56,,0.32,,,,,,0.5406,,,,,0.4,,,0.1,,0.5');
		
		// Down sound
		shrinkingSound = new Audio();
	 	shrinkingSound.src = synth.getWave('2,0.27,1,,1,0.21,,0.06,,,,,,0.5092,,,,,1,,,,,0.6'); 
	 	
	 	// Up sound
	 	expandingSound = new Audio();
	 	expandingSound.src = synth.getWave('2,0.27,1,,1,0.24,,0.06,,,,,,0.5092,,,,,1,,,,,0.6'); 
	 	
	 	// Finished sound
	 	finishedSound = new Audio();
	 	finishedSound.src = synth.getWave('2,0.06,0.31,0.3329,0.4142,0.5103,,,,,,-0.26,0.5871,,,,,0.6799,0.77,,,,,0.5');

		// Time running out sound!
	 	tickSound = new Audio();
	 	tickSound.src = synth.getWave('1,,0.0249,0.03,0.155,0.37,,,,,,,,,,,0.36,0.26,0.16,-0.52,0.48,0.08,,0.27');

		// Lucky explosion sound
	 	explosionSound = new Audio();
	 	explosionSound.src = synth.getWave('3,,0.24,0.63,0.46,0.1408,,,,,,0.1399,,,,,0.2411,-0.1775,1,,,,,0.5');
	}
};


// Set fonts based on orientation
function setFonts() {
	if (window.orientation == 0 || window.orientation == 180 || window.orientation === undefined) {
        // Portrait or desktop
       	fontLargeTitle = 'bold 200px verdana';
       	fontLargeTitleInterval = 220;
       	fontSmallerTitle = 'bold 100px verdana';
       	fontSmallerTitleInterval = 110;
		fontRegular = '35px verdana';
		fontRegularInterval = 40;
		fontSmallRegular = '30px verdana';
		fontSmallRegularInterval = 35;
		fontCredit = '15px verdana';
		fontTiny = '15px verdana';
	} 
	else if (window.orientation == 90 || window.orientation == -90) {
		// Landscape, smaller due to smaller height allowance
		fontLargeTitle = 'bold 100px verdana';
		fontLargeTitleInterval = 110;
		fontSmallerTitle = 'bold 50px verdana';
		fontSmallerTitleInterval = 60;
		fontRegular = '30px verdana';
		fontRegularInterval = 30;
		fontSmallRegular = '25px verdana';
		fontSmallRegularInterval = 25;
		fontCredit = '15px verdana';
		fontTiny = '15px verdana';
	}
};


// Resize canvas
function resizeCanvas() {
	var widthChange = canvas.width - document.body.offsetWidth;
	canvas.width  = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;


	// Update Lucky's max speed based on new canvas size.
	if (lucky) {
		lucky.updateMaxSpeed();
		lucky.updatePos(lucky.pos.x - widthChange,canvas.height/2);
	}
};


// Check what browser player is using.
function browserDetect(){
	var N= navigator.appName, ua= navigator.userAgent, tem;
	var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
	return M;
};

// Get a random integer between two specified integers.
function randomFromTo(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
};

// Shuffle an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

/*****************************************/
/******* CAUTION: BRAIN PAIN AHEAD *******/

/* To score color accuracy properly we need to convert HSL to LAB and then get Delta-E by using CIE94 formula */
/* To do this we need to convert HSL to RGB to XYZ to LAB, then run CIE94 formula */

// Convert HSL to RGB
function hslToRgb(h, s, l){
    var r, g, b;
 
    if(s == 0){
        r = g = b = l; // achromatic
    }
    else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
 
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
 
    return [r * 255, g * 255, b * 255].map(Math.round);
};

// Convert RGB to XYZ
function rgbToXyz(r,g,b) {
	var _r = ( r / 255 );
	var _g = ( g / 255 );
	var _b = ( b / 255 );

	if ( _r > 0.04045 ) {
		_r = Math.pow(( ( _r + 0.055 ) / 1.055 ), 2.4);
	}
	else {
		_r = _r / 12.92;
	}

	if ( _g > 0.04045 ) {
		_g = Math.pow(( ( _g + 0.055 ) / 1.055 ), 2.4);
	}
	else {                 
		_g = _g / 12.92;
	}

	if ( _b > 0.04045 ) {
		_b = Math.pow(( ( _b + 0.055 ) / 1.055 ), 2.4);
	}
	else {                  
		_b = _b / 12.92;
	}

	_r = _r * 100;
	_g = _g * 100;
	_b = _b * 100;

	//Observer. = 2°, Illuminant = D65
	X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
	Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
	Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

	return [X, Y, Z];
};

// Convert XYZ to LAB
function xyzToLab(x, y, z) {
    var ref_X =  95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    var _X = x / ref_X;          //ref_X =  95.047   Observer= 2°, Illuminant= D65
    var _Y = y / ref_Y;          //ref_Y = 100.000
    var _Z = z / ref_Z;          //ref_Z = 108.883

    if ( _X > 0.008856 ) {

     	_X = Math.pow(_X, ( 1/3 ));
    }
    else {                 
    	_X = ( 7.787 * _X ) + ( 16 / 116 );
    }

    if ( _Y > 0.008856 ) {
    	_Y = Math.pow(_Y, ( 1/3 ));
    }
    else {
        _Y = ( 7.787 * _Y ) + ( 16 / 116 );
       }

    if ( _Z > 0.008856 ) {
    	_Z = Math.pow(_Z, ( 1/3 ));
    }
    else { 
    	_Z = ( 7.787 * _Z ) + ( 16 / 116 );
    }

    var CIE_L = ( 116 * _Y ) - 16;
    var CIE_a = 500 * ( _X - _Y );
    var CIE_b = 200 * ( _Y - _Z );

	return [CIE_L, CIE_a, CIE_b];
};

// Finally, use cie1994 to get delta-e using LAB
function cie1994(x, y, isTextiles) {
	var x = {l: x[0], a: x[1], b: x[2]};
	var y = {l: y[0], a: y[1], b: y[2]};
	labx = x;
	laby = y;
	var k2;
	var k1;
	var kl;
	var kh = 1;
	var kc = 1;
	if (isTextiles) {
		k2 = 0.014;
		k1 = 0.048;
		kl = 2;
	}
	else {
		k2 = 0.015;
		k1 = 0.045;
		kl = 1;
	}

	var c1 = Math.sqrt(x.a*x.a + x.b*x.b);
	var c2 = Math.sqrt(y.a*y.a + y.b*y.b);

	var sh = 1 + k2*c1;
	var sc = 1 + k1*c1;
	var sl = 1;

	var da = x.a - y.a;
	var db = x.b - y.b;
	var dc = c1 - c2;

	var dl = x.l - y.l;
	var dh = Math.sqrt(da*da + db * db - dc*dc);

	return Math.sqrt(Math.pow((dl/(kl*sl)),2) + Math.pow((dc/(kc*sc)),2) + Math.pow((dh/(kh*sh)),2));
}

/******* OK YOU CAN BREATHE NOW *******/
/*****************************************/


/***** KEYBOARD AND TOUCH EVENTS *******/

// Detect key down
bindEvent(window,'keydown', function (e) {
		keysDown[e.keyCode] = true;
}, false);

// Detect key up
bindEvent(window,'keyup', function (e) {
	delete keysDown[e.keyCode];
	// If synth exists, play color manipulation sounds
	if (synth) {
		if (e.keyCode === 81 || e.keyCode === 87 || e.keyCode === 69) {
			expandingSound.pause();
			expandingSound.currentTime = 0;
		}
		else if (e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) {
			shrinkingSound.pause();
			shrinkingSound.currentTime = 0;
		}
	}
	// Make sure colors remain within RGB limit.
	if (playerColor.h > 360) {
		playerColor.h = 360;
	}
	else if (playerColor.h < 0) {
		playerColor.h = 0;
	}

	if (playerColor.s > 100) {
		playerColor.s = 100;
	}
	else if (playerColor.h < 0) {
		playerColor.s = 0;
	}

	if (playerColor.l > 100) {
		playerColor.l = 100;
	}
	else if (playerColor.h < 0) {
		playerColor.l = 0;
	}
}, false);

// ENTER and SPACE functionality
document.body.onkeypress = function(e) {
	var key = (typeof e.which == "number") ? e.which : e.keyCode;
	
	// If player presses ENTER and is not mid-game, load appropriate state.
	if (key === 13 && currentMode !== 'main') {
		doNext();
	}

	// If player presses SPACE + color key simultaneously, 
	// increment/decrement relevant color by 1 (increasing precision)
	else if (key === 32) {
		document.body.onkeydown = function (f) {
			var key2 = (typeof f.which == "number") ? f.which : f.keyCode;
			if (key2 === 81 && playerColor.h < 360) {
				playerColor.h += 1;
			}
			else if (key2 === 65 && playerColor.h > 0) {
				playerColor.h -= 1;
			}

			if (key2 === 87 && playerColor.s < 100) {
				playerColor.s += 1;
			}
			else if (key2 === 83 && playerColor.s > 0) {
				playerColor.s -= 1;
			}

			if (key2 === 69 && playerColor.l < 100) {
				playerColor.l += 1;
			}
			else if (key2 === 68 && playerColor.l > 0) {
				playerColor.l -= 1;
			}
		}
	}
};

var latestTap = null;
function doTouchStart(event) {
	
	// Detect double-tap.
    var now = new Date().getTime();
	var timeSince = now - latestTap;

	// If double tap has been detected...
	if ((timeSince < 300) && (timeSince > 0)) {
		// ...and the player is not mid-game...
		if (currentMode !== 'main') {
			// ...switch to next game mode.
			doNext();
		}
	} 

	// If no double tap has been detected
	else {
		// Set initial start position.
		var pageX = event.changedTouches[0].pageX,
        	pageY = event.changedTouches[0].pageY;	

		isTapping = true;
		dragStartPos.x = pageX;
		dragStartPos.y = pageY;
	}

	latestTap = new Date().getTime(); 
};


// When the player releases the screen...
function doTouchEnd(event) { 
	// ...reset all the color movement and tap variables.
	isTapping = false;
	hueUp = false;
	hueDown = false;
	saturationUp = false;
	saturationDown = false;
	lightnessUp = false;
	lightnessDown = false;
};

// When the player is dragging...
function doTouchMove(event) { 
	event.preventDefault();
	// ...set current position of drag
 	var pageX = event.changedTouches[0].pageX,
        pageY = event.changedTouches[0].pageY;	

    // If the mouse is down...
	if (isTapping) { 

		// Check direction and position of drag
		if (dragStartPos.x <= colorAreaInterval * 1) {
			// Dragging hue up
			if (pageY < dragStartPos.y) {
			    hueUp = true;
			} 
			// Dragging hue down
			else {
			    hueDown = true;
			    hueUp = false;
			}
		}

		else if (dragStartPos.x > colorAreaInterval * 1 && dragStartPos.x <= colorAreaInterval * 2) {
			// Dragging saturation up
			if (pageY < dragStartPos.y) {
			    saturationUp = true;
			} 
			// Dragging saturation down
			else {
			    saturationDown = true;
			    saturationUp = false;
			}
		}

		else if (dragStartPos.x > colorAreaInterval * 2 && dragStartPos.x <= colorAreaInterval * 3) {
			// Dragging lightness up
			if (pageY < dragStartPos.y) {
			    lightnessUp = true;
			} 
			// Dragging lightness down
			else {
			    lightnessDown = true;
			    lightnessUp = false;
			}
		}
	} 
};




/******* MAIN UPDATE *******/

function update() {
	// Calculate elapsed time and time left
	elapsedTime = parseInt((new Date() - startTime) / 1000);
	var prevTimeLeft = timeLeft;
	timeLeft = timeLimit - elapsedTime;

	// Check current score
	checkScore();

	// If player is mid-game...
	if (currentMode === 'main') {
		// ...if time is short and synth is available, play ticking sound.
		if (timeLeft <= 10 && prevTimeLeft > timeLeft && synth) {
			tickSound.play();
		}

		// If time has run out...
		if (timeLeft <= 0) {
			// ...and if no explosion has been generated yet...
			if (explosionParticlesArr.length === 0) {
				// ...play explosion sound if synth exists.
				if (synth) {
					explosionSound.play();
				}

				// Generate explosion particles around Lucky.
				for (var angle=0; angle<360; angle += Math.round(360/10))
					{
						var particle = new explosionParticle();

						particle.pos.x = lucky.pos.x;
						particle.pos.y = lucky.pos.y;

						// Set a random radius for each particle
						particle.radius = randomFromTo(10, 35);

						// Set Lucky's velocity
						var speed = randomFromTo(150, 270);
						particle.velocity.x = speed * Math.cos(angle * Math.PI / 180.0);
						particle.velocity.y = speed * Math.sin(angle * Math.PI / 180.0);
					}

				}
				// Kill Lucky. Not so lucky now, are you?!
				lucky = null;
		}
	}

	// Fade screen
	if (fadePattern) {
		screenAlpha += 5 * modifier;
		if (screenAlpha >= 1) {
			fadePattern = false;
			updatePlayerPattern();
		}
	}

	else {
		if (screenAlpha > 0.05) {
			screenAlpha -= 5 * modifier;
		}
		else if (screenAlpha <= 0.05) {
			screenAlpha = 0;
		}
	} 

	// Respond to player actions
	checkControls();

};

function checkControls() {
	var speedH = 210;
	var speedSL = 50;
	// Increase HUE if SPACE is not being used for precision.
	if (81 in keysDown || hueUp) {
		if (playerColor.h < 360) {
			if (synth) {
				expandingSound.play();
			}

			if (!(32 in keysDown)) {
				playerColor.h += Math.round(speedH * modifier);
			}
		}
	}

	// Decrease HUE if SPACE is not being used for precision.
	else if (65 in keysDown || hueDown) {
		if (playerColor.h > 0) {
			if (synth) {
				shrinkingSound.play();
			}
			if (!(32 in keysDown)) {
				playerColor.h -= Math.round(speedH * modifier);
			}
		}
	}

	// Increase SATURATION if SPACE is not being used for precision.
	if (87 in keysDown || saturationUp) {
		if (playerColor.s < 100) {
			if (synth) {
				expandingSound.play();
			}
			if (!(32 in keysDown)) {
				playerColor.s += Math.round(speedSL * modifier);
			}
		}
		
	}

	// Decrease SATURATION if SPACE is not being used for precision.
	else if (83 in keysDown || saturationDown) {
		if (playerColor.s > 0) {
			if (synth) {
				shrinkingSound.play();
			}
			if (!(32 in keysDown)) {
				playerColor.s -= Math.round(speedSL * modifier);
			}
		}
	}

	// Increase LIGHTNESS if SPACE is not being used for precision.
	if (69 in keysDown || lightnessUp) {
		if (playerColor.l < 100) {
			if (synth) {
				expandingSound.play();
			}
			if (!(32 in keysDown)) {
				playerColor.l += Math.round(speedSL * modifier);
			}
		}
	}

	// Decrease LIGHTNESS if SPACE is not being used for precision.
	else if (68 in keysDown || lightnessDown) {
		if (playerColor.l > 0) {
			if (synth) {
				shrinkingSound.play();
			}

			if (!(32 in keysDown)) {
				playerColor.l -= Math.round(speedSL * modifier);
			}
		}
	}
};

// Check how the player is doing in current stage.
function checkScore() {
	var currentStageScore = 0;
	var rgb = hslToRgb(playerColor.h/360,playerColor.s/100,playerColor.l/100);
	var xyz = rgbToXyz(rgb[0],rgb[1],rgb[2]);
	var lab = xyzToLab(xyz[0],xyz[1],xyz[2]);
	var diff = cie1994(lab,targetColor.lab,false);
	currentStageScore = parseFloat((100 - diff).toFixed(2));
	stageResultsArr[stage - 1] = currentStageScore;
};




/******* DRAW STUFF! *******/

// Main draw function
function render() {
	// Clear screen
	ctx.clearRect ( 0 , 0 , canvas.width ,  canvas.height );

	// Draw player color/pattern
	drawPlayerColor();

	// Draw mode-specific elements
	switch (currentMode) {
		case 'main':
			drawTimeDots();
			drawStageCounter();
			drawPlayerColorScales();
			break;
		case 'menu':
			drawMenu();
			break;
		case 'results':
			drawResults();
			break;
	}

	// Draw touch guides if player is on mobile
	if (onMobile) {
		drawTouchGuides();
	}

	// Draw fade
	if (fadePattern) {
		ctx.fillStyle = 'rgba(255,255,255,' + screenAlpha + ')';
		ctx.fillRect(0,0,canvas.width, canvas.height);
	}
};

// Draw player color and pattern
function drawPlayerColor() {
	// Set fillStyle to player's RGB values
	ctx.save();
	ctx.fillStyle = 'hsl(' + playerColor.h + ',' + playerColor.s + '%,' + playerColor.l + '%)';
	// Draw relevant pattern
	switch (patternKind) {
		case 'circles':
			for (var i = 0; i < patternElementsArr.length; i++) {
				var element = patternElementsArr[i];
				ctx.beginPath();
				ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI, false);
				ctx.closePath()
				ctx.fill();
			}
		break;
		case 'squares':
			for (var i = 0; i < patternElementsArr.length; i++) {
				var element = patternElementsArr[i];
				ctx.fillRect(element.x, element.y, element.radius * 2, element.radius * 2);
			}
		break;
		case 'vertbars':
			for (var i = 0; i < patternElementsArr.length; i++) {
				var element = patternElementsArr[i];
				ctx.fillRect(element.x, element.y, element.size.x, element.size.y);
			}
		break;
		// 'lotus' and 'quadratic' patterns use the same logic:
		case 'lotus':
		case 'quadratic':
			for (var i = 0; i < patternElementsArr.length; i++) {
				var element = patternElementsArr[i];
				ctx.beginPath();
				ctx.lineWidth = 10;
				ctx.beginPath();
				ctx.moveTo(element.startPos.x, element.startPos.y);
				ctx.quadraticCurveTo(element.curve1ControlPoint.x, element.curve1ControlPoint.y, element.endPos.x, element.endPos.y);
				ctx.quadraticCurveTo(element.curve2ControlPoint.x, element.curve2ControlPoint.y, element.startPos.x, element.startPos.y); 
				ctx.closePath();
				ctx.fill();
			}
		break;
	}
	ctx.restore();
};


// Draw time 'dots' (or markers) at the top of the screen
function drawTimeDots() {
	var pos = {x: 5, y: 5};
	var size = {x: 15, y: 15};
	var color = "rgba(255, 255, 255, 0.5)";
	ctx.fillStyle = color;
	for (var i = 0; i < timeLeft; i++) {
		ctx.fillRect(pos.x, pos.y, size.x, size.y);
		if (pos.x >= canvas.width - size.x - 5) {
			pos.y += size.y * 2;
			pos.x = 5;
		}
		else {
			pos.x += size.x * 2;
		}
	}
};

// Draw stage counter markers.
function drawStageCounter() {
	var size = {x: 50, y: 50};
	var touchSpacing = 0;
	ctx.textBaseline = 'top';
	ctx.textAlign = 'center';

	// If the user is on mobile, these have to be drawn slightly higher to allow space for touch color markers.
	if (onMobile) {
		touchSpacing = 55;
	}
	var pos = {x: 5, y: canvas.height - size.y - 5 - touchSpacing};
	for (var i = 0; i < stageResultsArr.length; i++) {
		// Fill marker square.
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(pos.x, pos.y, size.x, size.y);
		// Draw results of previous stages on top of marker.
		ctx.fillStyle = '#555';
		ctx.font = fontTiny;
		if (i !== stage - 1) {
			ctx.fillText(stageResultsArr[i], pos.x + size.x / 2, pos.y);
		}
		pos.x += size.x + 10;
	}
};

// Draw hue, saturation, and lightness scales for visual reference
function drawPlayerColorScales() {
	var size = {x: 25, y: 360};
	var pos = {x: 0, y: 0};
	var scalesArr = [];
	var color = 'hsl(0,100%,100%)';

	size.y = 360;
	var interval = size.y / 360;
	if (!onMobile) {
		pos = {x: canvas.width - size.x * 3 - 5 * 3, y: canvas.height - size.y};
	}
	else {
		pos = {x: canvas.width - size.x * 3 - 5 * 3, y: 0};
	}

	// Draw HUE bar
	var gradient = ctx.createLinearGradient(pos.x + size.x,pos.y + size.y,pos.x, pos.y);
	for (var h = 0; h < 360; h += interval) {
		color = 'hsl('+h+',100%,50%)';
		gradient.addColorStop(h/360, color);
	}
	ctx.fillStyle = gradient;
	ctx.fillRect(pos.x, pos.y, size.x,size.y); 

	// Draw player's hue marker
	ctx.fillStyle = '#fff';
	var markerPos = {x: pos.x, y: pos.y + size.y - playerColor.h};
	ctx.fillRect(markerPos.x,markerPos.y,size.x,10);

	// Draw SATURATION bar
	size.y = 100;
	interval = size.y / 100;
	pos.x += size.x + 5;
	gradient = ctx.createLinearGradient(pos.x + size.x,pos.y + size.y,pos.x, pos.y);
	ctx.save();
	ctx.translate(0,pos.y - size.y + 100) ;
	ctx.scale(1,3.6) ;
	ctx.translate(0,-(pos.y - size.y + 100)) ;

	for (var s = 100; s > 0.1; s -= 0.1) {
		color = 'hsl('+playerColor.h+','+ s + '%,50%)';
		gradient.addColorStop(s / 100, color);
	}
	ctx.fillStyle = gradient;
	ctx.fillRect(pos.x, pos.y, size.x,size.y); 
	
	// Draw player's saturation marker
	ctx.fillStyle = '#fff';
	var markerPos = {x: pos.x, y: (pos.y + size.y) - playerColor.s * interval};
	ctx.fillRect(markerPos.x,markerPos.y,size.x,10 / 3.6);


	// Draw LIGHTNESS bar
	pos.x += size.x + 5;
	gradient = ctx.createLinearGradient(pos.x + size.x,pos.y + size.y,pos.x, pos.y);
	for (var l = 100; l > 0; l -= interval) {
		color = 'hsl('+playerColor.h+',50%,'+l + '%)';
		gradient.addColorStop(l/100, color);
	}
	ctx.fillStyle = gradient;
	ctx.fillRect(pos.x, pos.y, size.x,size.y); 

	// Draw player's lightness marker
	ctx.fillStyle = '#fff';
	var markerPos = {x: pos.x, y: (pos.y + size.y) - playerColor.l * interval};
	ctx.fillRect(markerPos.x,markerPos.y,size.x,10 / 3.6);

	ctx.restore();	
};

// Draw mobile touch color guides/areas. Lets player know where to drag for each color value.
function drawTouchGuides() {

	ctx.shadowBlur = 0;

	// Draw Hue touch area
	ctx.fillStyle = 'hsl(' + playerColor.h + ',50%,50%)';
	ctx.fillRect(0, canvas.height - 50, colorAreaInterval, 50);

	// Draw Saturation touch area
	ctx.fillStyle = 'hsl(' + playerColor.h + ',' + playerColor.s + '%,50%)';
	ctx.fillRect(colorAreaInterval, canvas.height - 50, colorAreaInterval, 50);

	// Draw Lightness touch area
	ctx.fillStyle = 'hsl(' + playerColor.h + ',50%,' + playerColor.l + ')';
	ctx.fillRect(colorAreaInterval * 2, canvas.height - 50, colorAreaInterval, 50);
	ctx.fillStyle = 'rgba(0,0,0,0.3)';

	// Draw vertical guides
	ctx.fillRect(colorAreaInterval,canvas.height - 300,2,300);
	ctx.fillRect(colorAreaInterval * 2,canvas.height - 300,2,300);

	// Draw text
	ctx.font = fontRegular;
	ctx.textAlign = 'center';
	var textPosX = colorAreaInterval / 2;
	ctx.fillText('HUE', textPosX, canvas.height - fontRegularInterval);
	textPosX += colorAreaInterval;
	ctx.fillText('SATURATION', textPosX, canvas.height - fontRegularInterval);
	textPosX += colorAreaInterval;
	ctx.fillText('LIGHTNESS', textPosX, canvas.height - fontRegularInterval);

};

// Menu time!
function drawMenu() {
	// We're about to get some instructions up in here.
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = '#fff';

	// Center that text!
	pos = {x: canvas.width / 2, y: 0};

	// Stroke it
	ctx.strokeStyle = '#333';
	ctx.lineWidth = 3;
	
	ctx.save();
	ctx.shadowBlur = 3;
	ctx.shadowColor = 'rgba(0,0,0,0.5)';
	ctx.font = fontLargeTitle;
    ctx.strokeText('TSVETT', pos.x, pos.y);
	ctx.fillText('TSVETT', pos.x, pos.y);
	ctx.font = fontRegular;
	pos.y += fontLargeTitleInterval;

	// Draw each line from array of instructions
	for (var i = 0; i < instructionsArr.length; i++) {
		var line = instructionsArr[i];
    	ctx.strokeText(line, pos.x, pos.y);

		ctx.fillText(line, pos.x, pos.y);
		pos.y += fontRegularInterval;
	}
	pos.y += fontRegularInterval / 2;
	pos.x -= (255 + 5 + 50 * 2) / 2;

	// Draw control scheme guides.
	if (!onMobile) {
		ctx.save();
		ctx.shadowBlur = 0;
		ctx.textBaseline = 'middle';
		ctx.lineWidth = 2;
		ctx.font = 'bold 25px verdana';
		ctx.strokeStyle = '#000';

		// A
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, 50, 50);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('A', pos.x + 25, pos.y + 25);

		pos.x += 55;
	
		// We're gonna draw the color bars using their native ranges and then stretch them to uniform size.
		var size = {x: 360, y: 50};
		var interval = size.x / 360;

		ctx.save();
		ctx.translate(pos.x - size.x + 360,0) ;
		ctx.scale(255/size.x,1) ;
		ctx.translate(-(pos.x - size.x + 360),0) ;

		// Draw HUE bar
		var gradient = ctx.createLinearGradient(pos.x,pos.y,pos.x + size.x, pos.y + size.y);
		for (var h = 0; h < 360; h += interval) {
			color = 'hsl('+h+',100%,50%)';
			gradient.addColorStop(h/360, color);
		}
		ctx.fillStyle = gradient;
		ctx.fillRect(pos.x, pos.y, size.x,size.y); 

		// Draw player's marker
		ctx.fillStyle = '#fff';
		var markerPos = {x: pos.x + playerColor.h, y: pos.y};
		ctx.fillRect(markerPos.x,markerPos.y,10,size.y);

		ctx.restore();
		pos.x -= 55;

		// S
		pos.y += 60;
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, 50, 50);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('S', pos.x + 25, pos.y + 25);

		// We're gonna draw the color bars using their native ranges and then stretch them to uniform size.
		pos.x += 55;
		size = {x: 100, y: 50};
		interval = size.y / 360;

		ctx.save();
		ctx.translate(pos.x - size.x + 100,0) ;
		ctx.scale(255/size.x,1) ;
		ctx.translate(-(pos.x - size.x + 100),0) ;

		// Draw SATURATION bar
		gradient = ctx.createLinearGradient(pos.x,pos.y,pos.x + size.x, pos.y + size.y);
		for (var s = 0; s < 100; s += interval) {
			color = 'hsl('+playerColor.h+','+ s + '%,50%)';
			gradient.addColorStop(s/100, color);
		}
		ctx.fillStyle = gradient;
		ctx.fillRect(pos.x, pos.y, size.x,size.y); 

		// Draw player's marker
		ctx.fillStyle = '#fff';
		var markerPos = {x: pos.x + playerColor.s, y: pos.y};
		ctx.fillRect(markerPos.x,markerPos.y,255/size.x,size.y);

		ctx.restore();	
		pos.x -= 55;

		// D
		pos.y += 60;
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, 50, 50);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('D', pos.x + 25, pos.y + 25);

		// We're gonna draw the color bars using their native ranges and then stretch them to uniform size.
		pos.x += 55;
		size = {x: 100, y: 50};
		interval = size.y / 360;

		ctx.save();
		ctx.translate(pos.x - size.x + 100,0) ;
		ctx.scale(255/size.x,1) ;
		ctx.translate(-(pos.x - size.x + 100),0) ;

		// Draw LIGHTNESS bar
		gradient = ctx.createLinearGradient(pos.x,pos.y,pos.x + size.x, pos.y + size.y);
		for (var l = 0; l < 100; l += interval) {
		color = 'hsl('+playerColor.h+',50%,'+l + '%)';
			gradient.addColorStop(l/100, color);
		}
		ctx.fillStyle = gradient;
		ctx.fillRect(pos.x, pos.y, size.x,size.y); 

		// Draw player's marker
		ctx.fillStyle = '#fff';
		var markerPos = {x: pos.x + playerColor.l, y: pos.y};
		ctx.fillRect(markerPos.x,markerPos.y,255/size.x,size.y);

		ctx.restore();	

		pos.x -= 55;

		// Q
		pos.y -= 60 * 2;
		pos.x += 315;
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, 50, 50);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('Q', pos.x + 25, pos.y + 25);

		// W
		pos.y += 60;
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, 50, 50);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('W', pos.x + 25, pos.y + 25);

		// E
		pos.y += 60;
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, 50, 50);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('E', pos.x + 25, pos.y + 25);

		pos.x = canvas.width / 2;
		pos.y += 60;
		ctx.beginPath();
		ctx.rect(pos.x - 250, pos.y, 500, 30);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.fillText('Hold SPACE to increase precision', pos.x, pos.y + 15);
		ctx.restore();
		pos.y += 50;
	    ctx.strokeText('ENTER TO START', pos.x, pos.y);
		ctx.fillText('ENTER TO START', pos.x, pos.y);
		ctx.restore();
	}

	// Uh oh, we're mobilizing.
	else {
		// Save that context!
		ctx.save();
		pos.y += 5;
		pos.x = canvas.width / 2;
		ctx.fillStyle='#fff';

		// We're gonna draw some lines to show people EXACTLY where to drag.
		drawInstructionArrows(canvas.width / 2, pos.y + 35);

		// This is a little box that surrounds the control scheme. It needs to resize based on orientation/font size, which is why "boxHeight" varies
		var boxHeight = fontSmallRegularInterval * mobileInstructions.length + 3;
		ctx.fillRect(pos.x - 375, pos.y, 750, boxHeight);
		pos.y += 15;

		// We need to go deeper!
		ctx.save();
		ctx.fillStyle = '#000';
		ctx.shadowBlur = 0;
		ctx.textBaseline = 'middle';
		ctx.font = fontSmallRegular;
		// Draw the mobile instruction text.
		for (var i = 0; i < mobileInstructions.length; i++) {
			var line = mobileInstructions[i];
			ctx.fillText(line,pos.x,pos.y);
			pos.y += fontSmallRegularInterval;
		}
		ctx.restore();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000';

		pos.y += 50;

		// LOUD NOISES
	    ctx.strokeText('DOUBLE-TAP TO START', pos.x, pos.y);
		ctx.fillText('DOUBLE-TAP TO START', pos.x, pos.y);

		// We need a kick!
		ctx.restore();
	}
	pos.y += 50;
	ctx.font = fontCredit;
	ctx.fillStyle = '#000';
	ctx.fillText('For GSSOC', pos.x, pos.y);
};

// These are the awesome lines that show people where to drag their fingers.
function drawInstructionArrows(endX,endY) {
	ctx.lineWidth = 5;

	// Hue guide
	ctx.strokeStyle = '#ff0000';
	ctx.beginPath();
	ctx.moveTo(colorAreaInterval / 2, canvas.height);
	ctx.lineTo(colorAreaInterval / 2, endY);
	ctx.lineTo(endX,endY);
	ctx.stroke();

	// Saturation guide
	ctx.strokeStyle = '#00ff00';
	ctx.beginPath();
	ctx.moveTo(colorAreaInterval * 2 - colorAreaInterval / 2, canvas.height);
	ctx.lineTo(colorAreaInterval * 2 - colorAreaInterval / 2, endY);
	ctx.stroke();

	// Lightness guide
	ctx.strokeStyle = '#0000ff';
	ctx.beginPath();
	ctx.moveTo(colorAreaInterval * 3 - colorAreaInterval / 2, canvas.height);
	ctx.lineTo(colorAreaInterval * 3 - colorAreaInterval / 2, endY);
	ctx.lineTo(endX,endY);
	ctx.stroke();
};

// Gotta draw the results screen! (We're almost there)
function drawResults() {
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = '#fff';

	// Center and stroke it again.
	var pos = {x: canvas.width / 2, y: 10};

	ctx.strokeStyle = '#333';
	ctx.lineWidth = 3;
	
	ctx.save();
	ctx.shadowBlur = 3;
	ctx.shadowColor = 'rgba(0,0,0,0.5)';
	ctx.font = fontSmallerTitle;
    ctx.strokeText('GAME OVER', pos.x, pos.y);
	ctx.fillText('GAME OVER', pos.x, pos.y);
	ctx.font = fontRegular;

	pos.y += fontSmallerTitleInterval;
	pos.x = canvas.width / 2;

	ctx.save();
	ctx.shadowBlur = 0;
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 2;
	ctx.beginPath();
	var boxHeight = fontSmallRegularInterval * 3 + 3;
	ctx.rect(pos.x - 250, pos.y, 500, boxHeight);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.stroke();


	ctx.fillStyle = '#000';
	ctx.font = fontSmallRegular;
	ctx.fillText('You kept Lucky alive through',pos.x,pos.y);
	pos.y += fontSmallRegularInterval;
	ctx.fillText((stage - 1)  + ' stages and ' + totalTime + ' seconds', pos.x,pos.y);
	pos.y += fontSmallRegularInterval;
	ctx.fillText('with an accuracy of ' + finalScore + '%!',pos.x,pos.y);

	ctx.restore();
	pos.y += 50;
	if (!onMobile) {
	    ctx.strokeText('Press ENTER to play again', pos.x, pos.y);
		ctx.fillText('Press ENTER to play again', pos.x, pos.y);
	}
	// Fancy mobiles need different instructions
	else {
	    ctx.strokeText('Double-tap to play again', pos.x, pos.y);
		ctx.fillText('Double-tap to play again', pos.x, pos.y);
	}
	pos.y += 50;
	ctx.font = fontCredit;
	ctx.fillStyle = '#000';
	ctx.fillText('For GSSOC', pos.x, pos.y);
	ctx.restore();
};



/******* COLOR AND PATTERN RELATED *******/

// Generate a random target color
function setTargetColor() {
	// Select random hue
	var newTargetH = randomFromTo(0,360);
	// If the newly selected hue is too close to the existing targetColor hue, select new hue.
	while (newTargetH < targetColor.h + 10 && newTargetH > targetColor.h - 10) {
		newTargetH = randomFromTo(0,360);
	}
	// Set targetColor.h to new hue.
	targetColor.h = newTargetH;

	// Constrain saturation and lightness to produce more pleasing/interesting colors.
	targetColor.s = randomFromTo(20,100);
	targetColor.l = randomFromTo(20,70);

	// Convert targetColor to RGB > XYZ > LAB
	var rgb = hslToRgb(targetColor.h/360,targetColor.s/100,targetColor.l/100);
	var xyz = rgbToXyz(rgb[0],rgb[1],rgb[2]);
	targetColor.lab = xyzToLab(xyz[0],xyz[1],xyz[2]);

	// Set background color of <body> tag to target color.
	document.body.style.backgroundColor='hsl(' + targetColor.h + ',' + targetColor.s + '%,' + targetColor.l + '%)';

};

// Randomly decide what pattern to display
function updatePlayerPattern() {
	// Empty array of pattern Elements
	patternElementsArr.length = 0;
	// Shuffle array and pick the first element in it
	patternsArr = shuffleArray(patternsArr);
	patternKind = patternsArr[0];

	// Here is where we randomly decide min and max radius, positions, etc etc.
	var minRadius = null;
	var maxRadius = null;
	switch (patternKind) {
		case 'squares':
		case 'circles':
			var quantity = randomFromTo(5,70);
			var radius = 0;
			var x = 0;
			var y = 0;
			if (quantity <= 15) {
				minRadius = 15;
				maxRadius = 150;
			}
			else {
				minRadius = 5;
				maxRadius = 90;
			}
			for (var i = 0; i < quantity; i++) {
				radius = randomFromTo(minRadius,maxRadius);
				x = randomFromTo(0,canvas.width);
				y = randomFromTo(0,canvas.height);
				// Push element onto array of elements
				patternElementsArr.push({x: x, y: y, radius: radius});
			}
		break;
		// Vertical barring it
		case 'vertbars':
			var size = {x: 25, y: 0};
			var quantity = canvas.width / size.x;
			var x = 0;
			var y = 0;
			for (var i = 0; i < quantity; i++) {
				size.y = randomFromTo(10,canvas.height);
				x += size.x;
				y = 0;
				// Push element onto array of elements
				patternElementsArr.push({x: x, y: y, size: {x: size.x, y: size.y}});
			}
		break;
		case 'quadratic':
			var startPos = {x: 0, y: 0};
			var endPos = {x: 0, y: 0};
			var curve1ControlPoint = {x: 0, y: 0};
			var curve2ControlPoint = {x: 0, y: 0};
			var quantity = randomFromTo(1,5);

			for (var i = 0; i < quantity; i++) {
				startPos.x = randomFromTo(0,100);

				startPos.y = randomFromTo(0,canvas.height);
				endPos.x = randomFromTo(canvas.width - 100, canvas.width);
				endPos.y = randomFromTo(0, canvas.height);
				curve1ControlPoint.x = randomFromTo(0,canvas.width);
				curve1ControlPoint.y = randomFromTo(0,canvas.height);
				curve2ControlPoint.x = randomFromTo(0,canvas.width);
				curve2ControlPoint.y = randomFromTo(0,canvas.height);

				// Push element onto array of pattern elements
				patternElementsArr.push({startPos: {x: startPos.x, y: startPos.y}, endPos: {x: endPos.x, y: endPos.y}, curve1ControlPoint: {x: curve1ControlPoint.x, y: curve1ControlPoint.y}, curve2ControlPoint: {x: curve2ControlPoint.x, y: curve2ControlPoint.y}});
			}
			break;
		case 'lotus':
			var startPos = {x: 0, y: 0};
			var endPos = {x: 0, y: 0};
			var curve1ControlPoint = {x: 0, y: 0};
			var curve2ControlPoint = {x: 0, y: 0};
			var quantity = randomFromTo(5,10);

			startPos.x = canvas.width / 2;
			startPos.y = canvas.height;
			
			var controlPoint = {x: 0, y: canvas.height - 100};
			var curveSize = randomFromTo(50, 300);
			var interval = canvas.width / quantity;
			endPos.x = interval;
			for (var i = 0; i < quantity; i++) {
				endPos.y = randomFromTo(0,50);
				curve1ControlPoint.x = controlPoint.x;
				curve1ControlPoint.y = controlPoint.y;
				curve2ControlPoint.x = controlPoint.x + curveSize;
				curve2ControlPoint.y = controlPoint.y - 20;
		
				endPos.x += interval;
				controlPoint.x += interval;
				// Push element onto array of elements
				patternElementsArr.push({startPos: {x: startPos.x, y: startPos.y}, endPos: {x: endPos.x, y: endPos.y}, curve1ControlPoint: {x: curve1ControlPoint.x, y: curve1ControlPoint.y}, curve2ControlPoint: {x: curve2ControlPoint.x, y: curve2ControlPoint.y}});
			}
			break;
	}

};

// Transition to a new color.
function transitionColor(currentColor,targetColor,speed,alpha) {
	if (!speed) {
		var speed = 0;
		if (!alpha) {
			speed = 5;
		}
		else {
			speed = 0.05;
		}
	}
	if (currentColor > targetColor) {
		currentColor -= speed;
	}
	else if (currentColor < targetColor) {
		currentColor += speed;
	}
	return currentColor;
};


/******* LUCKY!!! *******/

function Lucky() {
	this.speed = 0;
	this.maxSpeed = 0;
	this.radius = 45;
	this.color = '#000';
	this.pos = {x: 0, y: canvas.height / 2};
	this.eyePos = {x: this.pos.x + 35, y: this.pos.y - this.radius * 2};
	this.baseline = canvas.height / 2;
	this.bouncingUp = true;
	this.bounceHeight = 50;

	// Update Lucky
	this.update = function() {
		var stageScore = stageResultsArr[stage - 1];
		this.speed = this.maxSpeed * stageScore / 100;
		if (stageScore > 95) {
			this.speed = this.maxSpeed * 2 * stageScore / 100;
		}
		else if (stageScore < 50) {
			this.speed = this.maxSpeed / 2 * stageScore / 100;
		}
		this.pos.x += this.speed * modifier;
		this.eyePos.x += this.speed * modifier;

		if (this.pos.x >= canvas.width + this.radius) {
			if (currentMode === 'main') {

				doNext();
			}
			else {
				this.updatePos(0,canvas.height/2);
			}
		}
		

		// Bounce Lucky!
		var maxHeight = this.baseline - this.bounceHeight;
		if (this.bouncingUp) {
			this.pos.y -= this.speed * modifier;
			this.eyePos.y -= this.speed / 2 * modifier;
			if (this.pos.y <= maxHeight) {
				this.bouncingUp = false;
			}
		}
		else {
			this.pos.y += this.speed * modifier; 
			this.eyePos.y += this.speed / 2 * modifier;
			if (this.pos.y >= this.baseline) {
				this.bouncingUp = true;
			}
		}
		this.draw();
	};

	// Draw Lucky
	this.draw = function() {
		if (currentMode === 'main') {
			// Draw ground, dash it if dash is supported
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#000';
			if (lineDashSupported) {
		    	ctx.setLineDash([15]);
		    }
			ctx.beginPath();
			ctx.moveTo(0,canvas.height / 2 + this.radius / 1.5);
			ctx.lineTo(canvas.width, canvas.height / 2 + this.radius / 1.5);
			ctx.stroke();
		}


		// Draw Lucky's hot bod
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0.7 * Math.PI, 0.3 * Math.PI, false);
		ctx.closePath();
		ctx.fill();

		// What big eyes he has. Draw the heck out of them.
		ctx.beginPath();
		ctx.arc(this.eyePos.x, this.eyePos.y, this.radius / 3, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();

		// Draw antennae, dash them if line dash is supported
		if (lineDashSupported) {
	    	ctx.setLineDash([3]);
	    }

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.moveTo(this.pos.x + 15, this.pos.y);
		ctx.quadraticCurveTo(this.pos.x - 15, this.pos.y - this.radius - 10, this.eyePos.x, this.eyePos.y);
		ctx.lineWidth = 3;
		ctx.stroke();

		if (lineDashSupported) {
			ctx.setLineDash([0]);
		}

		// Lucky has expressions. Draw them! Draw them now!!!
		var stageScore = stageResultsArr[stage - 1];

		// Draw expressive eyeball and mouthball.
		ctx.fillStyle = '#ccc';
		ctx.beginPath();

		// Happy
		if (stageScore >= 85) {

			// Eyeball
			ctx.arc(this.eyePos.x, this.eyePos.y, this.radius / 3.5, 0, 1 * Math.PI, true);
			ctx.closePath();
			ctx.fill();

			// Mouth
			ctx.beginPath();
			ctx.fillStyle = '#ccc';
			ctx.lineWidth = 2;
			ctx.arc(this.pos.x + this.radius / 2, this.pos.y, this.radius / 2, 0, 1 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
		}

		// Slightly surprise/worried
		else if (stageScore < 85 && stageScore > 60) {
			// Eyeball
			ctx.arc(this.eyePos.x, this.eyePos.y, this.radius / 3.5, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();

			// Pupil
			ctx.fillStyle = '#000';
			ctx.beginPath();
			ctx.arc(this.eyePos.x, this.eyePos.y, this.radius / 7, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();

			// Mouth
			ctx.beginPath();
			ctx.fillStyle = '#ccc';
			ctx.lineWidth = 2;
			ctx.arc(this.pos.x + this.radius / 2, this.pos.y, this.radius / 5, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
		}

		// WE'RE ALL GONNA DIE (This is his "things are going very badly" expression)
		else {
			// Eyeball
			ctx.arc(this.eyePos.x, this.eyePos.y, this.radius / 3.5, 0.7 * Math.PI, 1.9 * Math.PI, false);
			ctx.fill();

			// Mouth
			ctx.beginPath();
			ctx.fillStyle = '#ccc';
			ctx.lineWidth = 2;
			ctx.arc(this.pos.x + this.radius / 2, this.pos.y + 5, this.radius / 2, 0, 1 * Math.PI, true);
			ctx.closePath();
			ctx.fill();
		}
	};	

	// Move, dude!
	this.updatePos = function(x,y) {
		if (x >= 0) {
			this.pos.x = x;
		}
		if (y >= 0) {
			this.pos.y = y;
			this.baseline = y;
		}

		this.eyePos = {x: this.pos.x + 35, y: this.pos.y - this.radius * 2};
	};

	// Update Lucky's maximum speed (based on canvas size)
	this.updateMaxSpeed = function() {
		this.maxSpeed = canvas.width / 7;
	};
};


/******* EXPLOSION *******/


function explosionParticle() {
	this.pos = {x: 0, y: 0};
	this.velocity = {x: 0, y: 0};
	this.radius = 20;
	this.color = "#000";
	this.speed = 50;
	this.scaleSpeed = 50
	this.direction = {x: null, y: null};
	this.destinationPos = {x: 0, y: 0};

	explosionParticlesArr.push(this);

	this.removeFromArray = function(object,array) {
		var index = array.indexOf(object);
		array.splice(index, 1);
	};

	this.update = function()
	{
		// shrinking
		this.radius -= this.scaleSpeed * modifier;

		if (this.radius <= 2)
		{
			this.removeFromArray(this,explosionParticlesArr);
			if (explosionParticlesArr.length <= 0) {
				gameOver();
			}
		}
		this.pos.x += this.velocity.x * modifier;
		this.pos.y += this.velocity.y * modifier;
		this.draw();

	};

	this.draw = function() {
		// translating the 2D context to the particle coordinates
		ctx.save();	
		if (this.radius > 0) {	
			ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, true);
			ctx.closePath();

			ctx.fillStyle = this.color;
			ctx.fill();
		}
		ctx.restore();
	};
} 

/******* STATE FUNCTIONS *******/

function doNext() {
	// Start fading screen
	fadePattern = true;
	if (synth) {
		stateChangeSound.play();
	}
	// Change state based on mode
	switch(currentMode) {
		case 'menu':
			currentMode = 'main';			
			reset();
			break;
		case 'main':
			lucky.updatePos(0,canvas.height / 2);

			// If player got 100% accuracy on previous stage...
			if (stageResultsArr[stage - 1] === 100) {
				// ...double the time limit.
				timeLimit *= 2;
			} 

			// Otherwise if accuracy for last stage was > 91%
			else if (stageResultsArr[stage - 1] > 91) {
				// Calculate bonus time based on accuracy
				var bonusMultiplier = 0;
				if (timeLeft > 10) {
					bonusMultiplier = 2;
				}
				else if (timeLeft > 5) {
					bonusMultiplier = 10;
				}
				else {
					bonusMultiplier = 15;
				}
				var bonusPercentage =  bonusMultiplier * (10 - (100 - stageResultsArr[stage-1]));
				var bonusTime = timeLeft * bonusPercentage / 100;
				timeLimit += bonusTime;
			}
			// Increment stage
			stage++;
			// Set a new target color
			setTargetColor();
			break;
		case 'results':
			currentMode = 'menu';
			reset();
			break;
	}
};

// End the game
function gameOver() {
	// Set total time
	totalTime = elapsedTime;

	// Calculate final score by adding up all stage scores and getting average
	var totalScore = 0;
	for (var i = 0; i < stageResultsArr.length - 1; i++) {
		totalScore += stageResultsArr[i];
	}
	var score = totalScore / (stageResultsArr.length - 1);
	finalScore = score.toFixed(2);

	// Play finish sound if synth exists.
	if (synth) {
		finishedSound.play();
	}

	// Update mode to Result screen and reset.
	currentMode = 'results';
	reset();
};


// Reset game
function reset() {
	// Create new instance of lucky and calc his maximum speed
	lucky = new Lucky();
	lucky.updateMaxSpeed();

	elapsedTime = 0;

	// If player is entering game...
	if (currentMode === 'main') {
		// ...move Lucky to appropriate position.
		lucky.updatePos(0,canvas.height/2);
		// ...update start time and reset elapsed time counter.
		startTime = new Date();
		elapsedTime = 0;
	}

	// If player is entering menu screen, update Lucky's position.
	else if (currentMode === 'menu') {
		stageResultsArr.length = 0;
		lucky.updatePos(0, canvas.height/2);
		startTime = 0;
		totalTime = 0;
		timeLimit = 30;
		timeLeft = 30;
	}

	// If player is entering Results screen, destroy Lucky.
	else if (currentMode === 'results') {
		lucky = null;
	}

	// If player is on any screen EXCEPT Results...
	if (currentMode !== 'results') {
		// ...reset Stage counter
		stage = 1;
		// ...empty array of scores
		stageResultsArr.length = 0;
		// ...reset target color and on-screen pattern
		setTargetColor();
		updatePlayerPattern();
	}
};

// Game loop
function main() {
	var now = Date.now();
	var delta = now - then;
	window.requestAnimFrame(main);
	modifier = delta/1000;
	update();
	render();
	if (lucky) {
		lucky.update();
	}
	for (var i = 0; i < explosionParticlesArr.length; i++) {
		var particle = explosionParticlesArr[i];
		particle.update();
	}
	then = now;
};


// Play
currentMode = 'menu';
playerColor.h = randomFromTo(5,360);
playerColor.s = randomFromTo(50,100);
playerColor.l = randomFromTo(20,80);
reset();

var then = Date.now();
resizeCanvas();
window.requestAnimFrame(main);
bindEvent(window,'resize', resizeCanvas, false);
