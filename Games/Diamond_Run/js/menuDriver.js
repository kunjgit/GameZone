/**
 * Adaptation of the menu handler initially developped for Staccato (2013 entry)
 * Simplified to handle a single column and no custom keys
 *
 * Initial documentation follows :
 *
 * Handler to manage a menu with several lines and several columns
 *
 * It manages the selection and event handling, however the display is not featured
 * and should be implemented outside (in the renderer)
 *  - up and down arrows change the selected item (if there is more than one line)
 *  - left and right arrows change the selected item (if there is more than one column)
 *  - space and enter keys validate the selection
 *  - escape key handling is not featured and has to be captured in the container screen.
 *  - mouse clicks (or touchscreen tap for mobiles) are handled for clickable areas with their id in the "areaClicked" attribute
 *
 * The MenuDriver is designed as a component in a view that will manage the display.
 */

 /**
  * MenuDriver constructor.
  * All actions are assigned by default to the leave action
  * @constructor
  * @param lineCount : number of lines in the menu
  * @param controls : a reference to the user controls (keyboard and mouse)
  *
  */
 function MenuDriver(lineCount, controls)
 {
	this.controls = controls;
	this.columnCount = 1;
	this.lineCount = lineCount;
	this.minLine = 0;
	this.initialize();
 }
 
 
  MenuDriver.prototype = {
  
  
    /**
	 * Menu reset, upond entering the screen
	 */
	initialize : function() {
		this.done=false;
		this.selectedLine = 0;
		this.controls.totalClear();
	},
	

	/**
	 * Disables the lines above (before) the minimum line
	 * Used to disable "Resume" if no game in progress
	 */
	setMinLine : function(minLine) {
		this.minLine = minLine;
		this.selectedLine = Math.max(minLine, this.selectedLine);
	},
	
	/**
	 * Returns the line of the selected option
	 */
	getSelectedOption : function() {
		return this.selectedLine;
	},
	

	processEvents : function() {
	
		this.selectedLine += (this.controls.controlUp&&this.selectedLine>this.minLine?-1:0)
							+(this.controls.controlDown&&this.selectedLine<this.lineCount-1?1:0);
		if (this.controls.menuClicked>=this.minLine && this.controls.menuClicked < this.lineCount) {
			this.selectedLine = this.controls.menuClicked;
		}
		if ((this.controls.menuClicked>=this.minLine && this.controls.menuClicked < this.lineCount) || this.controls.controlFire) {	// selection clicked/validated
			// true to leave the menu
			this.done = true;
		}
		this.controls.totalClear();
	}
	
	
	
}
