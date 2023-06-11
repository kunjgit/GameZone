function drawConeSectionFromCenter(cx, cy, startAngle, endAngle, blockHeight, distance, color, op) {
	if (distance <= settings.baseRadius + .00000001) {
		cx += gdx;
		cy += gdy;
	}

	if (op) ctx.globalAlpha = op;
	blockHeight *= settings.scale;
	distance *= settings.scale;

	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(cx, cy, distance + blockHeight, startAngle, endAngle, 1);
	ctx.lineTo(cx + Math.cos(endAngle) * distance, cy + Math.sin(endAngle) * distance);
	ctx.arc(cx, cy, distance, endAngle, startAngle, 0);
	ctx.lineTo(cx + Math.cos(startAngle) * (distance + blockHeight), cy + Math.sin(startAngle) * (distance + blockHeight));
	ctx.fill();
	ctx.closePath();
	if (op) ctx.globalAlpha = 1;
}

function drawFilledCircle(x, y, radius, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x + gdx, y + gdy,radius * settings.scale, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function drawRect(x, y, sideLength, color, angle, shouldG) {
	x = (x + gdx * shouldG);
	y = (y + gdy * shouldG);
	ctx.save();
	ctx.fillStyle = color;
	ctx.translate(x, y);
	ctx.rotate(angle);
	var sl = sideLength * settings.scale;
	ctx.fillRect(0, 0, sl, sl);
	ctx.restore();
}

function scaleCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	if (canvas.height > canvas.width) {
		settings.scale = (canvas.width / 800);
	} else {
		settings.scale = (canvas.height / 800);
	}

	trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};

	if (window.devicePixelRatio) {
		var cw = canvas.width;
		var ch = canvas.height;

		canvas.width = cw * window.devicePixelRatio;
		canvas.height = ch * window.devicePixelRatio;
		canvas.style.width = cw;
		canvas.style.height = ch;

		trueCanvas = {
			width: cw,
			height: ch
		};

		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
}

function render() {
	// drawRect(300, 300, 100, "#232323", 30)
	ctx.fillStyle='#2c3e50';
	ctx.fillRect(0,0,trueCanvas.width,trueCanvas.height);
	player1.draw();
	if ('player2' in window) {
		player2.draw();
	}

	drawFilledCircle(trueCanvas.width/2, trueCanvas.height/2, settings.baseRadius + .5, '#2ecc71')
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].draw();
	}

	switch (gameState) {
		case 0:
			ctx.globalAlpha = .7;
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, c.height, c.width);
			ctx.globalAlpha = 1;
			fillText('110px Helvetica', 'Radial', trueCanvas.width/2, trueCanvas.height/2 - 115 * settings.scale);
			fillText('40px Helvetica', 'Play!', trueCanvas.width/2, trueCanvas.height/2);
			break;

		case 2:
			if ('initText' in window && initText - 50 > 0) {
				var op = (initText - 50)/50;
				if (op > 1) op = 1;
				ctx.globalAlpha = op;
				fillText('30px Helvetica', settings.mobile ? 'Touch the left and right sides of the screen to move' : 'Use the arrow keys to move left and right!', trueCanvas.width/2, trueCanvas.height/2 - 170 * settings.scale, 0);
				fillText('30px Helvetica', 'Avoid touching the (elemental) blocks!', trueCanvas.width/2, trueCanvas.height/2 - 130 * settings.scale, 0);
				ctx.globalAlpha = 1;
				initText--;
			}
			fillText('40px Helvetica', score, trueCanvas.width/2, trueCanvas.height/2);
			break;

		case 3:
			if (endCt < 1) endCt += .01;
			ctx.globalAlpha = endCt > .7 ? .7 : endCt;
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
			fillText('90px Helvetica', 'Game over', trueCanvas.width/2, trueCanvas.height/2 - 75 * settings.scale);
			fillText('50px Helvetica', 'Score: ' + score, trueCanvas.width/2, trueCanvas.height/2);
			fillText('30px Helvetica', settings.mobile ? 'Tap to restart!' : 'Hit enter to restart!', trueCanvas.width/2, trueCanvas.height/2 + 60 * settings.scale);
			ctx.globalAlpha = 1;
			break;
	}
}

function fillText(font, name, x, y, ngd) {
	ctx.save();
	ctx.scale(settings.scale,settings.scale);
	ctx.fillStyle = '#ecf0f1';
	var tgdy = 0;
	var tgdx = 0;
	if (ngd) {
		tgdx = gdx;
		tgdy = gdy;
	}
	ctx.textBaseline = 'middle';
	ctx.font = font;
	ctx.fillText(name, (x - ((ctx.measureText(name).width) * settings.scale)/2) / settings.scale + tgdx * settings.scale, y/settings.scale + tgdy * settings.scale);
	ctx.restore();
}