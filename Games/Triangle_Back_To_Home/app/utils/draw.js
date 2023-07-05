window.draw = (() => {
	let t = 'transparent';
	return {
		r: (g, size, width) => {
			c.save();
			if (size) {
				c.translate(-size[0] / 2, -size[1] / 2);
			}
			g.forEach((p) => {
				bp();
				c.fillStyle = color[p[2]] || p[2] || t;
				c.strokeStyle = color[p[1]] || p[1] || t;
				c.lineWidth = !p[3] ? width : .001;
				c.lineJoin = 'round';
				m(p[0][0], p[0][1]);
				for(let i = 2; i < p[0].length; i = i + 2) {
					l(p[0][i], p[0][i + 1]);
				}
				p[3] && cp();
				p[1] && c.stroke();
				p[3] && c.fill();
			});
			c.restore();
		}
	};
})();
