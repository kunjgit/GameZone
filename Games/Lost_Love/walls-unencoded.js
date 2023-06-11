/*	BUILD TOOL
DEV CODE - tool to build wall data per screen */
var wallData = [];
/* CONTAINING WALLS - used in MOST levels */
	wallData.push({x1:0, y1:0, x2:80, y2:0, v:0});
	wallData.push({x1:0, y1:60, x2:80, y2:60, v:0});
	wallData.push({x1:0, y1:0, x2:0, y2:60, v:1});
	wallData.push({x1:80, y1:0, x2:80, y2:60, v:1});

/* LEVEL SPECIFIC DATA OBJECTS
	These are the bits to cut and paste into main.js when testing / encoding wall sets.
	Encode one level at a time.
	Remember to copy the encoded string from console and add to a new/updated levelData object with other params */

// LEVEL - EASY TRAINING - FIRST LOVE
	wallData.push({x1:0, y1:20, x2:10, y2:20, v:0});
	wallData.push({x1:20, y1:20, x2:60, y2:20, v:0});
	wallData.push({x1:70, y1:20, x2:80, y2:20, v:0});
	wallData.push({x1:0, y1:30, x2:35, y2:30, v:0});
	wallData.push({x1:45, y1:30, x2:80, y2:30, v:0});
	wallData.push({x1:0, y1:40, x2:35, y2:40, v:0});
	wallData.push({x1:45, y1:40, x2:80, y2:40, v:0});
	wallData.push({x1:0, y1:50, x2:10, y2:50, v:0});
	wallData.push({x1:20, y1:50, x2:60, y2:50, v:0});
	wallData.push({x1:70, y1:50, x2:80, y2:50, v:0});

// LEVEL - L O S T
	wallData.push({x1:0, y1:10, x2:10, y2:10, v:0});
	wallData.push({x1:20, y1:10, x2:70, y2:10, v:0});
	wallData.push({x1:40, y1:20, x2:70, y2:20, v:0});
	wallData.push({x1:70, y1:30, x2:80, y2:30, v:0});
	wallData.push({x1:40, y1:30, x2:60, y2:30, v:0});
	wallData.push({x1:10, y1:40, x2:50, y2:40, v:0});
	wallData.push({x1:0, y1:50, x2:20, y2:50, v:0});
	wallData.push({x1:40, y1:50, x2:50, y2:50, v:0});
	wallData.push({x1:10, y1:0, x2:10, y2:40, v:1});
	wallData.push({x1:20, y1:10, x2:20, y2:30, v:1});
	wallData.push({x1:30, y1:20, x2:30, y2:40, v:1});
	wallData.push({x1:30, y1:50, x2:30, y2:60, v:1});
	wallData.push({x1:40, y1:20, x2:40, y2:30, v:1});
	wallData.push({x1:50, y1:20, x2:50, y2:30, v:1});
	wallData.push({x1:50, y1:40, x2:50, y2:50, v:1});
	wallData.push({x1:60, y1:10, x2:60, y2:20, v:1});
	wallData.push({x1:60, y1:30, x2:60, y2:60, v:1});
	wallData.push({x1:70, y1:30, x2:70, y2:60, v:1});

// LEVEL - PIRATE SKULL
	wallData.push({x1:10, y1:10, x2:30, y2:10, v:0});
	wallData.push({x1:50, y1:10, x2:70, y2:10, v:0});
	wallData.push({x1:0, y1:20, x2:10, y2:20, v:0});
	wallData.push({x1:20, y1:20, x2:30, y2:20, v:0});
	wallData.push({x1:50, y1:20, x2:70, y2:20, v:0});
	wallData.push({x1:30, y1:30, x2:60, y2:30, v:0});
	wallData.push({x1:20, y1:40, x2:40, y2:40, v:0});
	wallData.push({x1:50, y1:40, x2:60, y2:40, v:0});
	wallData.push({x1:10, y1:50, x2:70, y2:50, v:0});
	wallData.push({x1:20, y1:20, x2:20, y2:40, v:1});
	wallData.push({x1:30, y1:10, x2:30, y2:20, v:1});
	wallData.push({x1:40, y1:0, x2:40, y2:30, v:1});
	wallData.push({x1:40, y1:40, x2:40, y2:50, v:1});
	wallData.push({x1:50, y1:10, x2:50, y2:20, v:1});
	wallData.push({x1:60, y1:30, x2:60, y2:40, v:1});
	wallData.push({x1:70, y1:50, x2:70, y2:60, v:1});

// LEVEL - SNAIL
	wallData.push({x1:0, y1:10, x2:40, y2:10, v:0});
	wallData.push({x1:50, y1:10, x2:70, y2:10, v:0});
	wallData.push({x1:20, y1:20, x2:60, y2:20, v:0});
	wallData.push({x1:70, y1:20, x2:80, y2:20, v:0});
	wallData.push({x1:30, y1:30, x2:50, y2:30, v:0});
	wallData.push({x1:40, y1:40, x2:50, y2:40, v:0});
	wallData.push({x1:10, y1:50, x2:20, y2:50, v:0});
	wallData.push({x1:40, y1:50, x2:70, y2:50, v:0});
	wallData.push({x1:10, y1:20, x2:10, y2:50, v:1});
	wallData.push({x1:20, y1:20, x2:20, y2:50, v:1});
	wallData.push({x1:30, y1:30, x2:30, y2:60, v:1});
	wallData.push({x1:50, y1:30, x2:50, y2:40, v:1});
	wallData.push({x1:60, y1:20, x2:60, y2:50, v:1});
	wallData.push({x1:70, y1:10, x2:70, y2:50, v:1});

