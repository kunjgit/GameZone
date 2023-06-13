var MathHelper = {
	getAngleTo: function(x1, y1, x2, y2) {
		var deltaY = y2 - y1;
		var deltaX = x2 - x1;
		var rads = Math.atan2(deltaY, deltaX);
		var degrees = rads * (180.0 / Math.PI);
		return (degrees > 0.0 ? degrees : (360.0 + degrees));		
	},
	dotproduct: function(a,b) {
		var n = 0;
		var lim = Math.min(a.length,b.length);
		for (var i = 0; i < lim; i++) n += a[i] * b[i];
		return n;
	},
	sign: function(x) {
		return x ? x < 0 ? -1 : 1 : 0;
	},
	distance: function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
	},
	randomSign: function() {
		return Math.random() < 0.5 ? -1 : 1;
	}
}
