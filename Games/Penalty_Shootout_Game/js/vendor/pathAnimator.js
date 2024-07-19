/*-----------------------------
	Path Animator v1.1.0
	(c) 2013 Yair Even Or <http://dropthebit.com>
	
	MIT-style license.
------------------------------*/
function PathAnimator(path){
    if( path ) this.updatePath(path);
	this.timer = null;
}

PathAnimator.prototype = {
	start : function( duration, step, reverse, startPercent, callback, easing ){
		this.stop();
		this.percent = startPercent || 0;

		if( duration == 0 ) return false;

		var that = this,
			startTime = new Date(),
			delay = 1000/60;

		(function calc(){
			var p = [], angle, 
				now = new Date(),
				elapsed = (now-startTime)/1000,
				t = (elapsed/duration), 
				percent = t * 100;
				
			// easing functions: https://gist.github.com/gre/1650294
			if( typeof easing == 'function' )
				percent = easing(t) * 100;

			if( reverse )
				percent = startPercent - percent;
			else
				percent += startPercent;
				
			that.running = true;

			// On animation end (from '0%' to '100%' or '100%' to '0%')
			if( percent > 100 || percent < 0 ){
				that.stop();
				return callback.call( that.context );
			}
			
			that.percent = percent;	// save the current completed percentage value

			//  angle calculations
			p[0] = that.pointAt( percent - 1 );
			p[1] = that.pointAt( percent + 1 );
			angle = Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180 / Math.PI;

			// do one step ("frame") 
			step.call( that.context, that.pointAt(percent), angle );
			// advance to the next point on the path 
			that.timer = setTimeout( calc, delay );
		})();
	},
	
	stop : function(){
		clearTimeout( this.timer );
		this.timer = null;
		this.running = false;
	},
	
	pointAt : function(percent){
		return this.path.getPointAtLength( this.len * percent/100 );
	},

	updatePath : function(path){
		this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.path.setAttribute('d', path);
		this.len = this.path.getTotalLength();
	}
};