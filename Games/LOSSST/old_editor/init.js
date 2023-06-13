// GLOBALS
// =======

var 

// Debug
//=======

// Rotate camera
move_scene = (rot) => {
  scene.style.transform = "translateX(-"+(snakex[head]*sidesize)+"vh)translateY(-"+(snakey[head]*sidesize)+"vh)translateZ(15vh)rotateX(40deg)rotateZ(" + rot + "rad)";
},

// Meta
//=======

L = localStorage,
P = "lossst_",
easteregg = 0,
son = +L[P+"son"] || 0,
mobile = +L[P+"mobile"] || 0,
ocd_time = +L[P+"time"] || 0,
ocd_moves = +L[P+"moves"] || 0,
int_time = 0,
touchintervals = [],

// Snake
//=======

// cubes side size in vh (default: 6, but in the editor it can be resized)
sidesize = 7,

// Number of moves recorded
head = 0,

// snakex/y/z contains the current X, Y, Z coordinates of the head (and all its previous positions)
// One value is pushed every time the snake moves
// Ex: head_X = snakex[head]; tail_X = snakex[xhead - snakelength]
snakex = [],
snakey = [],
snakez = [],

// Z-axis rotation of each cube in radians
snakeangle = [],

// Snake length in cubes (default: 5)
// Synchronized with localStorage
snakelength = L[P+"snakelength"] = +L[P+"snakelength"] || 5,

// Game
//=======

// Are we in the editor
iseditor = 0,

// Playing (0: editor / 1: in-game)
playing = 1,

// Playing a puzzle
puzzling = 0,

// Keyboard input (control snake's cubes): up, right, down, left, shift, ctrl, backspace
u = r = d = l = s = c = B = 0,

// Keyboard lock
lock = 0,

// Emoji
trees = [],
apples = [],

// doors
doors = [],

// Cubes
cubes = [],

// Hints
hints = [],

// Emoji
emoji = [],

// Puzzles
puzzles = [],
currentpuzzle = null,
cellprefix = 'e',
dg = [],
dw = [],
hasground = 0,
haswall = 0,
haswrap = 0,
issolved = 0,
leftoffset = 0,
topoffset = 0,
size = 0,
totalsolved = +L[P+"totalsolved"] || 0,
exithead = 0,
inbounds = 0,

// Stuck
stuck = 0,

// Page
pagename = "",

// Page size
w = h = 0,

// Game
//=======

