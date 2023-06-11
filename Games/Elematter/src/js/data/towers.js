/*==============================================================================

Towers

==============================================================================*/

// gen from http://codepen.io/jackrugile/pen/tDJyv/

g.data.towers = {
	e: {
		type: 'e',
		counters: 'a',
		title: 'Earth',
		dmg: 'Medium',
		bonus: '+50% vs Air',
		rng: 'Medium',
		rte: 'Medium',
		stats: [{cst:200,dmg:15,rng:75,rte:30},{cst:250,dmg:21,rng:85,rte:28},{cst:313,dmg:30,rng:95,rte:26}]
	},
	w: {
		type: 'w',
		counters: 'f',
		title: 'Water',
		dmg: 'Medium',
		bonus: '+50% vs Fire',
		rng: 'Low',
		rte: 'High',
		stats: [{cst:300,dmg:15,rng:65,rte:25},{cst:375,dmg:21,rng:69,rte:22},{cst:469,dmg:30,rng:72,rte:19}]
	},
	a: {
		type: 'a',
		counters: 'w',
		title: 'Air',
		dmg: 'Low',
		bonus: '+50% vs Water',
		rng: 'High',
		rte: 'Medium',
		stats: [{cst:250,dmg:10,rng:85,rte:30},{cst:313,dmg:12,rng:102,rte:28},{cst:391,dmg:14,rng:121,rte:26}]
	},
	f: {
		type: 'f',
		counters: 'e',
		title: 'Fire',
		dmg: 'High',
		bonus: '+50% vs Earth',
		rng: 'Medium',
		rte: 'Low',
		stats: [{cst:250,dmg:20,rng:75,rte:35},{cst:313,dmg:33,rng:85,rte:33},{cst:391,dmg:55,rng:95,rte:32}]
	}
};