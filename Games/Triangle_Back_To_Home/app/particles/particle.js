function Particle(mass, r, p, v, lifeTime, cc) {
	this.isActive = true;
	let position = p.get();
	let velocity = v.get();
	let acceleration = new V();
	const startTime = +new Date();

	this.n = () => {
		acceleration.add(velocity.get().normalize().mult(0.001));
		acceleration.add(gc.gravity.get().mult(mass));

		velocity.add(acceleration);
		position.add(velocity);
		acceleration.mult(0);

		if (+new Date() - startTime >= lifeTime) {
			this.isActive = false;
		}
	};

	this.r = () => {
		const opacity = 1 - ((+new Date() - startTime) / lifeTime);
		c.save();
		c.translate(position.x + 20, position.y);
		c.globalAlpha = opacity >= 0 ? opacity : 0;
		bp();
		c.fillStyle = cc;
		c.rect(-(r / 2), -(r / 2), r * 2, r * 2);
		c.fill();
		cp();
		c.restore();
	};
}
