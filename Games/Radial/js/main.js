function animLoop() {
	var now = Date.now();
	var dt = (now - last)/16.66666666666666 * (.8);
	switch (gameState) {
		case 0: //main menu
			score = parseInt(((Date.now() - settings.startTime)/60)/4, 10);
			update(dt, now);
			last = now;
			break;

		case 2: //gameplay
			score = parseInt(((Date.now() - settings.startTime)/60)/4, 10);
			update(dt, now);
			last = now;
			break;

		case 3: //game end
		console.log("dead");
			break;
	}

	render();
	requestAnimFrame(animLoop);
}