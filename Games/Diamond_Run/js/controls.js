/**
 * @constructor
 */
function Controls()
{
	this.mouseX = 0;
	this.mouseY = 0;
	this.windowLayout = false; // default initialization, will be set to actual value by onLayoutChange()
	this.mouseInPlayArea = false; // true everywhere but the control bar 
	this.mouseInBullsEye = false; // true in the top-left view, in hacking mode
	this.keyBelowMouse = -1;
	this.dropTargetBelowMouse = -1;
	this.mouseLeftButton=false;
	this.totalClear();
}

Controls.prototype = {

	totalClear : function() {
		this.menuClicked=-1;
		this.controlUp=false;
		this.controlDown=false;
		this.controlEscape=false;
		this.controlFire=false;
		this.worldDX=0;
		this.worldDY=0;
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
		
		// test against static, non-redefinable keys (arrows for menu navigation, escape)
		switch (key) {
			case 38 : // top arrow
				this.controlUp = value;
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
		
		return handled;
	},
	
	/**
	 * Handler for mouse up events
	 */
	onMouseUp : function(event) {
		// main menu : select the clicked line
		if (this.windowLayout) {
			this.menuClicked = Math.floor(10*this.mouseY/(this.windowLayout.playArea[0]+2*this.windowLayout.playArea[2])-3);
		}

		this.mouseLeftButton=false;
		return true;
	},

	/**
	 * Handler for mouse down events
	 */
	onMouseDown : function(event) {
		this.mouseLeftButton=true;
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
	 * Consume a mouse click, so that the icon will not
	 * be activated again the next frame, until the user clicks again
	 * (used for double-click requirement on reset / menu icons)
	 */
	acknowledgeMouseClick : function() {
		this.mouseLeftButton=false;
		this.menuClicked = -1;
	},

	/**
	 * Handler for mouse/touch move events
	 */
	onMouseMove : function(event) {
		var clientX = 0, clientY = 0;
		if ('changedTouches' in event && event.changedTouches.length > 0)
		{	//touchmove event
			clientX = event.changedTouches[0].clientX;
			clientY = event.changedTouches[0].clientY;
		}
		if ('clientX' in event && 'clientY' in event)
		{	// mousemove event
			clientX = event.clientX;
			clientY = event.clientY;
		}
		if (this.windowLayout) // has been set 
		{
			this.mouseX=clientX;
			this.mouseY=clientY;
			this.worldDX=(this.mouseX-this.windowLayout.playArea[1]) / this.windowLayout.playArea[0];
			this.worldDY=-(this.mouseY-this.windowLayout.playArea[2]) / this.windowLayout.playArea[0];
			
			this.keyBelowMouse = -1;
			this.dropTargetBelowMouse = -1;
			this.mouseInPlayArea = this.mouseY < this.windowLayout.controlBar[0];
			this.mouseInBullsEye = this.mouseY < 4*this.windowLayout.playArea[0] && this.mouseX < 4*this.windowLayout.playArea[0];
			if (!this.mouseInPlayArea) {
				this.keyBelowMouse = Math.floor(this.mouseX / this.windowLayout.playArea[0]);
			} else {
				// in game : check if above a drop point
				var dz = .5 * this.windowLayout.hackingArea[0];
				for (var i=0;i<8;++i) {
					var dx = this.mouseX - this.windowLayout.hackingArea[i*2+1];
					var dy = this.mouseY - this.windowLayout.hackingArea[i*2+2];
					if (dx*dx+dy*dy <= dz*dz) {
						this.dropTargetBelowMouse = i;
					}
				}
			}
		}
		return true;
	},
	

	
	/**
	 * Second-level handler for window resize / layout change. Called by Game.
	 * Keeps track of the new layout with the click areas
	 * @param windowLayout Object containing the layout of the different panels and toolbars
	 */
	onLayoutChange : function(windowLayout) {
		this.windowLayout = windowLayout;
	}
	
}
