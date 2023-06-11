function Controls()
{
	this.stance=1; 	// 1 for regular, -1 for goofy
	this.totalClear();
}

Controls.prototype = {


	partialClear : function() {
		this.controlUp=false;
		this.controlDown=false;
		this.controlFire=false;
		this.controlEscape=false;
		this.lastKeyDown=0;
		this.areaClicked=0;
	},
	
	totalClear : function() {
		this.partialClear();
		this.controlLeft=false;
		this.controlRight=false;
		this.mouseControlLeft=false;
		this.mouseControlRight=false;
	},

	/**
	 * Change the stance, regular (left arrow=clockwise) vs goofy (left arrow=counterclockwise)
	 */
	 toggleStance : function() {
		this.stance*=-1;
	 },
	 
	/**
	 * Returns the angle motion of the pad
	 */
	getAngularDirection : function() {
		return this.stance*((this.controlLeft||this.mouseControlLeft?-1:0)+(this.controlRight||this.mouseControlRight?1:0));
	},

	
	/**
	 * Handler for key up events
	 */
	onKeyUp : function(event) {
		return !this.keyControl(event, false);
	},

	/**
	 * Handler for key down events
	 */
	onKeyDown : function(event) {
		return !this.keyControl(event, true);
	},

	/**
	 * Handler for mouse clicks
	 */
	mouseControl : function(event, area, value) {
		switch(area) {
			case 8 :
				this.mouseControlLeft = value;
				break;
			case 9 :
				this.mouseControlRight = value;
				break;
			default :
				var parentY = document.getElementById("c").style.top;
				var parentSize = Math.min(window.innerWidth, window.innerHeight);
				if (parentSize>0) {
					var relY = (event.clientY - parseInt(parentY))/parentSize;
					if (relY>.2 && relY<.8 && value) {
						this.areaClicked = Math.floor((relY-.08)/.12);
					}
					this.controlEscape |= (relY<.2);
				}
				this.controlFire = this.controlFire||value;
			}
		return true;
	},
	
	/**
	 * Handler délégué pour les événements clavier.
	 * Enregistre les appuis et les relâchements des flèches
	 * et de la touche EspaCe.
	 * Renvoie true si l'événement est géré, false sinon
	 */
	keyControl : function(event, value) {
		var handled = true;
		var key = 0;
		if (window.event) { // IE
			key = window.event.keyCode;
		} else { // FF, Opera,...
			key = event.which;
		}
		
		if (value) {
			this.lastKeyDown = key;
		}
		switch (key) {
			case 37 : // left arrow
			case 74 : // J
				this.controlLeft = value;
				break;
			case 38 : // top arrow
			case 65 : // A
				this.controlUp = value;
				break;
			case 39 : // right arrow
			case 75 : // K
				this.controlRight = value;
				break;
			case 40 : // down arrow
			case 81 : // Q
				this.controlDown = value;
				break;
			case 32 : // space bar
			case 13 : // enter
				this.controlFire = value;
				break;
			case 80 : // P
			case 27 : // escape
				this.controlEscape = value;
				break;
			default :
				handled = false;
		}
		return handled;
	}

}
