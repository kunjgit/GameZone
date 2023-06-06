
count=0
for (var i=0;i<9;i++){
    count=9*i;
    document.getElementsByClassName("box")[i].innerHTML="<div class='cell'><input type='text' id='"+(count+1)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+2)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+3)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+4)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+5)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+6)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+7)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+8)+"' class='input'></div><div class='cell'><input type='text' id='"+(count+9)+"' class='input'></div>"
}

//how to play game instruction

function help(){
    window.open(
        "https://sudoku.com/how-to-play/sudoku-rules-for-complete-beginners/", "_blank");
}
var level;
var choosen;


// easy_level board create

easy_board=['2-5---7--45---9----2-6-81----9---8567-------2418---2----43-7-1----1---85--6---7-8','----35-86-1-9-7-----269----54------------527-9--75----7-6---3-----2-----56---2-14','3-549-6----396--81-5-2--1494-276-1-39---583-46-1549--7-6-1-824558-7-3-924---7-3-6','47----3-------179--4-93--5----6---7-48---------2716-34-9----6----6--2381---54--1-','-2--18573-31--5-96---16----5--4-26--97--86--------98--1-6--79--2-5---8144-9-7---1'
];

easy=['215986734452869371527648193379124856781543692418937265864357219693172485936521748','129735486213967854342691578543869127498315276981754632786421359675248193567832914','315492678723964581857236149482765193916258374631549827967138245584713692429871356','476285319523861794148932657123649578481397265952716834895137624976452381763548219','429618573831245796382164957537492618974186325761259843186537942265793814459378621'];

//medium level board create

medium=['876345291982754163417638529493712568135826947359271684251968473746319825682594137','834615279152793468921546387512879346634258791463987125796342581978614235857123469','695138472243761589817356924428975361796854213532149687137264598851923476649782315','184936257623498715372561849259847136491375682514928763673521894758162439986347215','439671258825764193316582947612583497741239865924176358578429613396185742857934261'];

medium_board=['--6----9---75-1---1------9-9-7-25-8-3-----4-3-92-1-8-2------7---6-19--5-8----1--','------27----793--892-5-63--5--87-3---34-5-79---3-87--5--63-2-819--614----57------','6-5-384--2----1--9-1----9-------53--7--8-4--3--21-------7----9-8--9----6--978-3-5','-8493--576--4----5---------2--84----4-1-7-6-2----28--3---------7----2--998--4721-','43--7-2---2----1-----5--9-------349-741---865-241-------8--9-----6----4---7-3--61'];

//hard level board create

hard_board=['---789-----75-8-4---38-----8---1---6---7-9---2---7---1-----61---5-3-42-----439---','-6------2---9-83----6--3-79----368---2-----4---461----75-8--4----51-7---2------8-','-8-------4---15--3---69-----2-73-1----9-----2-6----------19--875--9-2-1--2-835---','----578------3--19---3---75-5-2-8--4------6---1-7-24---7----6----142---3---9--3--','--346-5-------------9-4-8--5-9---18----4-3--7-------7--4--------9--81--6-3-71----'];

hard=['165789432297518346973821654847312596463729158284675931923546178851364297615439782','861794532617948325156283479492536871928365147784619253753812496345127968239574681','187256349428715963534691872924738156619483572861247395356194287573962418729835641','143657892526738419984361275956238174843591627315782469872149635791426583267954318','783461592318627954179246835569732184625493817246358971142958673497581326835719264'];


