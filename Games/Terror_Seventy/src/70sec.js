/*!
 * 70 seconds of terror
 * Landing a spacecraft on the surface of Mars.
 * @author Leandro Linares
 * Code built for the [js13kgames competition](http://js13kgames.com) on august-september 2012.
 * The name of the game comes from the original NASA mission called "Curiosity's Seven Minutes of Terror".
 * See this video for details: http://youtu.be/ISmWAyQxqqs
 * Check out this infography: http://www.jpl.nasa.gov/infographics/uploads/infographics/10776.jpg
 */
(function (win) {
	'use strict';

	/**
	 * Helpers
	 */
	// Fast reference to Document object
	var doc = win.document,
		// Alias
		addClass = function (el, name) { el.classList.add(name); },
		remClass = function (el, name) { el.classList.remove(name); },
		show = function (el) { remClass(el, 'h'); },
		hide = function (el) { addClass(el, 'h'); },
		Img = function (url) {
			var i = new win.Image();
			i.src = url;
			return i;
		},
		// Games references
		canvasGame,
		DOMgame,
		// Allow to restart the game on canvasGame the second time
		newbie = true,
		// Grab the size of screen
		viewportWidth = 900,
		viewportHeight = 400,
		// Reference to all manipulable DOM elements
		DOM = (function () {
			var r = [];

			['main', 'reason', 'play', 'DOMgame', 'curiosity', 'canvasGame', 'canvas', 'landing', 'panel', 'time', 'message', 'action'].forEach(function (e) { r[e] = doc.getElementById(e); });

			return r;
		}()),
		// RequestAnimationFrame
		rAF = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame,

	/**
	 * Cross-game members
	 */
		// Change/delete content of message DOM element
		updateMessage = function (text) {
			DOM.message.textContent = text || '';
		},
		// Interval to calculate the remaining time
		timer,
		// Show the END screen and reset DOM structure
		endGame = function (reason) {
			// Kill the global countdown interval
			win.clearInterval(timer);
			// Clean the scene container classnames and hide
			DOM.DOMgame.className = 'h';
			// Hide ALL unnescesary elements
			hide(DOM.panel);
			hide(DOM.canvasGame);
			// Update title on screen
			DOM.reason.textContent = reason;
			// Show the END screen
			show(DOM.main);
		},
		// Remaining time to acomplish the mission
		countdown;

	/**
	 * Inits the countdown
	 */
	function setTimer(seconds) {
		// Hide the previous screens
		hide(DOM.main);
		// Set the countdown value and reference on screen (DOM Element)
		countdown = DOM.time.textContent = seconds;
		// Init the time update
		timer = win.setInterval(function () {
			// Update the reference of time (variable)
			countdown -= 1;
			// Update the reference on screen (DOM Element)
			// Add zero to get: ...11, 10, 09, 08...
			DOM.time.textContent = (countdown > 9) ? countdown : '0' + countdown;
			// Trigger the dom game tick to check stages
			DOMgame.tick();
			// End game when time ends
			if (!countdown) {
				endGame('Time\'s up');
			}
		}, 1000);
		// Show the controls
		show(DOM.panel);
	}

	/**
	 * CANVAS GAME
	 */
	(function () {
		/**
		 * Properties
		 */
		// Get the context of canvas
		var ctx = DOM.canvas.getContext('2d'),
			// Determines when the user can move the spacecraft
			manual = true,
			// This will count holding time when skycrane be flying into landing area
			holdingTimer,
			// Flag to control when timer have to initialize
			landing = false,
			// Define a limit where the spacecraft crashes (90% until bottom)
			ground = 360,
			// Spacecraft to be controlled by user
			crane = {
				'image': new Img('svg/skycrane_sd.svg'),
				'width': 40,
				'height': 20
			},
			// Rockets turned on when user's controlls are pressed
			rockets = {
				'image': new Img('svg/rockets.svg'),
				'width': 40,
				'height': 12
			},
			// Object that will descent to the surface automatically when the crane is in the landing area
			rover = {
				'image': new Img('svg/rover.svg'),
				'width': 29,
				'height': 17,
				'relativeX': 5
			},
			// Reference to data of the area for landing
			landingArea = {
				'height': 35,
				'width': 60,
				'left': 720,
				'top': 260,
				'right': 780,
				'bottom': 295
			},
			// Speed of rockets when user press a control key
			rocket = 1,
			// How much the speed increase or decrease
			step = 0.01,
			// Speed of skycrane flying after rover landing
			flyAwayStep = 0.06;

		/**
		 * Methods
		 */
		// Keyboard process to determine rocket usage
		function processEntry(keyCode, enabling) {
			switch (keyCode) {
			// Pressing Up
			case 38:
				crane.yRocket = enabling;
				break;
			// Pressing Left
			case 37:
				crane.xRocket = enabling ? -rocket : 0;
				break;
			// Pressing Right
			case 39:
				crane.xRocket = enabling ? rocket : 0;
				break;
			}
		}

		// Process on keydown
		function entryStart(event) {
			processEntry(event.keyCode, true);
		}

		// Process on keyup
		function entryEnd(event) {
			processEntry(event.keyCode, false);
		}

		// Allow to user to interact with skycrane
		function enableControls() {
			// Allow to tap into visual keyboard to touchable-devices users
			doc.addEventListener('keydown', entryStart);
			doc.addEventListener('keyup', entryEnd);
		}

		// Deny to user to interact with skycrane
		function disableControls() {
			// Deny to tap into visual keyboard to touchable-devices users
			doc.removeEventListener('keydown', entryStart);
			doc.removeEventListener('keyup', entryEnd);
		}

		function descent() {
			// Deny any user entry
			disableControls();
			// Be sure to neutralize all speeds
			crane.xRocket = crane.yRocket = crane.xSpeed = crane.ySpeed = 0;
			// Set a flag to deny calculations of user's entries on tick
			manual = false;
			// Hide visual feedback to user
			remClass(DOM.landing, 'holding');
			// Set the initial rover position with crane position to start descent
			rover.x = crane.x + rover.relativeX;
			rover.y = crane.y;
		}

		function checkLanding() {
			// Into landing area range
			if (
				(crane.x > landingArea.left && crane.x + crane.width < landingArea.right) &&
					(crane.y > landingArea.top && crane.y + crane.height < landingArea.bottom)
			) {
				// Avoid to do this 60 times per second
				if (!landing) {
					// Init a timer: if it's accomplished, touchdown will be done
					// Count 4 seconds because 0.59s is 0, and 0.02s is 0 too, and it takes 1 extra second
					holdingTimer = win.setTimeout(descent, 4000);
					// Update flag
					landing = true;
					// Show visual feedback to user
					addClass(DOM.landing, 'holding');
				}
			// Out of landing area
			} else {
				// Avoid to do this 60 times per second
				if (landing) {
					// Clear timer to deny the touchdown execution
					win.clearTimeout(holdingTimer);
					// Update flag
					landing = false;
					// Hide visual feedback to user
					remClass(DOM.landing, 'holding');
				}
			}
		}

		// Destructor
		function end(reason) {
			// Reset flags
			landing = false;
			manual = true;
			// Delete event listeners
			disableControls();
			// End the global game instance
			endGame(reason);
		}

		// Tick for the canvas game (60 executions per second)
		function tick() {
			// Draw only when the Canvas Game is visible
			if (DOM.canvasGame.classList.contains('h')) { return; }
			// Clean the canvas context
			ctx.clearRect(0, 0, viewportWidth, viewportHeight);

			// When user has control over the spacecraft
			if (manual) {
				// Update Horizontal speed based on used control plus a pre-determined step
				crane.x += crane.xSpeed += crane.xRocket * step;
				// Update Vertical speed:
				// - When control are used, then apply negative force
				// - On default situation, apply a positive force (gravity)
				crane.y += crane.ySpeed += crane.yRocket ? -step : step;
				// Validate crashing
				if (crane.y > ground || crane.x > viewportWidth || crane.x < -crane.width) { end('You\'ve crashed'); }
				// Validate the landing area
				checkLanding();
			// Skycrane mode
			} else {
				// Stop the time
				win.clearInterval(timer);
				// Curiosity descent until touch the ground
				if (rover.y + rover.height < ground) {
					rover.y += 0.5;
				// Fly away!
				} else {
					// Mission accomplished!
					if (crane.x > viewportWidth) { end('Mission accomplished'); }
					// Move the crane
					crane.x += crane.xSpeed += flyAwayStep;
					crane.y += crane.ySpeed -= flyAwayStep;
				}
				// Render the rover with the updated position
				ctx.drawImage(rover.image, rover.x, rover.y, rover.width, rover.height);
			}
			// Render the ON rocket engines if it's necessary
			if (crane.xRocket || crane.yRocket || !manual) {
				ctx.drawImage(rockets.image, crane.x, crane.y + crane.height, rockets.width, rockets.height);
			}
			// Render the crane with the updated position
			ctx.drawImage(crane.image, crane.x, crane.y, crane.width, crane.height);
			// Repeat cicle
			rAF(tick);
		}

		function init() {
			// Reset spacecraft visibilities
			hide(DOM.DOMgame);
			// Reset message
			updateMessage('Use the arrows keys to land.');
			// Set crane on initial place
			// x = 6em
			crane.x = 6 * 16;
			crane.y = -crane.height;
			// Set the crane initial speed
			crane.xSpeed = 1;
			crane.ySpeed = 0.1;
			// Set initial propulsion
			crane.xRocket = crane.yRocket = 0;
			// Allow user to drive
			enableControls();
			// Do the element visible
			show(DOM.canvasGame);
			// Mark as checkpoint to restart from here the second time
			newbie = false;
			// Init the rAF cicle
			tick();
		}

		/**
		 * Exports
		 */
		canvasGame = {
			'init': init
		};
	}());

	/**
	 * DOM GAME
	 */
	(function () {
		/**
		 * Properties
		 */
		// Collection of all phases of the DOM game
		var stages = {
			// Guided entry to Mars' atmosphere
			'entry_stg': {
				'go': function () {
					// Feedback
					updateMessage('Descending through the Martian atmosphere. Get ready for instructions.');
					// Add inclination to the guided entry
					addClass(DOM.DOMgame, 'entry_stg');
				}
			},
			// Supersonic parachute deploy
			'parachute_stg': {
				'msg': 'Deploy the supersonic parachute.',
				'go': function () {
					// Remove inclination of the guided entry
					remClass(DOM.DOMgame, 'entry_stg');
				}
			},
			// Heat shield separation
			'shield_stg': {
				'msg': 'Separate the heat shield.',
				'go': function () {
					// Show the skycrane DOM element
					show(DOM.curiosity);
				}
			},
			// Capsule and parachute goes away and skycrane fall down alone
			'separation_stg': {
				'msg': 'Drop out of the bottom of the aeroshell.',
				'go': function () {
					// Feedback
					updateMessage('Get ready to take manual controls.');
					// Give 3 seconds of delay to take the manual control and start the canvas game
					win.setTimeout(canvasGame.init, 7000);
				}
			}
		},
			// Collection with actions/stages and its respective time to show
			// Defaults: 49,38,29
			timing = {
				49: 'parachute_stg',
				38: 'shield_stg',
				29: 'separation_stg'
			},
			// Collection of accumulative stages execution
			queue = [];

		/**
		 * Methods
		 */
		function init() {
			// Hide the rover element
			hide(DOM.curiosity);
			// Change the value of button to the next time
			DOM.play.textContent = 'Replay';
			// Clean the scene container classnames (and show, because 'h' class is deleted)
			DOM.DOMgame.className = '';
			// Execute the first stage
			stages.entry_stg.go();
		}

		// Listen to the Tick event (Executed ONE time per second)
		function tick() {
			// Draw only when the Canvas Game is visible
			if (DOM.DOMgame.classList.contains('h')) { return; }
			// Match current time (seconds) with the stage timing map
			var stg = timing[countdown];
			// Add to queue when there is an action in the timing instance
			if (stg) { queue.push(stg); }
			// Enable the first action on queue
			if (queue.length > 0) {
				// Show feedback respective to stage
				updateMessage(stages[queue[0]].msg);
				// Update class of button with the respective action
				// (this will remove the "h" class too)
				DOM.action.className = queue[0];
			}
		}

		/**
		 * Event delegation
		 */
		// Add functionality to the Action button
		DOM.action.addEventListener('click', function () {
			// Empty the message board
			updateMessage();
			// Hide the button on execution
			hide(DOM.action);
			// Get the first stage on queue
			var stg = queue.shift();
			// Add the stage's classname to DOMgame container
			addClass(DOM.DOMgame, stg);
			// Execute the stage from stages map
			stages[stg].go();
		});

		/**
		 * Exports
		 */
		DOMgame = {
			'init': init,
			'tick': tick
		};
	}());

	// Init the DOM game when game is ready to play
	win.onload = function () {
		// Add the hability of start/restart the game to the main screen button
		DOM.play.addEventListener('click', function () {
			// Execute only one time
			if (newbie) {
				// Calculate time to include the DOM game + canvas game
				setTimer(70);
				// Init the entry stages
				DOMgame.init();
			// Execute after first execution
			} else {
				// Calculate time to include only the canvas game
				setTimer(20);
				// Init the landing stage
				canvasGame.init();
			}
		});
		// Show the PLAY button
		show(DOM.play);
	};

}(this));