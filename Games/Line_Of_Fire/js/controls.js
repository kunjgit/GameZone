/**
 * @constructor
 */
function Controls(data)
{
	this.windowLayout = false; // default initialization, will be set to actual value by onLayoutChange()
	this.persistentData = data;
	this.mouseX = 0;
	this.mouseY = 0;
	this.worldDX = 0.5;
	this.worldDY = 0;
	this.totalClear();
}

Controls.prototype = {

	/**
	 * Clears all inputs, keyboard and mouse buttons
	 */
	totalClear : function() {
		this.leftMouseButton=false;
		this.rightMouseButton=false;
		this.controlUp = false;
		this.controlDown = false;
		this.controlFire = false;
		this.controlEscape = false;
		this.customKeyStatus = [false, false, false, false, false];
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
	 * @param index index of the control (0=up, 1=down, 2=left, 3=right, 4=drone) to change
	 * @param newKey key identifier as returned by the browser key event
	 * @return the former key before the redefinition
	 */
	redefineCustomKey : function(index, newKey) {
		var formerKey = this.persistentData.data.keys[index];
		this.persistentData.setKey(index, newKey);
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
			case 80 : // P
				this.controlEscape = value;
				break;
			case 87 : // W
				this.customKeyStatus[0]=value;
				break;
			case 65 : // A
				this.customKeyStatus[1]=value;
				break;
				
			default :
				handled = false;
		}

		// test against customizable keys
		for (var i=0; i<6; ++i) {
			if (key==this.persistentData.data.keys[i]) {
				this.customKeyStatus[i]=value;
				handled=true;
			}
		}

		
		return handled;
	},
	
	/**
	 * Handler for mouse up events
	 */
	onMouseUp : function(event) {
		this.leftMouseButton=false;
		this.rightMouseButton=false;
		
		return true;
	},

	/**
	 * Handler for mouse down events
	 */
	onMouseDown : function(event) {
		if (event.buttons& 1) {
			this.leftMouseButton=true;
		}
		if (event.buttons& 2) {
			this.rightMouseButton=true;
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
	 * Handler for VR trigger event => equivalent to LMB
	 */
	onVRTrigger : function(state)
	{	
		event = { buttons : 1};
		if (state.value) {
			this.onMouseDown(event);
		} else {
			this.onMouseUp(event);
		}
	},
	
	/**
	 * Handler for VR main button event => equivalent to RMB
	 */
	onVRMainButton : function(state) 
	{
		event = { buttons : 2};
		if (state.value) {
			this.onMouseDown(event);
		} else {
			this.onMouseUp(event);
		}
	},
	
	/**
	 * Handler for VR secondary button event => equivalent to Space key
	 */
	onVRSecondaryButton : function(state) 
	{
		this.customKeyStatus[4]=state.value?true:false;
	},
	
	/**
	 * Handler for VR thumb stick / touch pad => replace direction keys
	 */
	onVRThumbStick : function(state) {
		this.customKeyStatus[0]=(state.y>.1); // up
		this.customKeyStatus[1]=(state.x<-.1); // left
		this.customKeyStatus[2]=(state.y<-.1); // down
		this.customKeyStatus[3]=(state.x>.1); // right
	},
	
	
	
	/**
	 * Consume a left mouse click (fire)
	 */
	acknowledgeLeftMouseClick : function() {
		this.leftMouseButton=false;
	},

	/**
	 * Consume a right mouse click (weapon change)
	 */
	acknowledgeRightMouseClick : function() {
		this.rightMouseButton=false;
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
			this.worldDX=(this.mouseX / this.windowLayout.playArea[0]);
			this.worldDY=(this.mouseY / this.windowLayout.playArea[1]);			
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
