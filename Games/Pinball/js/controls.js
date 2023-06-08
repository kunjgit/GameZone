/**
 * @constructor
 */
function Controls()
{
	this.mouseX = 0;
	this.mouseY = 0;
	this.totalClear();
	this.playerCount = 1;
}

Controls.prototype = {

	/**
	 * Clears all inputs, keyboard and mouse buttons
	 */
	totalClear : function() {
		this.controlUp=false;
		this.controlDown=false;
		this.controlLeft=false;
		this.controlRight=false;
		this.controlEscape=false;
		this.controlFire=false;
		this.controlPause=false;
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
		
		// Controls similar to Pinball Dreams / Fantasies : shift / ctrl / Alt for flippers
		// (not shift : no key down event after hitting both shift keys)
		if (/*"Shift" == event.key || */"Alt" == event.key || "Control" == event.key || "Meta" == event.key) {
			if (event.location == 1) {
				this.controlLeft = value;
			}
			if (event.location == 2) {
				this.controlRight = value;
			}
		}
		
		// test against static, non-redefinable keys (arrows for menu navigation, escape)
		switch (key) {
			case 20 : // caps lock
			case 65 : // A (for QWERTY)
			case 81 : // Q (for AZERTY)
			case 83 : // S
			case 68 : // D
			case 70 : // F
			case 71 : // G
			case 60 : // <
			case 87 : // W (for AZERTY)
			case 90 : // Z (for AZERTY)
			case 88 : // X
			case 67 : // C
			case 86 : // V
			case 66 : // B
			case 37 : // left arrow
				this.controlLeft = value;
				break;
			case 38 : // top arrow
			case 112: // F1
			case 113: // F2
			case 114: // F3
			case 115: // F4
				this.controlUp = value;
				this.playerCount = key-111; // 1 to 4 players
				break;
			case 72 : // H
			case 74 : // J
			case 75 : // K
			case 76 : // L
			case 77 : // M
			case 165 : // ' (for QWERTY)
			case 170 : // \ (for QWERTY)
			case 222 : // ù (for AZERTY)
			//case 220 : // * (disabled : both left and right on QWERTY)
			case 78 : // N
			case 188 : // , (for AZERTY)
			case 190 : // . (for QWERTY)
			case 191 : // / (for QWERTY)
			case 59 : // ; (for AZERTY)
			case 58 : // : (for AZERTY)
			case 161 : // ! (for AZERTY)
			case 39 : // right arrow
				this.controlRight = value;
				break;
			case 40 : // down arrow
				this.controlDown = value;
				break;
			case 32 : // space bar
				this.controlFire = value;
				break;
			case 80 : // P
				this.controlPause = value;
				break;
			case 27 : // escape
				this.controlEscape = value;
				break;

			default :
				handled = false;
				//alert(key);
		}
		
		return handled;
	},
	
	/**
	 * Handler for mouse up events
	 */
	onMouseUp : function(event) {
		if (this.mouseY > window.innerHeight/2) {
			this.controlDown = false;
		}
		if (this.mouseX < window.innerWidth/2) {
			this.controlLeft = false;
		} else {
			this.controlRight = false;
		}
		return false;
	},

	/**
	 * Handler for mouse down events
	 */
	onMouseDown : function(event) {
		if (this.mouseY > window.innerHeight/2) {
			this.controlDown = true;
		} else {
			this.controlUp = true;
			this.playerCount = 1;
		}
		if (this.mouseX < window.innerWidth/2) {
			this.controlLeft = true;
		} else {
			this.controlRight = true;
		}
		return true;
	},
	
	/**
	 * Handler for touch start / touch enter events
	 * Call onMouseMove (pointer motion handler) first to record position as the event chain begins with onTouchStart
	 * and there is no permanent tracking of the cursor position (unlike mouse event)
	 */
	onTouchStart : function(event)
	{
		this.onMouseMove(event);
		return this.onMouseDown(event);
	},
	
	/**
	 * Handler for touch end / touch leave events
	 */
	onTouchEnd : function(event)
	{
		event.preventDefault();
		return this.onMouseUp(event);
	},
	
	/**
	 * Handler for touch move events
	 */
	onTouchMove : function(event)
	{
		event.preventDefault();
		var result = this.onMouseMove(event);
		return result;
	},
	
	/**
	 * Handler for mouse/touch move events
	 */
	onMouseMove : function(event) {
		if ('changedTouches' in event && event.changedTouches.length > 0)
		{	//touchmove event
			this.mouseX = event.changedTouches[0].clientX;
			this.mouseY = event.changedTouches[0].clientY;
		}
		if ('clientX' in event && 'clientY' in event)
		{	// mousemove event
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
		}
		return true;
	},
	
	
}
