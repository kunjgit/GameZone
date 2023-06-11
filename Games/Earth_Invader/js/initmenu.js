//////////////////////////////////////////////////////
///   Inits the main menu
//////////////////////////////////////////////////////

function initMainMenu() {
	initStars(); // Draw the star background
	// This block initiliazes the mainmenu canvas, sets the context, and sets its width and height to that of the user's screen
	var canvas = document.getElementById('mainmenu');
	currentcanvas = 'mm';
	var ctx = canvas.getContext('2d');
	winwidth = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwidth;
	canvas.height = winheight;
	renderops.main = true;

	canvas.addEventListener("mousemove", function (e) { // Used for getting the position to draw the cursor
		var rect = canvas.getBoundingClientRect(); // Get bounding rectangle
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; // ClientX & Y are for whole window, left and top are offsets
	}, false);

	// Initialize Array of clickable elements, and then push in the parameters that would make a rectangle
	var elements = [];
	elements.push({
		color: "red",
		width: 200,
		height: 75,
		top: winheight / 2 + 50,
		left: winwidth / 2 - 100
	});

	// Initialize click handler for start button. It checks every click on the canvas if it is in the bounds of any of the elements, in this case, the start button
	canvas.addEventListener('click', function(event) {
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		elements.forEach(function(element) {
			if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				renderops.main = false;
				clearScreen();
				initLevelSelect();
				clicksound();
			}
		});
	}, false);

	var main = function(){ // Render the text and buttons
		if (renderops.main) {
			render();
			requestAnimationFrame(main);
		}
	};

	// Clears the screen
	var clearScreen = function(){
		ctx.clearRect(0,0,canvas.width, canvas.height);
	};

	// Clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		// Render the Title
		ctx.font = "30pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Earth Invader", winwidth / 2, 50);

		ctx.font = "20pt Arial";
		ctx.fillText("WASD to move", winwidth / 2, winheight - 55);
		ctx.fillText("Click and hold to shoot", winwidth / 2, winheight - 30);
		ctx.fillText("P to pause", winwidth / 2, winheight - 5);
		// Render each object in elements as per parameters
		elements.forEach(function(element) {
			ctx.fillStyle = element.color;
			ctx.fillRect(element.left, element.top, element.width, element.height);
		});

		// Render text on the start button
		ctx.fillStyle = "black";
		ctx.fillText("Start", winwidth / 2, winheight / 2 + 100);

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); // Keeping individual RGB values between 100 and 200, just b/c
		}
		ctx.fillStyle = cursorcolor;
		ctx.fillRect(mouseX + 1,mouseY + 4,2,8);
		ctx.fillRect(mouseX + 4,mouseY + 1,8,2);
		ctx.fillRect(mouseX + 1,mouseY - 8,2,8);
		ctx.fillRect(mouseX - 8,mouseY + 1,8,2);
	};

	main();
}