window.splashScreen = (() => {
	return {
		n: () => {
			character.nSplashScreen();
		},
		r: () => {
			c.save();
			c.translate(500, 340);
			c.scale(1, -1);
			c.font = '120px Courier New';
			c.textAlign = 'left';
			c.fillStyle = "white";
			c.fillText('Triangle:', 0, 0);
			c.translate(0, 100);
			c.font = '60px Courier New';
			c.fillText('Back To Home', 30, 0);

			c.translate(0, 160);
			c.font = '30px Courier New';
			c.fillText('(Click to Start)', -30, 0);
			c.restore();

			character.rSplashScreen();
		}
	};
})();