// Enter a room
enterroom = () => {
  
  // Mac hack
  if(navigator.userAgent.indexOf("Macintosh") >- 1){
    perspective.className = "mac";
  }
  
  // Fx hack
  if(navigator.userAgent.indexOf("Firefox") >- 1){
    perspective.className = "fx";
  }
  
  // Mobile hacks
  if(mobile){
    perspective.className = "mobile";
  }
  
  // Set room name to the body
  b.className = pagename;
  
  
  // Empty father container if son returns to hub
  if(son && !iseditor){
    snake.innerHTML = "";
  }
  
  if(pagename == "load"){
    w = 20;
    h = 20;
    trees = [];
    apples = [];
    doors = [];
    cubes = [];
    puzzles = [eval("["+(location.hash.slice(1).replace(/[01]{2,}/g,'"$&"'))+"]")];
    snakelength = puzzles[0][1];
    puzzles[0][5] = puzzles[0][6] = 8; 
    son = !!puzzles[0][3];
    hints = [
      ["Move: arrow keys<br>"+(son?"Up/Down: Shift/Ctrl<br>":"")+"backtrack: Alt<br>Reset: R", 1, 5, 1, 0, son, 0],
    ];
    if(L[P+"puzzleload0"]) delete L[P+"puzzleload0"];
    L[P+"doorload0"] = 1;
  }
  
  // Hub (start, tuto, access to 2D, wrap and 3D puzzles)
  // ----
  else if(pagename == "hub"){
  
    w = 40;
    h = 20;
    
    // Trees (x, y, z)
    trees = [
      [13,9,0],
      [7,13,0],
      [35,8,0],
    ];

    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [11,11,0,0,0],
      [2,12,0,6,0],
      [38,10,0,7,0],
    ];
    
    // Doors
    // 0: x (path center)
    // 1: y (path center)
    // 2: angle
    // 3: min snake length
    // 4: min solved puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z (path center)
    // 10: color (0: orange / 1: black)
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "1-1", 1, 0, 10, 0, 0],
      [20, -2, 0, 14, 0, "2-1", 1, 10, 19, 0, 0],
      [-2, 11, -Math.PI / 2, 6, 0, "3-1", 1, 14, 5, 1, 1],
      [28, 21, Math.PI, 14, 0, "1-4", 1, 22, 1, 0, 0],
      [5, 21, Math.PI, 5, 0, "2-5", 1, 36, 1, 0, 1],
    ];
    
    puzzles = [];
    
    cubes = [];
    for(i = 9; i < 15; i++){
      for(j = 0; j < 5; j++){
        if((j == 2 && i == 14) || (j == 2 && i == 13) || (j == 3 && i == 13) || (j == 3 && i == 12) || (j == 2 && i == 12)){
        }
        else {
          cubes.push([j,i]);          
        }
      }
    }
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length (if any)
    // 4: max snake length (if any)
    // 5: son?
    // 6: z
    hints = [
      ["Move with<br>arrow keys" + (mobile ? "" : " or WASD/ZQSD"), 19, 5, 0, 13, 0],
      ["Use the " + (mobile ? "↩" : "Alt") + " key to backtrack", 1, 9, 0, 13, 0, 1],
      ["Doors indicate the snake size required to open them", 35, 14, 0, 13, 0],
      ["2D puzzle editor<br>↓", 18, 8, 14, 0, 0],
      ["↑<br>New puzzles!", 22, 3, 14, 0, 0],
      ["New ! Puzzle editor with wraps<br>↓", 19, 8, 6, 7, 1],
      ["←<br>New puzzles!", 1, 9, 6, 7, 1, 1],
      ["Full puzzle editor (2D, 3D & wraps!)<br>↓", 19, 8, 7, 0, 1],
    ];
    
    emoji = [
      ["🐿️", 37, 7],
    ];
    
  }
  
  // 1-1 (puzzles 2D length 8)
  // Puzzles solved before: 0
  // Puzzles solved after: 6
  // ----
  
  else if(pagename == "1-1"){
      
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,15,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [33,16,0,0,6],
      [34,17,0,0,6],
      [37,15,0,0,6],
    ];
    
    cubes = [
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [-2, 10, -Math.PI / 2, 8, 0, "hub", 0, 39, 11, 0, 0],
      [35, 21, Math.PI, 11, 0, "1-3", 1, 35, 1, 0, 0]
    ];
    
    // Puzzles
    puzzles = [
      [6,8,0,,"000000001000001110001110001000000000",2,3],
      [6,8,0,,"000000011000011100010000011000000000",14,3],
      [6,8,0,,"000000000100001100011000011100000000",26,3],
      [5,8,0,,"0000001110011100110000000",2,13],
      [6,8,0,,"000000011000011000001100001100000000",14,13],
      [6,8,0,,"000000000100001100001110001100000000",26,13],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Cover the black shapes to solve puzzles", 9, 9, 1, 0],
      ["Solve all the puzzles in the room to get new apples and open a new door", 21, 9, 1, 0],
      ["Your progress is saved automatically", 34, 9, 1, 0],
    ];
    
    emoji = [
      ["🐌", 11, 10],
    ]
    
  }
  
  // 1-3 (puzzles 2D length 11)
  // Puzzles solved before: 6
  // Puzzles solved after: 12
  // ----
  
  else if(pagename == "1-3"){
    
    // Show mobile button Reset
    if(mobile){
      k_reset.className = "";
      L[P+"reset"] = 1;
    }
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [4,7,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [2,8,0,0,12],
      [3,9,0,0,12],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [35, -2, 0, 8, 0, "1-1", 0, 35, 19, 0, 0],
      [-2, 10, -Math.PI / 2, 13, 0, "1-4", 1, 39, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,11,0,,"000000011110011010011110000000000000",8,2],
      [7,11,0,,"0000000001110000111000001100000110000010000000000",18,2],
      [6,11,0,,"000000011000011110001010001110000000",28,2],
      [6,11,0,,"000000011100001110001110001100000000",8,12],
      [6,11,0,,"000000001110001110001110001010000000",18,12],
      [6,11,0,,"000000011110011110001100001000000000",28,12],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["If you get stuck, " + (mobile ? "click ×" : "press R") + " to exit a puzzle", 35, 11, 1, 0],
      ["If a puzzle looks impossible, try another entry!", 14, 10, 1, 0],
    ];
    
    cubes = [
      [11,4],
      [21,16],
    ];
    
    emoji = [
      ["🐈", 4, 14],
    ]
  }
  
  // 1-4 (2D puzzles length 13)
  // Puzzles solved before: 12
  // Puzzles solved after: 18
  else if(pagename == "1-4"){
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [34,11,0,0,18],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "1-3", 0, 1, 10, 0, 0],
      [22, -2, 0, 14, 0, "hub", 1, 28, 19, 0, 0]
    ];
    
    // Puzzles
    puzzles = [
      [7,13,0,,"0000000000000001111000111100001111000100000000000",2,3],
      [7,13,0,,"0000000001110000101000011100001110000110000000000",14,3],
      [6,13,0,,"000000001110011110011010001110000000",26,4],
      [7,13,0,,"0000000001100000111000011100001110000110000000000",2,12],
      [7,13,0,,"0000000000000001111100101010011111000000000000000",14,12],
      [6,13,0,,"000000011000011100011110011110000000",26,12],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["↑<br>After this room, go north to test a puzzle editor and a new kind of puzzles!", 22, 11, 13, 0, 0],
    ];
    
    cubes = [
      [17,5],
      [18,8],
      [29,7],
      [27,5],
      [27,8],
      [29,13],
      [30,13],
      [30,14],
      [18,15],
      [16,15],
      [6,13],
      [6,17],
      [7,8],
      [6,8],
      [5,8],
      [3,7],
      [3,8],
      [7,6],
      [7,5],
    ];
    
    emoji = [
      ["🦋<br><br>", 29, 13],
    ]
  }
  
  // 2-1 (2D puzzle with wrap, length 14)
  // Puzzles solved before: 18
  // Puzzles solved after: 19
  else if(pagename == "2-1"){
    
    w = 20;
    h = 20;
    
    // Trees
    trees = [
      [10, 2, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, 21, Math.PI, 14, 0, "hub", 0, 20, 0, 0, 0],
      [-2, 5, -Math.PI / 2, 14, 0, "2-15", 0, 24, 12, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [7,14,1,,"0100010011111000000000000000000000001111100100010",7,7],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Now you're thinking with wraps!", 2, 2, 0, 14, 0], 
    ];
    
    cubes = [];
    
    for(i = 0; i < 20; i++){
      cubes.push([i, 10]);
    }
    
    emoji = [
      ["🐐", 12, 2],
    ]
  }
  
  // 2-15 (2D, wrap, length 14)
  // Puzzles solved before: 19
  // Puzzles solved after: 23
  else if(pagename == "2-15"){
    
    w = 25;
    h = 25;
    
    // Trees
    trees = [
      [5, 12, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 14, 0, 0, 23],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [26, 12, Math.PI / 2, 14, 0, "2-1", 0, 0, 5, 0, 0],
      [-2, 12, -Math.PI / 2, 15, 0, "2-2", 1, 79, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [7,14,1,,"1000001000000000000000010100011011011000111000001", 15, 3],
      [6,14,1,,"110011100001000000100001100001110011", 15, 17],
      [5,14,1,,"1100111001100011001110011", 3, 3],
      [6,14,1,,"000011000011110001110001000011000011", 3, 17],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Reminder:<br>use " + (mobile ? "↩" : "Alt") + " to backtrack,<br>" + (mobile ? "×" : "R") + " to exit a puzzle.", 11, 12, 1, 0, 0], 
    ];
    
    cubes = [
    ];
    
    emoji = [
      ["🐒", 12, 20],
    ]
    
  }
  
  // 2-2 (2D puzzle with wrap, length 15, easter egg)
  // Puzzles solved before: 23
  // Puzzles solved after: 35
  else if(pagename == "2-2"){
    
    w = 80;
    h = 20;
    
    // Trees
    trees = [
      [35, 10, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 11, 0, 0, 35],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [81, 5, Math.PI / 2, 15, 0, "2-15", 0, 0, 12, 0, 0],
      [-2, 15, -Math.PI / 2, 16, 0, "2-3", 1, 19, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [5,5,1,,"0111101001010110100011111", 59, 13], // J
      [5,5,1,,"1111011000111100001011110", 48, 13],
      [5,5,1,,"1111101000011110111001100", 37, 13],
      [5,5,1,,"1111110000111001000011111", 26, 13],
      [5,5,1,,"1100101101001110011101101", 15, 13],

      [5,5,1,,"1111100001110010000111111", 59, 2], // G
      [5,5,1,,"1000110111100011000111111", 48, 2],
      [5,5,1,,"1000110101101011111110001", 37, 2],
      [5,5,1,,"1111110001000110000111111", 26, 2],
      [5,5,1,,"0111101100011100011011110", 15, 2],

      [5,5,1,,"1111101111001110001100001", 4, 8], // Triangle
      [5,5,1,,"1010100101111010000111111", 71, 8], // Zigouigoui
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["This room hides a surprise!", 72, 2, 0, 15, 0],
    ];
    
    cubes = [];
    
    emoji = [];
    
  }
  
  // 2-3 (2D puzzle with wrap, length 16)
  // Puzzles solved before: 35
  // Puzzles solved after: 37
  else if(pagename == "2-3"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [5, 25, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 24, 0, 0, 37],
      [7, 25, 0, 0, 37],
      [2, 26, 0, 0, 37],
      [3, 28, 0, 0, 37],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, 31, Math.PI, 16, 0, "2-4", 1, 10, 1, 0, 0],
      [21, 5, Math.PI/2, 16, 0, "2-2", 0, 1, 15, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,16,1,,"001000011000011100111111001110001000", 7, 6],
      [6,16,1,,"110001100001000111000111100001110001", 7, 18],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      
    ];
    
    cubes = [];
    
    emoji = [
      ["🐁", 9, 14],
    ];
  }
  
  // 2-4 (2D puzzle with wrap, length 20)
  // Puzzles solved before: 37
  // Puzzles solved after: 39
  else if(pagename == "2-4"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [16, 22],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [18, 22, 0, 0, 39],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, -2, 0, 20, 0, "2-3", 0, 10, 29, 0, 0],
      [21, 25, Math.PI/2, 21, 0, "2-5", 1, 1, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,16,1,,"001000011110111111011110011110001000", 7, 6],
      [6,16,1,,"110001100001000011000111001111111111", 7, 18],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [];
    
    emoji = [
      ["🦆", 9, 14],
    ];
  }
  
  // 2-5 (change snake)
  // Puzzles solved before: 39
  // Puzzles solved after: 39
  else if(pagename == "2-5"){
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 2, 0, 5, 0],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [-2, 10, -Math.PI/2, 1, 0, "2-4", 0, 19, 25, 0, 0],
      [36, -2, 0, 6, 0, "hub", 1, 5, 19, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Guess what, you finished the first half of the game!", 5, 9, 1, 0],
      ["Little snake can move up and down with " + (mobile ? "⬆︎ and ⬇︎" : "Shift and Ctrl keys") + ", and open black doors", 30, 9, 1, 0],
    ];
    
    cubes = [];
    
    for(i=0;i<7;i++) cubes.push([31, i]);
    for(i=31;i<40;i++) cubes.push([i, 6]);
    
    emoji = [
      ["🐢", 13, 14],
    ]
  }
  
  // 3-1 (3D puzzles, length 6, wall and wall+gtound)
  // Puzzles solved before: 39
  // Puzzles solved after: 47
  else if(pagename == "3-1"){
    
    w = 15;
    h = 70;
    
    // Trees
    trees = [
      [2, 62],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [2, 65, 0, 0, 47],
      [1, 66, 0, 0, 47],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 5, Math.PI / 2, 6, 0, "hub", 0, 1, 11, 0, 1],
      [-2, 65, -Math.PI / 2, 8, 0, "3-3", 1, 19, 65, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      // Wall
      [5,5,0,"0000000000000000000001110",, 2, 2],
      [4,5,0,"0000000001000110",, 4, 11],
      [5,5,0,"0000000000000000101001110",, 6, 20],
      [5,5,0,"0000000000000000111000100",, 8, 29],
      
      // Wall + ground
      [4,5,0,"0000000001100110","0000011001100000", 2, 38],
      [4,5,0,"0000010001100100","0000011001100000", 4, 47],
      [4,5,0,"0000011001000100","0000010001100000", 6, 56],
      [4,5,0,"0000000001100110","0100011000100000", 8, 65],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["You now have to match the patterns on the walls...", 10, 2, 1, 0, 1],
      ["... and on the floor too!", 10, 40, 1, 0, 1],
    ];
    
    cubes = [ ];
    
    emoji = [
      ["🦉", 10, 14],
    ]
  }
  
  // 3-3 (3D puzzles, length 8, wall and full and wrap)
  // Puzzles solved before: 47
  // Puzzles solved after: 59
  else if(pagename == "3-3"){
    
    // Show mobile button Reset
    if(mobile){
      k_camleft.className = k_camright.className = "";
      L[P+"camera"] = 1;
    }

    w = 20;
    h = 75;
    
    // Trees
    trees = [
      [2, 2],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1, 4, 0, 0, 59],
      [2, 5, 0, 0, 59],
      [3, 6, 0, 0, 59],
      [4, 2, 0, 0, 59],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [21, 65, Math.PI / 2, 7, 0, "3-1", 0, 1, 65, 0, 1],
      [-2, 5, -Math.PI / 2, 12, 0, "3-6", 1, 14, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
    
      // Wall
      [5,5,0,"0000000000010000110001110",, 8, 69],
      [6,5,0,"000000000000000000000100001110011000",, 12, 58],
      [5,5,0,"0000000000010000111001000",, 2, 58],
      
      // Wall + ground
      [4,5,0,"0000001001100110","0000001001100000", 2, 45],
      [5,5,0,"0000000000000000010001110","0000000100001100110000000", 12, 45],
      [5,5,0,"0000000000000000101001110","0000001110010100000000000", 2, 34],
      [5,5,0,"0000000000000000011001100","0000001110011000010000000", 12, 34],
      
      // Wrap      
      [4,5,1,"0000011001100110","0110000000000110", 2, 22],
      [4,5,1,"1001000000001001","1001000000001001", 12, 22],
      [4,5,1,"0000010011110010","0000111101100000", 2, 12],
      [4,5,1,"0110010000000011","0000011100110000", 12, 12],
      [4,5,1,"1101000000000001","1101000000010001", 12, 2],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    // 5: son
    hints = [
      ["You can rotate the camera with " + (mobile ? "<br>↻ and ↺" : "the keys 1, 2 and 3"), 15, 68, 1, 0, 1],
      ["Can you imagine what's coming next?", 7, 54, 1, 0, 1],
      ["Yep... 3D puzzles with wrap! Use " + (mobile ? "⬆︎ and ⬇︎" : "Shift and Ctrl") + " to wrap between top and bottom", 7, 24, 1, 0, 1],
    ];
    
    cubes = [ ];
    
    emoji = [
      ["🐞", 3, 70],
    ]
  }


  // 3-6 (3D puzzles, length 12, all kinds)
  // Puzzles solved before: 59
  // Puzzles solved after: 68
  else if(pagename == "3-6"){
    
    w = 15;
    h = 80;
    
    // Trees
    trees = [
      [2, 70]
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1, 73, 0, 0, 68],
      [3, 75, 0, 0, 68],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 5, Math.PI / 2, 12, 0, "3-3", 0, 1, 5, 0, 1],
      [-2, 75, -Math.PI / 2, 14, 0, "3-7", 1, 14, 25, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      
      // Wall
      [5,5,0,"0000000000001001111100100",, 2, 2],
      [4,5,0,"0000010001100000",, 5, 11],
      [5,5,0,"0000000110000110111000010",, 8, 20],
      
      // Wall + ground
      [5,5,0,"0000000000001000111011111","0000000000111001111100000", 2, 29],
      [4,5,0,"1000110011101111","0000001111110000", 5, 38],
      [4,5,0,"0000100011001110","1110110010000000", 8, 45],
      
      // Wrap
      [4,5,1,"1000100110010001","0000100110010000", 2, 54],
      [4,12,1,"0000001011110100","0000110011110011", 5, 63],
      [5,12,1,"0100011000010000111001000","0000001110110000100000000", 8, 72],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [
      [6, 12],
    ];
    
    emoji = [
      ["🐝", 3, 20],
    ];
  }
  
  // 3-7 (3D puzzles, length 14, all kinds)
  // Puzzles solved before: 68
  // Puzzles solved after: 71
  else if(pagename == "3-7"){
    
    w = 15;
    h = 30;
    
    // Trees
    trees = [
      [10,12]
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [8, 11, 0, 0, 71],
      [9, 10, 0, 0, 71],
      [10, 9, 0, 0, 71],
      [11, 10, 0, 0, 71],
      [12, 11, 0, 0, 71],
      [13, 12, 0, 0, 71],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 25, Math.PI / 2, 14, 0, "3-6", 0, 1, 75, 0, 1],
      [-2, 5, -Math.PI / 2, 20, 0, "3-8", 1, 14, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      [5,14,1,"0001100110011001100010000","0001100110011001100010000", 2, 24],
      [5,5,1,"1100010001000011000111000","0000011000110010000000000", 4, 13],
      [5,5,1,"1101110001000001000011000","1100010000000001000111011", 6, 2],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [ ];
    
    emoji = [
      ["🐓", 1, 14],
    ];
  }
  
  // 3-8 (3D puzzles, length 20, wrap)
  // Puzzles solved before: 71
  // Puzzles solved after: 75
  else if(pagename == "3-8"){
    
    w = 15;
    h = 48;
    
    // Trees
    trees = [
      [10, 44],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [7, 45, 0, 0, 75],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 5, Math.PI / 2, 20, 0, "3-7", 0, 1, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      [4,20,1,"0000111101101111","1000111111111000", 5, 38],
      [4,20,1,"1111001001001111","1111101010101111", 5, 28],
      [4,20,1,"1111010101011101","0001101101101111", 5, 18],
      [4,20,1,"1111000100011110","1111110110011111", 5, 8],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [ ];
    
    emoji = [
      ["🐉", 13, 46],
    ];
  }
  
  scene.style.width = w * sidesize + "vh";
  scene.style.height = h * sidesize + "vh";
  
  // Draw objects: doors, trees, apples, puzzles, cubes...
  //=====================
  
  objects.innerHTML = "";
  puzzle.innerHTML = "";
  
  // Trees
  for(var i in trees){
    objects.innerHTML += 
    `<div id=tree${i} class="emoji tree" style="left:${trees[i][0]*sidesize}vh;transform:translateX(-9vh)translateY(${trees[i][1]*sidesize+4}vh)rotateX(-75deg)">🌳</div><div id=treeshadow${i} class="emojishadow treeshadow" style="left:${trees[i][0]*sidesize}vh;transform:translateX(-9vh)translateY(${trees[i][1]*sidesize+4}vh)rotateZ(144deg)scaleY(1.5)">🌳`;
  }
  
  // Apples
  for(i in apples){

    // Remove apples already eaten
    if(L[P+"appleeaten" + pagename + i]){      
      delete apples[i];
    }
   
    // Draw apples to eat
    else {
      objects.innerHTML += 
      `<div id=apple${i} class="emoji apple ${L[P+"appleappeared"+pagename+i]?"":"hidden"}" style="left:${apples[i][0]*sidesize}vh;transform:translateY(${apples[i][1]*sidesize+4}vh) rotateX(-65deg)">${pagename=="3-8"?"<div>⚽</div>":"<div class=emojimove>🍎</div>"}</div><div id=appleshadow${i} class="emojishadow appleshadow ${L[P+"appleappeared"+pagename+i]?"":"hidden"}" style="left:${apples[i][0]*sidesize}vh;transform:scaleX(-1)translateY(${apples[i][1]*sidesize+3}vh)rotateZ(212deg)">${pagename=="3-8"?"⚽":"🍎"}`;
    }
  }
  
  // Emoji
  for(i in emoji){
   
    // Draw apples to eat
    objects.innerHTML += 
    `<div class="emoji animal" style="left:${emoji[i][1]*sidesize}vh;transform:translateY(${emoji[i][2]*sidesize+4}vh) rotateX(-65deg)"><div class=emojimove>${emoji[i][0]}</div></div><div class="emojishadow animalshadow" style="left:${emoji[i][1]*sidesize}vh;transform:scaleX(-1)translateY(${emoji[i][2]*sidesize+3}vh)rotateZ(212deg)">${emoji[i][0]}`;
  }
  
  // Doors
  for (i in doors){
  objects.innerHTML+=`<div id=door${""+pagename+i} class="door${L[P+"door"+pagename+i]?" open":""}" style="left:${(doors[i][0]+.5)*sidesize}vh;top:${(doors[i][1]+.5)*sidesize}vh;transform:rotateZ(${doors[i][2]}rad)translateZ(${doors[i][9]*sidesize}vh)"><div class="realdoor door${doors[i][10]}" ${doors[i][6]?"":"hidden"}>${doors[i][3]}</div><div class=path>`;
  }
  
  // Cubes

  for(var p in puzzles){
    for(var j in cubes){
      if(
        L[P+"puzzle" + pagename + p]
        && cubes[j][0] >= puzzles[p][5]
        && cubes[j][0] < puzzles[p][5] + puzzles[p][0]
        && cubes[j][1] >= puzzles[p][6]
        && cubes[j][1] < puzzles[p][6] + puzzles[p][0]
      ){
        delete cubes[j];
      }
    }
  }
  
  for (i in cubes){
    objects.innerHTML+=`<div id=cube${i} class="cube rock" style="left:${cubes[i][0]*sidesize}vh;top:${cubes[i][1]*sidesize}vh;width:7.2vh;height:7.2vh"><div class=front></div><div class=up style="background-position:${-300-cubes[i][0]*sidesize}vh ${-140-cubes[i][1]*sidesize}vh"></div><div class=right></div><div class=left>`;
  }
  
  // Hints
  for (i in hints){
    
    if(!(son ^ hints[i][5])){
    // => if((son && hints[i][5]) || (!son && !hints[i][5])){
      
      if(
        // Min size
        (hints[i][3] && hints[i][3] <= snakelength)
        ||
        // Max size
        (hints[i][4] && hints[i][4] >= snakelength)
      ){
        //hints[i][4] = 1;
        objects.innerHTML+=`<div id=hint${""+pagename+i} class=hint style="left:${hints[i][1]*sidesize+1}vh;transform:translateY(${hints[i][2]*sidesize+4}vh)translateZ(${(hints[i][6]*sidesize||0)}vh)rotateX(-70deg)translateY(-4vh)">${hints[i][0]}`;
      }
    }
  }
  
  // puzzles
  for(var p in puzzles){
    
    size = puzzles[p][0];
    
    var whtml = '';
    var ghtml = '';
    var html =
    `<div id=puzzle${p} class="cube wrap visible ${(puzzles[p][2]&&!L[P+'puzzle'+pagename+p])?"wrapvisible":""}" style="left:${puzzles[p][5]*sidesize}vh;top:${puzzles[p][6]*sidesize}vh;width:${puzzles[p][0]*sidesize}vh;height:${size*sidesize}vh">${puzzles[p][2]?"<div class=left></div><div class=right></div>":""}<div id=down${p} class=down></div><div id=back${p} class=back></div>${puzzles[p][2]?"<div class=front>":""}`;
    puzzle.innerHTML += html;

    // Not solved (black/white)
    // Solved (blue/gold)
    var color1 = "000", color2 = "fff";
    if(L[P+"puzzle" + pagename + p]){
      color1 = "44c";
      color2 = "fd0";
    }
      
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        if(puzzles[p][3]){
          whtml += `<div class=cell id=w${p}-${i}-${j} style='width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][3][i*size+j]=="1")?color1:color2}'></div>`;
        }
        if(puzzles[p][4]){
          ghtml += `<div class=cell id=g${p}-${i}-${j} style='width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][4][i*size+j]=="1")?color1:color2}'></div>`;
        }
      }
    }
    
    if(self["down" + p]){
      self["down" + p].innerHTML += ghtml;
    }
    if(self["back" + p]){
      self["back" + p].innerHTML += whtml;
    }
  }
  
  // The end
  if(pagename == "3-8"){
    objects.innerHTML += "<div style='position:fixed;transform:rotateZ(-90deg)translateX(-113vh)translateY(22vh)translateZ(317vh);font:30vh/30vh a'>THE<br><br>END";
  }
  
  // Init snake
  
  // Hub's opening cinematic
  if(pagename == "hub" && !L[P+"snakex"]){
      
    // Lock controls
    lock = 1;

    // Resize and place snake at the right place, slow it down
    setTimeout('resetsnake();movesnake();snakecubemove0.style.transition="transform .5s"',2000);
    
    // Head goes out of the ground
    setTimeout("snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake()",4500);
    
    // Shake head and shadow
    setTimeout("snakecubemove0.style.transition='';snakeshadow0.style.transition=snakecuberotate0.style.transition='transform .2s';snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+-Math.PI/4+"rad)'",5000);
    setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+Math.PI/4+"rad)'",5500);
    setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform=''",6000);
    
    // Reset custom transitions, unlock keyboard, show mobile controls
    setTimeout("b.innerHTML+=`<div style='position:fixed;font:8vh a;top:3vh;right:3vh' onclick=location=location>×</div>`;scene.style.transition='transform 1s,transform-origin 1s';snakeshadow0.style.transition=snakecuberotate0.style.transition='';lock=0;L[P+'snakex']=20;L[P+'snakey']=10;if(mobile){k_up.className=k_down.className=k_left.className=k_right.className='';L[P+'wasd']=1}",9000);
  }
  
  // Return to hub, or enter other rooms
  else{
    scene.style.transition = 'transform 1s,transform-origin 1s';
    resetsnake();
  }
 
  // Move snake at the right place
  movesnake();
  
},

