ft = 1;

function init(a, restart) {
	last = Date.now();
	cumulativeTime = 0;
	settings = {
		startTime:last,
		gravity:1,
		startRadius:110,
		baseRadius:110,
		scale:1,
		mobile:/Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		initTime:20,
		baseDistFromCenter:400,
		shakeMagnitude:20 * (window.devicePixelRatio ? window.devicePixelRatio : 1),
		baseIter:5
	};
	left = false;
	right = false;
	endCt = 0;
	score = 0;
    colors = ["#e74c3c", "#f1c40f", "#3498db"];
	shakes = [];
	gdx = 0;
	gdr = 0;
	gdy = 0;
	gameState = (restart ? 2 : 0);
	waveGen = new WaveGen();

	// only do if restarting the first time
	if (a) {
        document.ontouchstart = function(e){ 
            e.preventDefault(); 
        }
        
        window.ontouchstart = function(e){ 
            e.preventDefault(); 
        }

		if (settings.mobile) {
			document.getElementById('a').addEventListener('touchstart', function(){init(0, 1)})
		} else {
			document.getElementById('a').addEventListener('mousedown', function(){init(0, 1)})
		}

		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / framerate);
			};
		})();
		//rendering
		window.addEventListener('resize', scaleCanvas);
		canvas = document.getElementById('c');
		ctx = canvas.getContext('2d');

		//input
		if (!settings.mobile) {
			document.addEventListener('keydown', function(e) {
				if (e.keyCode == 13) {
					init(0, 1);
				} else {
					keys[e.keyCode] = 1;
				}
			});
		} else {
			document.addEventListener('touchstart', function(e) {
				if (gameState != 2) init(0, 1);
			});
		}

		window.addEventListener('blur', function(e) {
			for (var i = 0; i < keys.length; i++) {
				keys[i] = 0;
			}
		});

		window.addEventListener('blur', function(e) {
			for (var i = 0; i < keys.length; i++) {
				keys[i] = false;
			}
		});

		document.addEventListener('keyup', function(e) {
			keys[e.keyCode] = 0;
		});

		if (settings.mobile) {
			window.addEventListener("touchstart", function(e) {
				if (gameState == 2) {
					var cx = e.changedTouches[0].clientX;
					if(cx < trueCanvas.width/2){
						left = true;
					}
					if(cx > trueCanvas.width/2){
						right = true;
					}
				}
			});

			window.addEventListener("touchend", function(e) {
				left = false;
				right = false;

			});
		}
	}

	if (restart) {
		initText = 0;
		if (ft) initText = 200;
		if (!ft) blocks = [];
		document.getElementById('a').style.display = 'none';
		for (var i = 0; i < blocks.length; i++) {
			blocks[i].shouldDeleteSelf = 2 * settings.baseDistFromCenter; // covering all the bases
		}
		ft = 0;
	} else {
		blocks = [];
	}

	//rendering
	scaleCanvas();

	//input
	keys = [];

	// change later
	player1 = new Player({
		color:'#3498db'
	});

	// player2 = new Player({
	// 	angle:Math.PI,
	// 	keyBindings:[65, 68, 87], // a / d
	// 	color:'#e74c3c',
	// 	numBodies:1
	// });

	blocks.push();
}


init(1);
requestAnimFrame(animLoop);

function endGame() {
	gameState = 3;
}