// LEVEL - SQUARE DANCE
	wallData.push({x1:10, y1:10, x2:70, y2:10, v:0});
	wallData.push({x1:30, y1:20, x2:60, y2:20, v:0});
	wallData.push({x1:30, y1:30, x2:60, y2:30, v:0});
	wallData.push({x1:40, y1:40, x2:70, y2:40, v:0});
	wallData.push({x1:20, y1:50, x2:80, y2:50, v:0});
	wallData.push({x1:10, y1:10, x2:10, y2:60, v:1});
	wallData.push({x1:20, y1:20, x2:20, y2:50, v:1});
	wallData.push({x1:30, y1:30, x2:30, y2:50, v:1});
	wallData.push({x1:60, y1:20, x2:60, y2:30, v:1});
	wallData.push({x1:70, y1:10, x2:70, y2:40, v:1});

// LEVEL - OUTSIDE THE BOX - do not include outside walls for this one
	wallData.push({x1:-10, y1:-10, x2:90, y2:-10, v:0});
	wallData.push({x1:0, y1:0, x2:80, y2:0, v:0});
	wallData.push({x1:0, y1:60, x2:80, y2:60, v:0});
	wallData.push({x1:-10, y1:70, x2:90, y2:70, v:0});
	wallData.push({x1:-10, y1:-10, x2:-10, y2:70, v:1});
	wallData.push({x1:0, y1:0, x2:0, y2:30, v:1});
	wallData.push({x1:0, y1:40, x2:0, y2:60, v:1});
	wallData.push({x1:40, y1:0, x2:40, y2:60, v:1});
	wallData.push({x1:80, y1:0, x2:80, y2:30, v:1});
	wallData.push({x1:80, y1:40, x2:80, y2:60, v:1});
	wallData.push({x1:90, y1:-10, x2:90, y2:70, v:1});

// LEVEL - Love can be cruel - do not include outside walls for this one
	wallData.push({x1:20, y1:-15, x2:60, y2:-15, v:0});
	wallData.push({x1:-10, y1:-10, x2:20, y2:-10, v:0});
	wallData.push({x1:60, y1:-10, x2:90, y2:-10, v:0});
	wallData.push({x1:30, y1:-5, x2:50, y2:-5, v:0});
	wallData.push({x1:-15, y1:0, x2:-10, y2:0, v:0});
	wallData.push({x1:0, y1:0, x2:10, y2:0, v:0});
	wallData.push({x1:50, y1:0, x2:60, y2:0, v:0});
	wallData.push({x1:70, y1:0, x2:80, y2:0, v:0});
	wallData.push({x1:-5, y1:10, x2:0, y2:10, v:0});
	wallData.push({x1:10, y1:10, x2:30, y2:10, v:0});
	wallData.push({x1:-15, y1:20, x2:-10, y2:20, v:0});
	wallData.push({x1:40, y1:20, x2:60, y2:20, v:0});
	wallData.push({x1:80, y1:20, x2:90, y2:20, v:0});
	wallData.push({x1:50, y1:30, x2:70, y2:30, v:0});
	wallData.push({x1:0, y1:60, x2:40, y2:60, v:0});
	wallData.push({x1:50, y1:60, x2:80, y2:60, v:0});
	wallData.push({x1:-10, y1:70, x2:10, y2:70, v:0});
	wallData.push({x1:30, y1:70, x2:60, y2:70, v:0});
	wallData.push({x1:70, y1:70, x2:90, y2:70, v:0});
	wallData.push({x1:20, y1:80, x2:70, y2:80, v:0});
	wallData.push({x1:-15, y1:0, x2:-15, y2:20, v:1});
	wallData.push({x1:-10, y1:-10, x2:-10, y2:0, v:1});
	wallData.push({x1:-10, y1:20, x2:-10, y2:70, v:1});
	wallData.push({x1:0, y1:0, x2:0, y2:30, v:1});
	wallData.push({x1:0, y1:40, x2:0, y2:60, v:1});
	wallData.push({x1:10, y1:0, x2:10, y2:10, v:1});
	wallData.push({x1:10, y1:60, x2:10, y2:70, v:1});
	wallData.push({x1:20, y1:-15, x2:20, y2:0, v:1});
	wallData.push({x1:20, y1:60, x2:20, y2:80, v:1});
	wallData.push({x1:30, y1:-5, x2:30, y2:10, v:1});
	wallData.push({x1:40, y1:20, x2:40, y2:60, v:1});
	wallData.push({x1:50, y1:-5, x2:50, y2:0, v:1});
	wallData.push({x1:50, y1:30, x2:50, y2:60, v:1});
	wallData.push({x1:60, y1:-15, x2:60, y2:-10, v:1});
	wallData.push({x1:60, y1:0, x2:60, y2:20, v:1});
	wallData.push({x1:60, y1:60, x2:60, y2:70, v:1});
	wallData.push({x1:70, y1:0, x2:70, y2:30, v:1});
	wallData.push({x1:70, y1:70, x2:70, y2:80, v:1});
	wallData.push({x1:80, y1:0, x2:80, y2:40, v:1});
	wallData.push({x1:80, y1:50, x2:80, y2:60, v:1});
	wallData.push({x1:90, y1:-10, x2:90, y2:70, v:1});