// Reset the snake's positions and angles and draw it
// if son == 1, draw the son.
resetsnake = noresethistory => {
  
  // Choose container
  var container = (son && !iseditor) ? snake2 : snake;
  
  // Delete the snake
  container.innerHTML = "";
      
  if(!noresethistory){
    
    // Reset positions & angles
    snakex = [];
    snakey = [];
    snakez = [];
    snakeangle = [];
  }
  
  // Compute cubes sizes in vh (editor only)
  if(iseditor){
    sidesize = 32 / size;
  }
  
  head = snakelength - 1;
  
  if(!noresethistory){
    
    // Load
    if(pagename == "load"){
      for(i = 0; i < snakelength; i++){
        snakex[head-i] = 1 - i;
        snakey[head-i] = 10;
        snakez[head-i] = 0;
        snakeangle[head-i] = -Math.PI/2;
      }
    }
    
    // Editor
    else if(iseditor){
      for(i = 0; i < snakelength; i++){
        snakex[head-i] = -i - 1;
        snakey[head-i] = ~~(size/2);
        snakez[head-i] = 0;
        snakeangle[head-i] = -Math.PI/2;
      } 
    }
    
    // Game
    else if(L[P+"snakex"]){
      var x = +L[P+"snakex"];
      var y = +L[P+"snakey"];
      var z = +L[P+"snakez"];
      
      // Return to hub from 3-1: z = 1
      if(pagename == "hub" && snakex < 2){
        z = L[P+"snakez"] = 1;
      }
      
      // Son start
      if(pagename == "2-5" && easteregg && son == 1){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i - 1;
          snakeangle[head-i] = 0;
        }
      }
        
      // Arrive from left
      else if(x < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x - i;
          snakey[head-i] = y;
          snakez[head-i] = z;
          snakeangle[head-i] = -Math.PI / 2;
        }
      }
      
      // Arrive from right
      else if(x > w - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x + i;
          snakey[head-i] = y;
          snakez[head-i] = z;
          snakeangle[head-i] = Math.PI / 2;
        }
      }
      
      // Arrive from top
      else if(y < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x;
          snakey[head-i] = y - i;
          snakez[head-i] = z;
          snakeangle[head-i] = 0;
        }
      }
      
      // Arrive from bottom
      else if(y > h - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x;
          snakey[head-i] = y + i;
          snakez[head-i] = z;
          snakeangle[head-i] = 0;
        }
      }
      
      // Other
      else {
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i;
          snakeangle[head-i] = 0;
        }
      }
    }
      
    // Game start
    else {
      if(b.className == "hub"){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i - 1;
          snakeangle[head-i] = 0;
        }
      }
    }   
  }
  
  // Draw 16 snake cubes (or more if snalelength is > 16) and hide them below the ground
  // The first one (the head) has a tongue (Y), mouth (‿) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 5 * div (the bottom div is useless)
  for(i = 0; i < Math.max(snakelength + 4, 16); i++){
    container.innerHTML += `<div id=snakecubemove${i} class=snakecubemove style="transform:translateX(50vh)translateY(50vh)translateZ(-30vh);width:${sidesize-1}vh;height:${sidesize-1}vh"><div class=snakeshadow id=snakeshadow${i}></div><div id=snakecuberotate${i} class=snakecuberotate><div class="cube snake" id=snakecube${i}>${i<1?"<div class=tongue>Y</div>":""}<div class=front>${i<1?"‿":""}</div><div class=up style="font-size:${sidesize*.5}vh;line-height:${sidesize*.8}vh">${i<1?"👀":""}</div><div class=right></div><div class=left></div><div class=back>`;
  }
},


