/**
 * @constructor
 */
function Track()
{	
	this.tileMap = new Array(256);		// tile contents
	this.tileStep = new Array(256);	// as stepped through during the race
	this.roadSizeWidth = .1;

	this.trackName = [	"Training Grounds",
						"Indefinite Loop",
						"Winding Heights",
						"Gordian Knot Interchange",
						"Maelstrom Speedway"
						];	
}

Track.prototype = {

	/**
	 * Returns the contents of the tile at (x,y)
	 * -1 if out of bounds
	 */
	getTileAt : function(x, y)
	{
		return this.tileMap[(y*16+x)&255];
	},

			
	/**
	 * Returns the altitude at (x,y) at the given section
	 * If they are fractional coordinates, altitude is interpolated
	 * 
	 */
	getRealAltitudeAt : function(x, y, step)
	{
		if (step<0 || step>=this.totalSteps) {
			return -1;
		}
		var section = this.sections[step];
		var altitude = section.z + section.steepness*[x-section.x, 0, y-section.y, 0, section.x+1-x, 0, section.y+1-y][section.dir&7];
		return altitude;
	},
	
	/**
	 * Returns the tile step at (x,y)
	 * This represents, in order, the steps (or checkpoints), one for each tile
	 * to go through to complete a laps. It it part of a mechanism designed to
	 * ensure the car actually completes a lap.
	 * -1 if out of bounds
	 */
	getStepAt : function(x,y)
	{
		return this.tileStep[(y*16+x)&255];
	},

	
	/**
	 * Test if the provided coordinates are within the road or offroad
	 * Used for detection of car vs scenery collisions
	 * @param tile the index of the tile
	 * @param wX the world-coordinate X inside the tile - should be in [0, 1]
	 * @param wY the world-coordinate Y inside the tile - should be in [0, 1]
	 * @return { offRoad : true if collision, angle : the angle of the exerted force }
	 */
	testOffRoad : function(tile, wX, wY)
	{
		var tileAngle = Math.PI*(tile&3)/2;
		var c = Math.cos(tileAngle), s = Math.sin(tileAngle);
		var tX = .5+c*(wX-.5)+s*(wY-.5);
		var tY = .5-s*(wX-.5)+c*(wY-.5);
		var forceAngle = 0;
		var offRoad = false;
		switch (tile>>2) {
			case 0 : 
				offRoad = (tY<this.roadSizeWidth || tY>1-this.roadSizeWidth);
				forceAngle = Math.PI*(tY<this.roadSizeWidth?.5:1.5);
				break;
			case 1 : 
				var dist = Math.sqrt(tX*tX+tY*tY);
				offRoad = (dist<this.roadSizeWidth || dist>1-this.roadSizeWidth);
				forceAngle = Math.atan2(tY, tX)+(dist<this.roadSizeWidth?0:Math.PI);
				break;
			default:
		}
		return { offRoad : offRoad, angle : forceAngle+tileAngle };
	},
	
	createTrack : function(trackIndex)
	{
		var desc = this.getTrackDescription(trackIndex);
		this.totalSteps = 0;
		for (var i=0; i<256; ++i) {
			this.tileMap[i]=this.tileStep[i]=-1;
		}
		this.sections=[];
		
		var dX = [1, 1, 0, -1, -1, -1, 0, 1], dY = [0, 1, 1, 1, 0, -1, -1, -1];
		/*
		 -1 = nothing
		  0 = straight line, to east
		  1 = straight line, to north
		  2 = straight line, to west
		  3 = straight line, to south
		  4 = 90° bend, left to bottom
		  5 = 90° bend, top to left
		  6 = 90° bend, top to right
		  7 = 90° bend, right to bottom
		 */
		var dI = [[7, -1, 4, -1, 5, -1, 6, -1], // left 90°
				  [], // left 45° - not implemented
				  [0, -1, 1, -1, 2, -1, 3, -1],	// straight
				  [], // right 45° - not implemented
				  [4, -1, 5, -1, 6, -1, 7, -1]  // right 90°
				 ];
		this.landscapeSeed = desc[0];
		var x=desc[1], y=desc[2], currentAltitude=desc[3], dir=2, offset=4;
		
		while (offset<desc.length) {
			var angle = desc[offset];
			var distance = desc[offset+1];
			var deltaH = desc[offset+2];
			for (var index=0; index<distance; ++index) {
				var newTile = dI[2+angle][dir];
				// each section in a curve, and beginning and end sections of a straight line are landmarks
				// landmarks are used as target for CPU cars
				this.sections.push({angle:angle, dir:dir, x:x, y:y, z:currentAltitude, tile:newTile, steepness:deltaH, landmark:(angle!=0||index==0||index==distance-1)});
				this.tileMap[y*16+x] = newTile;
				var step = this.tileStep[y*16+x];
				if (step == -1) {	// empty tile : create a track block
					step = this.totalSteps++;
				} else if (currentAltitude < this.sections[step].z) {	// crossing, the new section is below
					step = (step<<8) + this.totalSteps++;
				} else {	// crossing, the new section is above
					step = ((this.totalSteps++)<<8) + step;
				}
				// for crossing, the step in the lower eight bits (step&255) is always below the bridge
				// this is used in the display
				this.tileStep[y*16+x] = step;
				dir=(dir-angle)&7;
				x+=dX[dir];
				y+=dY[dir];
				currentAltitude+=deltaH;
			}
			offset+=3;
		}

	},
	
		/**
	 * Returns the track description for a given level.
	 * The description is intended to be used by Track.createTrack()
	 * @param level 0-based level (0 to ...)
	 * @return track description, false if out of bounds
	 *
	 * Format
	 *  - float seed for the pseudorandom generator
	 *  - three values for start X, Y and Altitude.
	 *  - groups of three values for each block
	 *     * angle : -2 for 90° left, -1 for 45° left, 0 for straight, 1 for 45° right, 2 for 90° right
	 *     * distance in blocks. 2 with a 90° angle will produce a U-turn
	 *     * delta altitude : +1 to increase 1m. Underpasses should be at least 2m high, but the slope can be several blocks long.
	 */
	getTrackDescription : function(level) {
		return [
		/*
				// First test track
				[.4, 
				2, 7, 0,
				0, 4, 0, 0, 1, 2,
				0, 2, 0, -2, 2, 0,
				0, 1, -2, -2, 1, 0,
				0, 2, 0, -2, 1, 0, 
						  2, 1, 0,
				0, 1, 0, 0, 1, 2,
				0, 2, 0, 0, 2, -1,
				0, 3, 0, 2, 1, 0,
				0, 12, 0, 2, 1, 0,
				0, 12, 0, 2, 1, 0,
				0, 2, 0, 2, 1, 0,
				-2, 1, 0,
				0, 3, 0],
				*/
				// Training Ground
				[.2,
				4, 10, 0, 
				         2, 1, 0, 
				0, 6, 0, -2, 1, 0,
				0, 1, 0, -2, 1, 0,
				0, 2, 1, -2, 1, 0, 
				0, 3, 0, -2, 1, 0, 
				0, 1, 0, 2, 1, 0,
				0, 2, 0, 2, 1, 0,
				0, 6, 0, -2, 1, 0,
				0, 1, 0, -2, 1, 0,
				0, 2, -1, -2, 1, 0,
				0, 2, 0, -2, 1, 0, 
				0, 1, 0, 2, 1, 0,
				0 ,3, 0],
				// Indefinite Loop
				[.3,
				7, 8, 0, 
				0, 3, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 6, 0, -2, 1, 0,
				0, 2, 0, -2, 1, 0,
				0, 2, 0,
				0, 2, 1, -2, 1, 0,
				0, 7, 0, -2, 1, 0,
				0, 1, 0, -2, 1, 0,
				          2, 2, 0, 
						 -2, 2, 0, 
				0, 5, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 2, -1, 2, 1, 0,
				0, 4, 0],
				// Winding heights
				[.6,
				5, 10, 2,
				0, 1, 1, -2, 2, 0, 
				0, 1, 2, 2, 2, 0,
				0, 1, 1,
				0, 1, 2,
				0, 1, 1, 2, 1, 0,
				0, 1, 1,
				0, 6, 0, 2, 2, 0,
				0, 2, -1,
				0, 1, 0, -2, 2, 0,
				0, 2, 0,
				0, 2, -1,
				0, 1, 0, 2, 1, 0,
				0, 1, -1, 2, 1, 0,
				0, 1, 0, -2, 1, 0,
				0, 1, 0,
				0, 1, -1,
				0, 3, 0, -2, 1, 0,
				0, 1, -1 ,-2, 1, 0,
				0, 1, -1, -2, 1, 0,
				0, 5, 0, 2, 1, 0,
				0, 2, 0, 2, 1, 0, 
				0, 1, -1, 2, 1, 0,
				0, 1, -1, 
				0, 3, 0, 2, 1, 0,
				0, 5, 0, 2, 1, 0, 
				0, 1, 1, 2, 1, 0,
				         -2, 1, 0, 
				0, 1, 1, 2, 1, 0,
				         -2, 1, 0,
				0, 2, 0 ],
				// Gordian Knot Interchange
				[.99,
				9, 12, 2, 
				0, 1, 0, -2, 1, 0, 
				0, 2, 0, -2, 1, 0, 
				0, 9, 0, -2, 1, 0, 
				0, 1, 1, 
				0, 2, 0, -2, 1, 0,
				0, 1, -1,
				0, 9, 0, 2, 1, 0,
				0, 3, 0, 2, 1, 0,
				0, 2, -1, 2, 1, 0,
				0, 12, 0, 2, 1, 0,
				0, 2, 1, 2, 1, 0,
				0, 3, 0, 2, 1, 0,
				0, 12, 0, -2, 1, 0,
				0, 4, 0,
				0, 2, 1, -2, 1, 0,
				0, 4, 0, -2, 1, 0,
				         2, 1, 0,
			    0, 1, -2, 
				0, 4, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 1, 0, -2, 1, 0,
				         2, 2, 0,
				0, 2, 1,
				0, 3, 0, 2, 1, 0,
				         -2, 2, 0,
				0, 1, -2,
				0, 2, 0, -2, 2, 0,
				0, 1, 2, -2, 1, 0,
				0, 4, 0,
				0, 2, -1, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				         -2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 5, 0, 2, 1, 0,
				         -2, 1, 0,
				0, 3, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 2, -1, 2, 1, 0,
				0, 12, 0, 2, 1, 0,
				0, 2, 0, 2, 1, 0, 
				0, 3, 0, 
				0, 1, 1, 2, 1, 0, 
				0, 1, 0,
				0, 1, 1,
				0, 7, 0],
				// Maelstrom Speedway
				[.9,
				10, 7, 6,
				0, 2, -1,
				0, 3, 0, -2, 1, 0, 
				0, 1, 0,
				0, 2, -1, -2, 1, 0,
				0, 3, 0,
				0, 2, -1,
				0, 2, 0, -2, 1, 0,
				0, 5, 0, 2, 1, 0,
				0, 1, 2, 2, 1, 0,
				0, 3, 0,
				0, 2, 1,
				0, 1, 0,
				0, 2, 1, 2, 1, 0,
				0, 2, 0, 2, 1, 0,
				0, 3, 0, 
				0, 2, -1,
				0, 3, 0, -2, 1, 0, 
				0, 1, 0,
				0, 2, -1, -2, 1, 0,
				0, 3, 0, 
				0, 2, -1, 
				0, 2, 0, -2, 1, 0, 
				0, 5, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				         -2, 1, 0,
						 2, 1, 0,
				0, 1, 2, 2, 1, 0,
				         -2, 1, 0,
				0, 1, 0, -2, 1, 0, 
				         2, 1, 0,
				0, 1, 2, 2, 1, 0,
				         -2, 1, 0,
				0, 1, 0, -2, 1, 0, 
				         2, 1, 0,
				0, 1, 2, 2, 1, 0,
				0, 3, 0, 2, 1, 0,
				0, 5, 0,
				0, 2, -1,
				0, 3, 0, -2, 1, 0,
				0, 1, 0,
				0, 2, -1, -2, 1, 0,
				0, 3, 0,
				0, 2, -1, 
				0, 2, 0, -2, 1, 0,
				0, 5, 0, 2, 1, 0,
				0, 1, 2, 2, 1, 0,
				0, 10, 0, 2, 1, 0, 
				0, 2, 2, 2, 1, 0,
				0, 5, 0,
				0, 2, -1, 
				0, 3, 0, -2, 1, 0,
				0, 1, 0,
				0, 2, -1, -2, 1, 0,
				0, 3, 0,
				0, 2, -1, 
				0, 2, 0, -2, 1, 0, 
				0, 7, 0, 2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 4, 0, -2, 1, 0,
				         2, 1, 0, 
				0, 1, 2, 2, 1, 0,
				         -2, 1, 0,
				0, 1, 2, -2, 1, 0,
				         2, 1, 0,
				0, 1, 2, 2, 1, 0, 
				         -2, 1, 0,
				0, 1, 0, 2, 1, 0,
				0, 2, 0, 2, 1, 0,
				0, 5, 0]
				][level];
				
	}

}