function start(){
    for(var i=0;i<6;i++){
        document.getElementsByClassName("label")[i].setAttribute("onclick","return false;");
    }
    timer();
    //easy game
    if(document.getElementById("easy").checked){
        level='easy';
        var easy_random=Math.floor(Math.random()*5);
        choosen=easy_random;
        for(var i=0;i<81;i++){
            if(easy_board[easy_random][i]!='-'){
                document.getElementById((i+1).toString()).value=easy_board[easy_random][i];
                document.getElementById((i+1).toString()).readOnly=true;
            }
        }
    }

    //medium game

    else if(document.getElementById("medium").checked){
        level='medium';
        var medium_random=Math.floor(Math.random()*5);
        choosen=medium_random;
        for(var i=0;i<81;i++){
            if(medium_board[medium_random][i]!='-'){
                document.getElementById((i+1).toString()).value=medium_board[medium_random][i];
                document.getElementById((i+1).toString()).readOnly=true;
            }
        }
    }


//hard game

else{
    level='hard';
        var hard_random=Math.floor(Math.random()*5);
        choosen=hard_random;
        for(var i=0;i<81;i++){
            if(hard_board[hard_random][i]!='-'){
                document.getElementById((i+1).toString()).value=hard_board[hard_random][i];
                document.getElementById((i+1).toString()).readOnly=true;
            }
        }
}


document.getElementById("start").removeAttribute("onclick");
   
}


//check answer
var id=setInterval(() => {
    if (level=="easy"){
    if(document.activeElement.className=="input"){
        if((document.getElementById(document.activeElement.id).value==easy[choosen][document.activeElement.id-1])||(document.getElementById(document.activeElement.id).value=='')){
            for(var i=0;i<81;i++){
                if(i==80 && document.getElementById((81).toString()).value!='' ){
                        alert("you win !! congratulation.....");
                        clearInterval(id);
                        window.location.reload();
                }
                else if(document.getElementById((i+1).toString()).value==''){
                    break;
                }
            }
        }
        else{
            if(document.getElementById("rem_live").innerHTML==1){
                document.getElementById("rem_live").innerHTML==0;
                alert("you lost !!");
                document.activeElement.value='';
                window.location.reload();

            }
            else{
            alert("you choose wrong number, you loose your one life !!");
            document.getElementById("rem_live").innerHTML=document.getElementById("rem_live").innerHTML-1;
            document.activeElement.value='';
            }
        }

    }
}

else if(level=="medium"){

    if(document.activeElement.className=="input"){
        if((document.getElementById(document.activeElement.id).value==medium[choosen][document.activeElement.id-1])||(document.getElementById(document.activeElement.id).value=='')){
            for(var i=0;i<81;i++){
                if(i==80 && document.getElementById((81).toString()).value!='' ){
                        alert("you win !! congratulation.....");
                        clearInterval(id);
                        window.location.reload();
                }
                else if(document.getElementById((i+1).toString()).value==''){
                    break;
                }
            }
        }
        else{
            if(document.getElementById("rem_live").innerHTML==1){
                document.getElementById("rem_live").innerHTML==0;
                alert("you lost !!");
                document.activeElement.value='';
                window.location.reload();

            }
            else{
            alert("you choose wrong number, you loose your one life !!");
            document.getElementById("rem_live").innerHTML=document.getElementById("rem_live").innerHTML-1;
            document.activeElement.value='';
            }
        }

    }
}

else{

    if(document.activeElement.className=="input"){
        if((document.getElementById(document.activeElement.id).value==hard[choosen][document.activeElement.id-1])||(document.getElementById(document.activeElement.id).value=='')){
            for(var i=0;i<81;i++){
                if(i==80 && document.getElementById((81).toString()).value!='' ){
                        alert("you win !! congratulation.....");
                        clearInterval(id);
                        window.location.reload();
                }
                else if(document.getElementById((i+1).toString()).value==''){
                    break;
                }
            }
        }
        else{
            if(document.getElementById("rem_live").innerHTML==1){
                document.getElementById("rem_live").innerHTML==0;
                alert("you lost !!");
                document.activeElement.value='';
                window.location.reload();

            }
            else{
            alert("you choose wrong number, you loose your one life !!");
            document.getElementById("rem_live").innerHTML=document.getElementById("rem_live").innerHTML-1;
            document.activeElement.value='';
            }
        }

    }
}
}, 500);