// Onload
index = (n, cross) => {
  
  // Go to the last saved room (or hub by default)
  pagename = n || L[P+"page"] || "hub";
  
  // Draw html structure
  document.body.outerHTML =
`<body id=b class="${pagename}">
<div id=perspective>
<div id=scene style="transform:translateX(-140vh)translateY(-72vh)rotateZ(90deg)translateZ(119vh);transform-origin:142vh 72vh">
<div id=objects></div>
<div id=puzzle></div>
<div id=snake></div>
<div id=snake2></div>
</div>
</div>
<center id=mobilecontrols style='font:5vh arial,sans-serif;color:#fff;position:fixed;bottom:9vh;left:0;width:100vw'>
<button id=k_up class=hidden ontouchstart="touchstart(38)" ontouchend="touchend(38)">↑</button>
<button id=k_down class=hidden ontouchstart="touchstart(40)" ontouchend="touchend(40)">↓</button>
<button id=k_left class=hidden ontouchstart="touchstart(37)" ontouchend="touchend(37)">←</button>
<button id=k_right class=hidden ontouchstart="touchstart(39)" ontouchend="touchend(39)">→</button>
<button id=k_top class=hidden ontouchstart="touchstart(16)" ontouchend="touchend(16)">⬆︎</button>
<button id=k_bottom class=hidden ontouchstart="touchstart(17)" ontouchend="touchend(17)">⬇︎</button>
<button id=k_backtrack class=hidden ontouchstart="touchstart(18)" ontouchend="touchend(18)">↩</button>
<button id=k_reset class=hidden ontouchstart="touchstart(82)" ontouchend="touchend(82)">×</button>
<button id=k_camleft class=hidden ontouchstart="touchstart(49)" ontouchend="touchend(49)">↻</button>
<button id=k_camright class=hidden ontouchstart="touchstart(51)" ontouchend="touchend(51)">↺</button>
</center>
<center id=text style='font:5vh arial,sans-serif;color:#fff;position:fixed;bottom:9vh;left:0;width:100vw'>`;
  
  // Make the first apple appear (when the game starts only)
  L[P+"appleappearedhub0"] = 1;
  
  // Enter room
  enterroom();
  
  // Show buttons that already appeared before
  if(L[P+"wasd"]){
    k_up.className = k_down.className = k_left.className = k_right.className = '';
  }
  if(L[P+"backtrack"]){
    k_backtrack.className = "";
  }
  if(L[P+"reset"]){
    k_reset.className = "";
  }
  if(L[P+"topbottom"]){
    k_top.className = "";
    k_bottom.className = "";
  }
  if(L[P+"camera"]){
    k_camleft.className = "";
    k_camright.className = "";
  }

  int_time = setInterval("L[P+'time']=++ocd_time;document.title='LOSSST: '+ocd_moves+'m, '+ocd_time+'s'",1000);
  
    
  if(cross){
    b.innerHTML+=`<div style='position:fixed;font:8vh a;top:3vh;right:3vh'onclick=location=location>×`;
  }
},

