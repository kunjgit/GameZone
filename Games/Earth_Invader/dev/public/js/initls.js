//////////////////////////////////////////////////////
///   Inits the level select
//////////////////////////////////////////////////////

function initLevelSelect() {
	// This block initiliazes the levelselect canvas, sets the context, and sets its width and height to that of the user's screen
	var canvas = document.getElementById('levelselect');
	var ctx = canvas.getContext('2d');
	winwidth = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwidth;
	canvas.height = winheight;

	score = 0;
	time = 0;
	enemiesKilled = 1;

	var cleared = false;
	var difftext = "Normal";
	if (Options.resize) {
		Options.resize = false;
		resize();
	}

	renderops.levelselect = true; // To prevent the level select from appearing on replays
	var infoBox = "";

	canvas.addEventListener('click', function(event) { // Deals with clicking and setting variables
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		if (y > canvas.height - 150 && y < canvas.height - 150 + 75 && x > canvas.width / 2 - 100 && x < canvas.width / 2 - 100 + 200) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			renderops.levelselect = false;
			clearScreen();
			clicksound();
			initGame();
		}

		if(y > 50 && y < 125 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){ // Difficulty select
			if (Options.difficulty === 0) {
				console.log("switching from normal")
				Options.difficulty = 1;
				difftext = "Hard";
			} else if (Options.difficulty === 1) {
				console.log("switching from hard")
				Options.difficulty = 0;
				difftext = "Normal";
			}
			clicksound();
		} else if(y > 50 && y < 125 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){ // Rest highscore
			highscore = 0;
			cleared = true;
			clicksound();
		} else if(y > 200 && y < 275 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			Options.planType = "fire";
			clicksound();
		} else if(y > 200 && y < 275 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			Options.planType = "air";
			clicksound();
		} else if(y > 200 && y < 275 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			Options.planType = "water";
			clicksound();
		} else if(y > 200 && y < 275 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			Options.planType = "rock";
			clicksound();
		} else if(y > 400 && y < 475 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			Options.wepType = "fire";
			clicksound();
		} else if(y > 400 && y < 475 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			Options.wepType = "air";
			clicksound();
		} else if(y > 400 && y < 475 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			Options.wepType = "water";
			clicksound();
		} else if(y > 400 && y < 475 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			Options.wepType = "rock";
			clicksound();
		}
	}, false);
	canvas.addEventListener("mousemove", function (e) { // Deal with moving the mouse and setting the infobox
		var rect = canvas.getBoundingClientRect(); //get bounding rectangle
		x = e.clientX - rect.left;
		y = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets

		if(y > 200 && y < 275 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			infoBox = "Weak against Air, resistant to Water.";
		} else if(y > 200 && y < 275 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			infoBox = "Weak against Rock, resistant to Fire.";
		} else if(y > 200 && y < 275 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			infoBox = "Weak against Fire, resistant to Rock.";
		} else if(y > 200 && y < 275 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			infoBox = "Weak against Water, resistant to Air.";
		} else if(y > 400 && y < 475 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			infoBox = "Effective against Water, less effective against Air. High RoF, does burn damage over time.";
		} else if(y > 400 && y < 475 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			infoBox = "Effective against Fire, less effective against Rock. Fires in a spread, pushes enemies back.";
		} else if(y > 400 && y < 475 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			infoBox = "Effective against Rock, less effective against Fire. Slows down enemies, does splash damage.";
		} else if(y > 400 && y < 475 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			infoBox = "Effective against Air, less effective against Water. High damage per shot, penetrates through enemies.";
		} else {
			infoBox = "Planet type: " + Options.planType + ". Weapon type: " + Options.wepType + ". Difficulty: " + difftext + ".";
		}
	}); 

	var main = function(){
		if (renderops.levelselect) {
			render();
			requestAnimationFrame(main);
		}
	};

	//clears the screen
	var clearScreen = function(){
		ctx.clearRect(0,0,canvas.width, canvas.height);
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		ctx.font = "30pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Level Select", winwidth / 2, 50);
		ctx.fillStyle = "green";
		ctx.fillRect(canvas.width / 2 - 100, canvas.height - 150, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Play", winwidth / 2, winheight - 100);

		ctx.font = "20pt Arial";
		if (Options.difficulty === 0) {
			ctx.fillStyle = "green";
		} else if (Options.difficulty === 1) {
			ctx.fillStyle = "red";
		}
		ctx.fillRect((canvas.width / 4) / 2 + 100, 50, 200, 75);
		ctx.fillStyle = "black";
		if (Options.difficulty === 0) {
			ctx.fillText("Normal", (canvas.width / 4) / 2 + 200, 100);
		} else if (Options.difficulty === 1) {
			ctx.fillText("Hard", (canvas.width / 4) / 2 + 200, 100);
		}

		ctx.fillStyle = "black";
		ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 50, 200, 75);
		ctx.fillStyle = "white";
		if (cleared) {
			ctx.fillText("Reset!", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 100);
		} else {
			ctx.fillText("Reset Score", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 100);
		}

	//////////////////////////////////////////////////////////

		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Select a Planet Type", winwidth / 2, 150);

		ctx.fillStyle = "red";
		ctx.fillRect((canvas.width / 4) / 2 + 100, 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Fire", (canvas.width / 4) / 2 + 200, 250);

		ctx.fillStyle = "white";
		ctx.fillRect((canvas.width / 2) - 250, 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Air", (canvas.width / 2) - 150, 250);

		ctx.fillStyle = "blue";
		ctx.fillRect((canvas.width / 2) + 50, 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Water", (canvas.width / 2) + 150, 250);

		ctx.fillStyle = "brown";
		ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Rock", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 250);

	/////////////////////////////////////////////////////////////

		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Select a Weapon Type", winwidth / 2, 350);

		ctx.fillStyle = "red";
		ctx.fillRect((canvas.width / 4) / 2 + 100, 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Fire", (canvas.width / 4) / 2 + 200, 450);

		ctx.fillStyle = "white";
		ctx.fillRect((canvas.width / 2) - 250, 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Air", (canvas.width / 2) - 150, 450);

		ctx.fillStyle = "blue";
		ctx.fillRect((canvas.width / 2) + 50, 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Water", (canvas.width / 2) + 150, 450);

		ctx.fillStyle = "brown";
		ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Rock", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 450);

		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(infoBox, winwidth / 2, 525);

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		ctx.fillStyle = cursorcolor;
		ctx.fillRect(mouseX + 1,mouseY + 4,2,8);
		ctx.fillRect(mouseX + 4,mouseY + 1,8,2);
		ctx.fillRect(mouseX + 1,mouseY - 8,2,8);
		ctx.fillRect(mouseX - 8,mouseY + 1,8,2);
	};

	main();
}