/*jshint unused: false*/
var WIDTH = 420, HEIGHT = 700,
	SHIPSIZE = 10, PLANET_R = 40,
	circleSpeed = 0.0015, moveSpeed = 0.1,
	planets, playerX, playerY,
	playerAngle, playerPlanet, circleDir,
	lastPlanet, startY = 0, record, gold;
//the code to show the planets in the description is a bit messy
//so startY = 0 is required before the game starts