touchstart = (n) => {
  self.onkeydown({which:"+n+"});
  touchintervals[n] = setInterval("self.onkeydown({which:"+n+"})",150);
},

touchend = (n) => {
  clearInterval(touchintervals[n]);
  self.onkeyup();
}


// Editor
// All the editor features
editor = () => {

  son = 0;
  issolved = 0;
  share.disabled = 1;
  
  // Hide ground checkbox & label if they're alone
  /*if(!L[P+"editorfull"] && !((L[P+"son"] && L[P+"snakelength"] > 6))){
    ground.style.opacity = groundlabel.style.opacity = 0;
    ground.style.position = groundlabel.style.position = "fixed";
    ground.style.top = groundlabel.style.top = "-9vh";
  }*/
  
  // Startup
  currentpuzzle = 0;
  iseditor = 1;
  puzzles = [[5,5,0,0,0,0,0]];
  
  // Set default values to the form
  gridsize.value = snakesize.value = snakelength = 5;
  ground.checked = true;
  hasground = 1;
  if(self.wall)wall.checked = false;
  if(self.wrap)wrap.checked = false;

  // Ground/wall checkboxes
  // (can't be both disabled)
  ground.onclick = e => {
    if(ground.checked){
      hasground = 1;
    }
    else if(self.wall){
      hasground = 0;
      haswall = 1;
      wall.checked = true;
    }
  }
 
	if(self.wall){
    wall.onclick = e => {
      if(self.wall && wall.checked){
        haswall = 1;
        puzzles[0][3] = 1;
        son = 1;
      }
      else {
        son = 0;
        haswall = 0;
        hasground = 1;
        ground.checked = true;
        puzzles[0][3] = 0;
      }
    }
  }
  
  // Wrap checkbox
  if(self.wrap){
    wrap.onclick = e => {
      haswrap = puzzles[0][2] = wrap.checked || 0;
    }
  }

  // Data arrays for wall and ground puzzle
  dw = [];
  dg = [];
    
  // Reset and resize the snake (when the snake size range changes)
  snakesize.onchange =
  snakesize.oninput = e => {
    
    // Update range indicator
    snakeval.innerHTML = snakelength = +snakesize.value;
    resetsnake();
    movesnake();
    
    issolved = 0;
    share.disabled = 1;
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        self[`ge-${i}-${j}`].style.background = dg[i][j] ? "#000" : "#fff";
        self[`we-${i}-${j}`].style.background = dw[i][j] ? "#000" : "#fff";
      }
    }
  }
  
  // Editor
  
  // Grids size (in numbers of cells squared)
  size = 5;
  
  // Resize the grid
  // Called on load, on reset and when the grid size input is changed
  // This also resizes the snake (so it can fit in the cells)
  (reset.onclick =
  gridsize.onchange =
  gridsize.oninput =
  resizegrid = e => {

    issolved = 0;
    share.disabled = 1;
    
    // Update range indicator (z = value)
    gridval.innerHTML = size = +gridsize.value;
    puzzles[0][0] = size;
 
    // Compute cells size (in %)
    var cellsize = 100 / size;
    
    // Reset grids (html and data)
    down.innerHTML = '';
    back.innerHTML = '';
    whtml = '';
    ghtml = '';
    dw = [];
    dg = [];
    for(i = 0; i < size; i++){
      dw[i] = [];
      dg[i] = [];
      for(j = 0; j < size; j++){
        dw[i][j] = 0;
        dg[i][j] = 0;
      }
    }
    
    // Fill grids HTML
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        whtml += `<div class=cell id=w${cellprefix}-${i}-${j} style='width:${cellsize}%;padding-top:${cellsize}%' onmousedown='paint(${i},${j},this,0)' onmousemove='paint(${i},${j},this,0,1)'></div>`;
        ghtml += `<div class=cell id=g${cellprefix}-${i}-${j} style='width:${cellsize}%;padding-top:${cellsize}%' onmousedown='paint(${i},${j},this,1)' onmousemove='paint(${i},${j},this,1,1)'></div>`;
      }
    }
    down.innerHTML += ghtml;
    back.innerHTML += whtml;
    
    // Resize and place snake at the right place
    resetsnake();
    movesnake();
  })()
  
  // Initialize the grid (with size 5)
  
  // On click on a call, toggle its color
  // On mousedown + mousemove, paint it in black
  // Params: i, j (coords), this (current cell), ground (1 = ground, 0 = wall), force (1 = mousemove, 0 = click)
  paint = (i,j,t,g,f) => {
    
    // Do nothing in playing mode 
    if(playing) return;

    if(mousedown){
      issolved = 0;
      share.disabled = 1;
    }
    
    // Choose ground or wall
    var d = g ? dg : dw;
    
    // Force
    if(f && mousedown){
      d[i][j] = 1;
    }
    
    // Toggle
    else if(!f){
      d[i][j] ^= 1;
    }
    
    // Update CSS
    if(!f || mousedown){
    // => if((f && mousedown) || !f){
      for(i = 0; i < size; i++){
        for(j = 0; j < size; j++){
          self[`ge-${i}-${j}`].style.background = dg[i][j] ? "#000" : "#fff";
          self[`we-${i}-${j}`].style.background = dw[i][j] ? "#000" : "#fff";
        }
      }
    }
  };

  
  // Share a puzzle
  // Generates an url with the hash "#gridsize,snakesize,wrap,wall,ground".
  print = a => {
    var r = "";
    for(i in a){
      for(j in a[i]){
        r += a[i][j];
      }
    }
    return r;
  }

  share.onclick = () => {
    var r = [];
    r.push(size)
    r.push(snakesize.value);
    r.push(self.wrap && wrap.checked ? 1 : 0);
    r.push(self.wall && wall.checked ? print(dw) : '')
    r.push(ground.checked ? print(dg) : '')
    open("//twitter.com/intent/tweet?text=I%20made%20a%20level%20for%20@MaximeEuziere's%20%23js13k%20game%20LOSSST!%0APlay%20here:%20js13kgames.com%2Fentries%2Flossst%0AMy%20level:%20js13kgames.com%2Fgames%2Flossst%2Findex.html%23"+r+"%0A%23LOSSSTlevels");
  }
  
  // Mouse inputs
  // update mousedown flag
  mousedown = 0;
  onmousedown = e => {
    mousedown = 1;
  }
  
  onmouseup = e => {
    mousedown = 0;
  }
  
  // Ignore all drag events
  ondragstart = e => {
    e.preventDefault();
  }

  // playing
  playing = puzzling = 0;
  test.onclick = e => {
    playing = puzzling = 1;
    b.className = "editor playing";
    issolved = 0;
    share.disabled = 1;
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        self[`ge-${i}-${j}`].style.background = dg[i][j] ? "#000" : "#fff";
        self[`we-${i}-${j}`].style.background = dw[i][j] ? "#000" : "#fff";
      }
    }
  }
  
  // Quit
  quit.onclick = () => {
    
    // Quit playing
    if(playing){
      playing = puzzling = 0;
      b.className = "editor";
      resetsnake();
      movesnake();
      checkgrid();
    }
    
    // Quit editor
    else {
      location = "http://xem.github.io/JS13k17/bonus.html"
    }
  }
  
  scene.style.transform = "rotateX(38deg)translateX(-18vh)";
}

