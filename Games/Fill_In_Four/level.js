var LEVEL = [
	{ // level 1
		lines: [
			[0, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT]
		],
		parts: [
			[0, 0, WIDTH/2, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT/2],
			[0, HEIGHT/2, WIDTH/2, HEIGHT/2],
			[WIDTH/2, HEIGHT/2, WIDTH/2, HEIGHT/2]
		],
		neighbours: [
			[0, 1, 1, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 0]
		]
	},
	{ // level 2
		lines: [
			[0, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT],
			[0, HEIGHT/4, WIDTH/2, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/2],
		],
		parts: [
			[0, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			[0, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/4, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/2, 0, WIDTH/2, HEIGHT/2],
			[0, HEIGHT/2, WIDTH/2, HEIGHT/2],
			[WIDTH/2, HEIGHT/2, WIDTH/2, HEIGHT/2]
		],
		neighbours: [
			[0, 1, 1, 1, 0, 0, 0],
			[1, 0, 1, 1, 1, 0, 0],
			[1, 1, 0, 1, 0, 1, 0],
			[1, 1, 1, 0, 1, 1, 1],
			[0, 1, 0, 1, 0, 1, 1],
			[0, 0, 1, 1, 1, 0, 1],
			[0, 0, 0, 1, 1, 1, 0],
		]
	},
	{ // level 3
		lines: [
			[0, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT],
			[0, HEIGHT/4, WIDTH/2, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/2],
			[WIDTH/2, 3*HEIGHT/4, WIDTH, 3*HEIGHT/4],
			[3*WIDTH/4, HEIGHT/2, 3*WIDTH/4, HEIGHT],
		],
		parts: [
			[0, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			[0, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/4, HEIGHT/4, WIDTH/4, HEIGHT/4],
			
			[WIDTH/2, 0, WIDTH/2, HEIGHT/2],
			[0, HEIGHT/2, WIDTH/2, HEIGHT/2],
			
			[WIDTH/2, HEIGHT/2, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, HEIGHT/2, WIDTH/4, HEIGHT/4],
			[WIDTH/2, 3*HEIGHT/4, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, 3*HEIGHT/4, WIDTH/4, HEIGHT/4],
		],
		neighbours: [
			[0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
			[1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
			[1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
			[1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
			[0, 1, 0, 1, 0, 1, 1, 1, 0, 0],
			[0, 0, 1, 1, 1, 0, 1, 0, 1, 0],
			[0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
			[0, 0, 0, 0, 1, 0, 1, 0, 1, 1],
			[0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
		]
	},
	{ // level 4
		lines: [
			[0, HEIGHT/3, WIDTH, HEIGHT/3],
			[0, 2*HEIGHT/3, WIDTH, 2*HEIGHT/3],
			
			[WIDTH/3, 0, WIDTH/3, HEIGHT],
			[2*WIDTH/3, 0, 2*WIDTH/3, HEIGHT]
		],
		parts: [
			[0, 0, WIDTH/3, HEIGHT/3],
			[WIDTH/3, 0, WIDTH/3, HEIGHT/3],
			[2*WIDTH/3, 0, WIDTH/3, HEIGHT/3],

			[0, HEIGHT/3, WIDTH/3, HEIGHT/3],
			[WIDTH/3, HEIGHT/3, WIDTH/3, HEIGHT/3],
			[2*WIDTH/3, HEIGHT/3, WIDTH/3, HEIGHT/3],
			
			[0, 2*HEIGHT/3, WIDTH/3, HEIGHT/3],
			[WIDTH/3, 2*HEIGHT/3, WIDTH/3, HEIGHT/3],
			[2*WIDTH/3, 2*HEIGHT/3, WIDTH/3, HEIGHT/3],
		],
		neighbours: [
			[0, 1, 0,  1, 1, 0,  0, 0, 0],
			[1, 0, 1,  1, 1, 1,  0, 0, 0],
			[0, 0, 0,  0, 0, 0,  0, 0, 0],
			
			[1, 1, 0,  0, 1, 0,  1, 1, 0],
			[1, 1, 1,  1, 0, 1,  1, 1, 1],
			[0, 1, 1,  0, 1, 0,  0, 1, 1],
			
			[0, 0, 0,  1, 1, 0,  0, 1, 0],
			[0, 0, 0,  1, 1, 1,  1, 0, 1],
			[0, 0, 0,  0, 1, 1,  0, 1, 0],
		]
	},
	{ // level 5
		lines: [
			[0, HEIGHT/4, WIDTH, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT],
			[0, 3*HEIGHT/4, WIDTH, 3*HEIGHT/4],
			[3*WIDTH/4, 0, 3*WIDTH/4, HEIGHT],
			[0, HEIGHT/2, WIDTH/4, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT/4],
			[3*WIDTH/4, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 3*HEIGHT/4, WIDTH/2, HEIGHT]
		],
		parts: [
			[0, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/2, 0, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			
			[0, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/4, HEIGHT/4, WIDTH/2, HEIGHT/2],
			[3*WIDTH/4, HEIGHT/4, WIDTH/4, HEIGHT/4],
			
			[0, HEIGHT/2, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, HEIGHT/2, WIDTH/4, HEIGHT/4],
			
			[0, 3*HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/4, 3*HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/2, 3*HEIGHT/4, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, 3*HEIGHT/4, WIDTH/4, HEIGHT/4],
		],
		neighbours: [
			[0, 1, 0, 0,  1, 1, 0,  0, 0,  0, 0, 0, 0],
			[1, 0, 1, 0,  1, 1, 0,  0, 0,  0, 0, 0, 0],
			[0, 1, 0, 1,  0, 1, 1,  0, 0,  0, 0, 0, 0],
			[0, 0, 1, 0,  0, 1, 1,  0, 0,  0, 0, 0, 0],
			
			[1, 1, 0, 0,  0, 1, 0,  1, 0,  0, 0, 0, 0],
			[1, 1, 1, 1,  1, 0, 1,  1, 1,  1, 1, 1, 1],
			[0, 0, 1, 1,  0, 1, 0,  0, 1,  0, 0, 0, 0],
			
			[0, 0, 0, 0,  1, 1, 0,  0, 0,  1, 1, 0, 0],
			[0, 0, 0, 0,  0, 1, 1,  0, 0,  0, 0, 1, 1],
			
			[0, 0, 0, 0,  0, 1, 0,  1, 0,  0, 1, 0, 0],
			[0, 0, 0, 0,  0, 1, 0,  1, 0,  1, 0, 1, 0],
			[0, 0, 0, 0,  0, 1, 0,  0, 1,  0, 1, 0, 1],
			[0, 0, 0, 0,  0, 1, 0,  0, 1,  0, 0, 1, 0],
		]
	}
]