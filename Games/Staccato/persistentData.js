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
		records : [ { lap : 0, track : 0},
					{ lap : 0, track : 0},
					{ lap : 0, track : 0},
					{ lap : 0, track : 0},
					{ lap : 0, track : 0}
				],
		keys : 	[ 	[87, 65, 83, 68, 112], // W, A, S, D, F1 for camera
					[38, 40, 37, 39, 122]  // up, down, left and right arrows, F12 for camera
				]
	}
	var recordedData = localStorage.getItem("StaccatoData");
	if (recordedData) {
		this.data = JSON.parse(recordedData);

	}
}

PersistentData.prototype = {
	
	/**
	 * Private method to synchronize local storage with current data
	 */
	storeData : function() {
		localStorage.setItem("StaccatoData", JSON.stringify(this.data));
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
	setKey : function(player, index, key) {
		this.data.keys[player][index] = key;
		if (key>-1) {
			this.storeData();
		}
	},
	
	/**
	 * Compares the current lap and track times with the previous best.
	 * Records the new times if they improve on the former, and synchronize the local storage
	 * @param trackIndex index number of the track
	 * @param lapTime the new best lap, in frames
	 * @param trackTime the total track time, in frames
	 */

	recordTime : function(trackIndex, lapTime, trackTime) {
		if (this.data.records[trackIndex].lap > lapTime || this.data.records[trackIndex].lap == 0) {
			this.data.records[trackIndex].lap = lapTime;
		}
		if (this.data.records[trackIndex].track > trackTime || this.data.records[trackIndex].track == 0) {
			this.data.records[trackIndex].track = trackTime;
		}
		this.storeData();
	}
}