mainmenu = () => {
  
  if(location.hash.length > 1){
    index("load");
    return;
  }
  
  
  // Menu 1
  b.innerHTML = `<center id=e>👀</center>
<center id=itext></center>
<div id=perspective style=perspective:30vh>
<center id=menu>
<h1>LOSSST</h1><span onclick=a()>New game</span><br>` + (L[P+"start"] ? (L[P+'ended'] ? '' : '<span onclick=index(0,1)>Continue</span><br>') + `<span onclick=location='editor.html'>Puzzle editor</span><br>` : "") + `<span onclick="location='//twitter.com/search?q=%23LOSSSTjs13k'">Twitter levels</span><br><span onclick=location='//maximeeuziere.itch.io'>Other games`;

  // New game
  a = () => {
    for(i in localStorage){
      if(i.indexOf("lossst") == 0 && i.indexOf("editorfull") == -1){
        delete localStorage[i];
      }
    }
    L[P+"start"] = 1;
    menu.innerHTML = '<br><br><span onclick=intro(0)>Desssktop</span><br><br><span onclick=intro(1)>Mobile';
  }

  // Intro
  intro = function(m) {
    L[P+"mobile"] = mobile = m;
    L[P+"snakelength"] = snakelength = 5;
    ocd_time = L[P+"time"] = 0,
    ocd_moves = L[P+"moves"] = 0,
    
    L[P+"moves"] = 0;
    L[P+"time"] = 0;
    menu.innerHTML = "";
    
    // Eyes
    setTimeout("e.style.margin=0", 500);
    dir = 1;
    inter = setInterval("e.style.opacity=0;setTimeout('e.style.opacity=1;dir=-dir;e.style.transform=`scaleX(`+dir+`)`',150)", 3000);
    
    // text
    setTimeout("itext.innerHTML=`I lossst my kid!`", 2000);
    setTimeout("itext.innerHTML=``", 5000);
    setTimeout("clearInterval(inter);e.style.margin='-80vh 0 0'", 7000);
    setTimeout(index, 7500);
  }
}