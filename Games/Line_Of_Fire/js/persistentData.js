/**
 * Data saved to local storage :
 *  - sfx / music preferences
 *  - lap and track records
 *
 * Object storage implementation from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage/3146971
 */
 
/**
 * @constructor
 */
function PersistentData()
{
	this.data = {
		soundOn : true,
		musicOn : true,
//		keys : 	[87, 65, 83, 68, 32, 0] // W, A, S, D, space for drone
		keys : 	[90, 81, 83, 68, 32, 0] // Z, Q, S, D, space for drone
	}
	var recordedData = localStorage.getItem("LineOfFireData");
	if (recordedData) {
		//this.data = JSON.parse(recordedData);

	}
}

PersistentData.prototype = {
	
	/**
	 * Private method to synchronize local storage with current data
	 */
	storeData : function() {
		localStorage.setItem("LineOfFireData", JSON.stringify(this.data));
	},
	
	/**
	 * Toggle Sound effects on and off.
	 */
	toggleSound : function() {
		this.data.soundOn = ! this.data.soundOn;
		this.storeData();
	},
	
	/**
	 * Toggle music on and off.
	 */
	toggleMusic : function() {
		this.data.musicOn = !this.data.musicOn;
		this.storeData();
	},
	
	/**
	 * Define a custom key
	 */
	setKey : function(index, key) {
		this.data.keys[index] = key;
		if (key>-1) {
			this.storeData();
		}
	}
	
}