//answer
function answer(){
    if(level=="easy"){
        for(var i=0;i<81;i++){
            document.getElementById((i+1).toString()).value=easy[choosen][i];
        }
    }
    else if(level=="medium"){
        for(var i=0;i<81;i++){
            document.getElementById((i+1).toString()).value=medium[choosen][i];
        }
    }
    else if(level=="hard"){
        for(var i=0;i<81;i++){
            document.getElementById((i+1).toString()).value=hard[choosen][i];
        }
    }
    else{
        alert("first choose the game and start it !!");
    }
}
//new game

function replay(){
    for(var i=0;i<81;i++){
        document.getElementById((i+1).toString()).value='';
    }
    start();
}


//timer
function timer(){
if(document.getElementById("time1").checked==true){
    document.getElementById("time_min").innerHTML="0"+(document.getElementById("time1_min").innerHTML-1).toString();
    document.getElementById("time_sec").innerHTML='59';
}

else if(document.getElementById("time2").checked==true){
    document.getElementById("time_min").innerHTML="0"+(document.getElementById("time2_min").innerHTML-1).toString();
    document.getElementById("time_sec").innerHTML='59';
}
else{
    document.getElementById("time_min").innerHTML="0"+(document.getElementById("time3_min").innerHTML-1).toString();
    document.getElementById("time_sec").innerHTML='59';
}

    setInterval(() => {
        if(document.getElementById("time_sec").innerHTML=='00'){
            document.getElementById("time_sec").innerHTML="59";
        }
        else{
            if(parseInt(document.getElementById("time_sec").innerHTML)<=10){
            document.getElementById("time_sec").innerHTML="0"+(document.getElementById("time_sec").innerHTML-1).toString();
            }
            else{
                document.getElementById("time_sec").innerHTML=document.getElementById("time_sec").innerHTML-1;
            }
        }
    }, 1000);


    setInterval(() => {
        if(document.getElementById("time_min").innerHTML=='00'){
            document.getElementById("time_sec").innerHTML='00';
            setTimeout(() => {
                alert("you lost !!");
            }, 50);
        }
        else{
            if(parseInt(document.getElementById("time_min").innerHTML)<=10){
            document.getElementById("time_min").innerHTML="0"+(document.getElementById("time_min").innerHTML-1).toString();
            }
            else{
                document.getElementById("time_min").innerHTML=document.getElementById("time_min").innerHTML-1;
            }
        }
    }, 60*1000);

}

