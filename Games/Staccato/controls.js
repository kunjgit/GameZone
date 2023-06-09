/**
 * @constructor
 */
function Controls(data)
{
	this.persistentData = data;
	this.totalClear();
}

Controls.prototype = {


	partialClear : function() {
		this.controlFire=false;
		this.controlEscape=false;
		this.lastKeyDown=0;
		this.areaClicked=0;
		this.customControlPressed[0][4] = this.customControlPressed[1][4] = false;
	},
	
	totalClear : function() {
		this.controlLeft=false;
		this.controlRight=false;
		this.controlUp=false;
		this.controlDown=false;
		this.mouseControlLeft=false;
		this.mouseControlRight=false;
		this.customControlPressed = 	[ 	[false, false, false, false, false], 
											[false, false, false, false, false]
										];
		this.partialClear();
	},

	/**
	 * Returns the steering direction (-1 for left, +1 for right)
	 */
	getSteeringDirection : function(player) {
		return ((this.customControlPressed[player][2]?-1:0)+(this.customControlPressed[player][3]?1:0));
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
	 * Setter for the custom keys : used to change the key identifier
	 * (the one from the key event) attached to a given control
	 * Does not check the validity of the parameters, nor that the key
	 * assignment is unique, which could result in one keypress controlling both cars.
	 * @param player identifier of the player (0 or 1) for whom the control key is changed
	 * @param index index of the control (0=up, 1=down, 2=left, 3=right) to change
	 * @param newKey key identifier as returned by the browser key event
	 * @return the former key before the redefinition
	 */
	redefineCustomKey : function(player, index, newKey) {
		var formerKey = this.persistentData.data.keys[player][index];
		this.persistentData.setKey(player, index, newKey);
		return formerKey;
	},
	
	/**
	 * Delegated handler for keyboard events
	 * Records key presses and releases, for both standard keys (arrows, enter, escape)
	 * and configurable controls (through the controls menu)
	 * Returns true if the event is handled, false otherwise.
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
		// test against static, non-redefinable keys (arrows for menu navigation, escape)
		switch (key) {
			case 37 : // left arrow
				this.controlLeft = value;
				break;
			case 38 : // top arrow
				this.controlUp = value;
				break;
			case 39 : // right arrow
				this.controlRight = value;
				break;
			case 40 : // down arrow
				this.controlDown = value;
				break;
			case 32 : // space bar
			case 13 : // enter
				this.controlFire = value;
				break;
			case 27 : // escape
				this.controlEscape = value;
				break;
				
			default :
				handled = false;
		}
		// test against customizable keys
		for (var i=0; i<2; ++i) for (var j=0; j<5; ++j) {
			if (key==this.persistentData.data.keys[i][j]) {
				this.customControlPressed[i][j]=value;
				handled=true;
			}
		}
		
		return handled;
	}

}