(function(global) {
	"use strict";

	// Helper utilities
	var util = {
		extend: function(src, props) {
			props = props || {};
			var p;
			for (p in src) {
				if (!props.hasOwnProperty(p)) {
					props[p] = src[p];
				}
			}
			return props;
		},
		each: function(a, b, c) {
			if ("[object Object]" === Object.prototype.toString.call(a)) {
				for (var d in a) {
					if (Object.prototype.hasOwnProperty.call(a, d)) {
						b.call(c, d, a[d], a);
					}
				}
			} else {
				for (var e = 0, f = a.length; e < f; e++) {
					b.call(c, e, a[e], a);
				}
			}
		},
		isNumber: function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		includes: function(a, b) {
			return a.indexOf(b) > -1;
		},
	};

	/**
	 * Default configuration options. These can be overriden
	 * when loading a game instance.
	 * @property {Object}
	 */
	var defaultConfig = {
		// If set to true, the game will validate the numbers
		// as the player inserts them. If it is set to false,
		// validation will only happen at the end.
		validate_on_insert: true,

		// Set the difficult of the game.
		// This governs the amount of visible numbers
		// when starting a new game.
		difficulty: "normal"
	};

	/**
	 * Sudoku singleton engine
	 * @param {Object} config Configuration options
	 */
	function Game(config) {
		this.config = config;

		// Initialize game parameters
		this.cellMatrix = {};
		this.matrix = {};
		this.validation = {};

		this.values = [];

		this.resetValidationMatrices();

		return this;
	}
	/**
	 * Game engine prototype methods
	 * @property {Object}
	 */
	Game.prototype = {
		/**
		 * Build the game GUI
		 * @returns {HTMLTableElement} Table containing 9x9 input matrix
		 */
		buildGUI: function() {
			var td, tr;

			this.table = document.createElement("table");
			this.table.classList.add("sudoku-container");

			for (var i = 0; i < 9; i++) {
				tr = document.createElement("tr");
				this.cellMatrix[i] = {};

				for (var j = 0; j < 9; j++) {
					// Build the input
					this.cellMatrix[i][j] = document.createElement("input");
					this.cellMatrix[i][j].maxLength = 1;

					// Using dataset returns strings which means messing around parsing them later
					// Set custom properties instead
					this.cellMatrix[i][j].row = i;
					this.cellMatrix[i][j].col = j;

					this.cellMatrix[i][j].addEventListener("keyup", this.onKeyUp.bind(this));

					td = document.createElement("td");

					td.appendChild(this.cellMatrix[i][j]);

					// Calculate section ID
					var sectIDi = Math.floor(i / 3);
					var sectIDj = Math.floor(j / 3);
					// Set the design for different sections
					if ((sectIDi + sectIDj) % 2 === 0) {
						td.classList.add("sudoku-section-one");
					} else {
						td.classList.add("sudoku-section-two");
					}
					// Build the row
					tr.appendChild(td);
				}
				// Append to table
				this.table.appendChild(tr);
			}
			
			this.table.addEventListener("mousedown", this.onMouseDown.bind(this));

			// Return the GUI table
			return this.table;
		},

		/**
		 * Handle keyup events.
		 *
		 * @param {Event} e Keyup event
		 */
		onKeyUp: function(e) {
			var sectRow,
				sectCol,
				secIndex,
				val, row, col,
				isValid = true,
				input = e.currentTarget

			val = input.value.trim();
			row = input.row;
			col = input.col;

			// Reset board validation class
			this.table.classList.remove("valid-matrix");
			input.classList.remove("invalid");

			if (!util.isNumber(val)) {
				input.value = "";
				return false;
			}

			// Validate, but only if validate_on_insert is set to true
			if (this.config.validate_on_insert) {
				isValid = this.validateNumber(val, row, col, this.matrix.row[row][col]);
				// Indicate error
				input.classList.toggle("invalid", !isValid);
			}

			// Calculate section identifiers
			sectRow = Math.floor(row / 3);
			sectCol = Math.floor(col / 3);
			secIndex = row % 3 * 3 + col % 3;

			// Cache value in matrix
			this.matrix.row[row][col] = val;
			this.matrix.col[col][row] = val;
			this.matrix.sect[sectRow][sectCol][secIndex] = val;
		},
		
		onMouseDown: function(e) {
			var t = e.target;
			
			if ( t.nodeName === "INPUT" && t.classList.contains("disabled") ) {
				e.preventDefault();
			}
		},

		/**
		 * Reset the board and the game parameters
		 */
		resetGame: function() {
			this.resetValidationMatrices();
			for (var row = 0; row < 9; row++) {
				for (var col = 0; col < 9; col++) {
					// Reset GUI inputs
					this.cellMatrix[row][col].value = "";
				}
			}

			var inputs = this.table.getElementsByTagName("input");

			util.each(inputs, function(i, input) {
				input.classList.remove("disabled");
				input.tabIndex = 1;
			});

			this.table.classList.remove("valid-matrix");
		},

		/**
		 * Reset and rebuild the validation matrices
		 */
		resetValidationMatrices: function() {
			this.matrix = {
				row: {},
				col: {},
				sect: {}
			};
			this.validation = {
				row: {},
				col: {},
				sect: {}
			};

			// Build the row/col matrix and validation arrays
			for (var i = 0; i < 9; i++) {
				this.matrix.row[i] = ["", "", "", "", "", "", "", "", ""];
				this.matrix.col[i] = ["", "", "", "", "", "", "", "", ""];
				this.validation.row[i] = [];
				this.validation.col[i] = [];
			}

			// Build the section matrix and validation arrays
			for (var row = 0; row < 3; row++) {
				this.matrix.sect[row] = [];
				this.validation.sect[row] = {};
				for (var col = 0; col < 3; col++) {
					this.matrix.sect[row][col] = ["", "", "", "", "", "", "", "", ""];
					this.validation.sect[row][col] = [];
				}
			}
		},

		/**
		 * Validate the current number that was inserted.
		 *
		 * @param {String} num The value that is inserted
		 * @param {Number} rowID The row the number belongs to
		 * @param {Number} colID The column the number belongs to
		 * @param {String} oldNum The previous value
		 * @returns {Boolean} Valid or invalid input
		 */
		validateNumber: function(num, rowID, colID, oldNum) {
			var isValid = true,
				// Section
				sectRow = Math.floor(rowID / 3),
				sectCol = Math.floor(colID / 3),
				row = this.validation.row[rowID],
				col = this.validation.col[colID],
				sect = this.validation.sect[sectRow][sectCol];

			// This is given as the matrix component (old value in
			// case of change to the input) in the case of on-insert
			// validation. However, in the solver, validating the
			// old number is unnecessary.
			oldNum = oldNum || "";

			// Remove oldNum from the validation matrices,
			// if it exists in them.
			if (util.includes(row, oldNum)) {
				row.splice(row.indexOf(oldNum), 1);
			}
			if (util.includes(col, oldNum)) {
				col.splice(col.indexOf(oldNum), 1);
			}
			if (util.includes(sect, oldNum)) {
				sect.splice(sect.indexOf(oldNum), 1);
			}
			// Skip if empty value

			if (num !== "") {
				// Validate value
				if (
					// Make sure value is within range
					Number(num) > 0 &&
					Number(num) <= 9
				) {
					// Check if it already exists in validation array
					if (
						util.includes(row, num) ||
						util.includes(col, num) ||
						util.includes(sect, num)
					) {
						isValid = false;
					} else {
						isValid = true;
					}
				}

				// Insert new value into validation array even if it isn't
				// valid. This is on purpose: If there are two numbers in the
				// same row/col/section and one is replaced, the other still
				// exists and should be reflected in the validation.
				// The validation will keep records of duplicates so it can
				// remove them safely when validating later changes.
				row.push(num);
				col.push(num);
				sect.push(num);
			}

			return isValid;
		},

		/**
		 * Validate the entire matrix
		 * @returns {Boolean} Valid or invalid matrix
		 */
		validateMatrix: function() {
			var isValid, val, $element, hasError = false;

			// Go over entire board, and compare to the cached
			// validation arrays
			for (var row = 0; row < 9; row++) {
				for (var col = 0; col < 9; col++) {
					val = this.matrix.row[row][col];
					// Validate the value
					isValid = this.validateNumber(val, row, col, val);
					this.cellMatrix[row][col].classList.toggle("invalid", !isValid);
					if (!isValid) {
						hasError = true;
					}
				}
			}
			return !hasError;
		},

		/**
		 * A recursive 'backtrack' solver for the
		 * game. Algorithm is based on the StackOverflow answer
		 * http://stackoverflow.com/questions/18168503/recursively-solving-a-sudoku-puzzle-using-backtracking-theoretically
		 */
		solveGame: function(row, col, string) {
			var cval,
				sqRow,
				sqCol,
				nextSquare,
				legalValues,
				sectRow,
				sectCol,
				secIndex,
				gameResult;

			nextSquare = this.findClosestEmptySquare(row, col);
			if (!nextSquare) {
				// End of board
				return true;
			} else {
				sqRow = nextSquare.row;
				sqCol = nextSquare.col;
				legalValues = this.findLegalValuesForSquare(sqRow, sqCol);

				// Find the segment id
				sectRow = Math.floor(sqRow / 3);
				sectCol = Math.floor(sqCol / 3);
				secIndex = sqRow % 3 * 3 + sqCol % 3;

				// Try out legal values for this cell
				for (var i = 0; i < legalValues.length; i++) {
					cval = legalValues[i];
					// Update value in input
					nextSquare.value = string ? "" : cval;

					// Update in matrices
					this.matrix.row[sqRow][sqCol] = cval;
					this.matrix.col[sqCol][sqRow] = cval;
					this.matrix.sect[sectRow][sectCol][secIndex] = cval;

					// Recursively keep trying
					if (this.solveGame(sqRow, sqCol, string)) {
						return true;
					} else {
						// There was a problem, we should backtrack


						// Remove value from input
						this.cellMatrix[sqRow][sqCol].value = "";
						// Remove value from matrices
						this.matrix.row[sqRow][sqCol] = "";
						this.matrix.col[sqCol][sqRow] = "";
						this.matrix.sect[sectRow][sectCol][secIndex] = "";
					}
				}

				// If there was no success with any of the legal
				// numbers, call backtrack recursively backwards
				return false;
			}
		},

		/**
		 * Find closest empty square relative to the given cell.
		 *
		 * @param {Number} row Row id
		 * @param {Number} col Column id
		 * @returns {jQuery} Input element of the closest empty
		 *  square
		 */
		findClosestEmptySquare: function(row, col) {
			var walkingRow, walkingCol, found = false;
			for (var i = col + 9 * row; i < 81; i++) {
				walkingRow = Math.floor(i / 9);
				walkingCol = i % 9;
				if (this.matrix.row[walkingRow][walkingCol] === "") {
					found = true;
					return this.cellMatrix[walkingRow][walkingCol];
				}
			}
		},

		/**
		 * Find the available legal numbers for the square in the
		 * given row and column.
		 *
		 * @param {Number} row Row id
		 * @param {Number} col Column id
		 * @returns {Array} An array of available numbers
		 */
		findLegalValuesForSquare: function(row, col) {
			var temp,
				legalVals,
				legalNums,
				val,
				i,
				sectRow = Math.floor(row / 3),
				sectCol = Math.floor(col / 3);

			legalNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

			// Check existing numbers in col
			for (i = 0; i < 9; i++) {
				val = Number(this.matrix.col[col][i]);
				if (val > 0) {
					// Remove from array
					if (util.includes(legalNums, val)) {
						legalNums.splice(legalNums.indexOf(val), 1);
					}
				}
			}

			// Check existing numbers in row
			for (i = 0; i < 9; i++) {
				val = Number(this.matrix.row[row][i]);
				if (val > 0) {
					// Remove from array
					if (util.includes(legalNums, val)) {
						legalNums.splice(legalNums.indexOf(val), 1);
					}
				}
			}

			// Check existing numbers in section
			sectRow = Math.floor(row / 3);
			sectCol = Math.floor(col / 3);
			for (i = 0; i < 9; i++) {
				val = Number(this.matrix.sect[sectRow][sectCol][i]);
				if (val > 0) {
					// Remove from array
					if (util.includes(legalNums, val)) {
						legalNums.splice(legalNums.indexOf(val), 1);
					}
				}
			}

			// Shuffling the resulting 'legalNums' array will
			// make sure the solver produces different answers
			// for the same scenario. Otherwise, 'legalNums'
			// will be chosen in sequence.
			for (i = legalNums.length - 1; i > 0; i--) {
				var rand = getRandomInt(0, i);
				temp = legalNums[i];
				legalNums[i] = legalNums[rand];
				legalNums[rand] = temp;
			}

			return legalNums;
		}
	};

	/**
	 * Get a random integer within a range
	 *
	 * @param {Number} min Minimum number
	 * @param {Number} max Maximum range
	 * @returns {Number} Random number within the range (Inclusive)
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max + 1)) + min;
	}

	/**
	 * Get a number of random array items
	 *
	 * @param {Array} array The array to pick from
	 * @param {Number} count Number of items
	 * @returns {Array} Array of items
	 */
	function getUnique(array, count) {
		// Make a copy of the array
		var tmp = array.slice(array);
		var ret = [];

		for (var i = 0; i < count; i++) {
			var index = Math.floor(Math.random() * tmp.length);
			var removed = tmp.splice(index, 1);

			ret.push(removed[0]);
		}
		return ret;
	}

	function triggerEvent(el, type) {
		if ('createEvent' in document) {
			// modern browsers, IE9+
			var e = document.createEvent('HTMLEvents');
			e.initEvent(type, false, true);
			el.dispatchEvent(e);
		} else {
			// IE 8
			var e = document.createEventObject();
			e.eventType = type;
			el.fireEvent('on' + e.eventType, e);
		}
	}

	var Sudoku = function(container, settings) {
		this.container = container;

		if (typeof container === "string") {
			this.container = document.querySelector(container);
		}

		this.game = new Game(util.extend(defaultConfig, settings));

		this.container.appendChild(this.getGameBoard());
	};

	Sudoku.prototype = {
		/**
		 * Return a visual representation of the board
		 * @returns {jQuery} Game table
		 */
		getGameBoard: function() {
			return this.game.buildGUI();
		},

		newGame: function() {
			var that = this;
			this.reset();

			setTimeout(function() {
				that.start();
			}, 20);
		},

		/**
		 * Start a game.
		 */
		start: function() {
			var arr = [],
				x = 0,
				values,
				rows = this.game.matrix.row,
				inputs = this.game.table.getElementsByTagName("input"),
				difficulties = {
					"easy": 50,
					"normal": 40,
					"hard": 30,
				};

			// Solve the game to get the solution
			this.game.solveGame(0, 0);

			util.each(rows, function(i, row) {
				util.each(row, function(r, val) {
					arr.push({
						index: x,
						value: val
					});
					x++;
				});
			});

			// Get random values for the start of the game
			values = getUnique(arr, difficulties[this.game.config.difficulty]);

			// Reset the game
			this.reset();

			util.each(values, function(i, data) {
				var input = inputs[data.index];
				input.value = data.value;
				input.classList.add("disabled");
				input.tabIndex = -1;
				triggerEvent(input, 'keyup');
			});
		},

		/**
		 * Reset the game board.
		 */
		reset: function() {
			this.game.resetGame();
		},

		/**
		 * Call for a validation of the game board.
		 * @returns {Boolean} Whether the board is valid
		 */
		validate: function() {
			var isValid;

			isValid = this.game.validateMatrix();
			this.game.table.classList.toggle("valid-matrix", isValid);
		},

		/**
		 * Call for the solver routine to solve the current
		 * board.
		 */
		solve: function() {
			var isValid;
			// Make sure the board is valid first
			if (!this.game.validateMatrix()) {
				return false;
			}

			// Solve the game
			isValid = this.game.solveGame(0, 0);

			// Visual indication of whether the game was solved
			this.game.table.classList.toggle("valid-matrix", isValid);

			if (isValid) {
				var inputs = this.game.table.getElementsByTagName("input");

				util.each(inputs, function(i, input) {
					input.classList.add("disabled");
					input.tabIndex = -1;
				});
			}
		}
	};

	global.Sudoku = Sudoku;
})(this);

var game = new Sudoku(".container");

game.start();

// Controls

const container = document.querySelector(".sudoku-container");
const inputs = Array.from(document.querySelectorAll("input"));
container.addEventListener("click", e => {
	const el = e.target.closest("input");
	
	if ( el ) {
		inputs.forEach(input => {
			input.classList.toggle("highlight", input.value && input.value === el.value );
		});
	}
}, false);


document.getElementById("controls").addEventListener("click", function(e) {

	var t = e.target;

	if (t.nodeName.toLowerCase() === "button") {
		game[t.dataset.action]();
	}
});

