// Declaring global variables
var boxes = [];
var turn = true;
var you = 0;
var comp = 0;

// Declaring music controls
const bgMusic = new Audio('./sounds/bgMusic.mp3');
const click = new Audio('./sounds/click.mp3');
const fill = new Audio('./sounds/fill.mp3');
const win = new Audio('./sounds/win.mp3');

// Starting the background music on loading the game
document.addEventListener('click', ()=> {
	bgMusic.volume = 0.1;
	bgMusic.play();
});

// On loading the game board will be prepared
function load() {

	// Declaring variables required for the game structure
	boxes = [];
	turn = true;
	you = 0;
	comp = 0;
	var m = 10;
	var n = 10;
	var offset = 50;

	var sx = sx = window.innerWidth / 2 - (m * offset) / 2,
		sy = offset * 2.5;

	var html = "";

	$("#app").html(html);

	var c = 0;

	for (var j = 0; j < m; j++) {
		for (var i = 0; i < n; i++) {

			var x = sx + i * offset,
				y = sy + j * offset;

			html += `
				<div class="box" data-id="${c}" style="z-index=${i - 1}; left:${x + 2.5}px; top:${y + 2.5}px"></div>
				<div class="dot" style="z-index=${i}; left:${x - 5}px; top:${y - 5}px" data-box="${c}"></div>						
				<div class="line lineh" data-line-1="${c}" data-line-2="${c - m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				<div class="line linev" data-line-1="${c}" data-line-2="${c - 1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;
			boxes.push(0);
			c++;
		}
	}

	//right boxes
	for (var i = 0; i < n; i++) {
		var x = sx + m * offset,
			y = sy + i * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x - 5}px; top:${y - 5}px" data-box="${c}"></div>
				<div class="line linev" data-line-1="${m * (i + 1) - 1}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;
	}

	//bottom boxes
	for (var i = 0; i < m; i++) {
		var x = sx + i * offset,
			y = sy + n * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x - 5}px; top:${y - 5}px" data-box="${c}"></div>
				<div class="line lineh" data-line-1="${((n - 1) * m) + i}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;
	}

	//right-bottom most dot
	html += `<div class="dot" style="z-index=${i}; left:${sx + m * offset - 5}px; top:${sy + n * offset - 5}px" data-active="false"></div>`

	//append to dom
	$("#app").html(html);
	applyEvents();
}

// Apply the events like line drawing, filling the boxes, etc.
function applyEvents() {
	$("div.line").unbind('click').bind('click', function () {

		var id1 = parseInt($(this).attr("data-line-1"));
		var id2 = parseInt($(this).attr("data-line-2"));

		if (checkValid(this) && turn) {
			click.play();
			var a = false, b = false;

			if (id1 >= 0) var a = addValue(id1);
			if (id2 >= 0) var b = addValue(id2);
			$(this).addClass("line-active");
			$(this).attr("data-active", "true");

			if (a === false && b === false) {
				computer();
			}
		}
	});
}

// Filling the colors in the boxes
function acquire(id) {
	fill.play();
	var color;
	if (turn) {
		color = "salmon";
		you++;
	} else {
		color = "skyblue";
		comp++;
	}

	$("div.box[data-id='" + id + "']").css("background-color", color);
	boxes[id] = "full";

	$(".player2").text("You : " + you);
	$(".player1").text("Computer : " + comp);

	var full = true;
	for (var i = boxes.length - 1; i >= 0; i--) {
		if (boxes[i] != full) {
			full = false;
			break;
		}
	}

	if (full) {
		win.play();
		alert(((you > comp) ? "You" : "Computer") + " won");
	}
}

function addValue(id) {
	boxes[id]++;

	if (boxes[id] === 4) {
		acquire(id);
		return true;
	}
	return false;
}

// Check valid attribution i.e., active data
function checkValid(t) {
	return ($(t).attr("data-active") === "false");
}

// Computer functioning
function computer() {
	turn = false;
	$("#turn").text("Turn : " + "Computer");

	setTimeout(function () {

		//play
		var length = boxes.length;

		var arr3 = [], arr2 = [], arr1 = [], arr0 = [];

		for (var i = length - 1; i >= 0; i--) {
			if (boxes[i] === 3) arr3.push(i);
			else if (boxes[i] === 2) arr2.push(i);
			else if (boxes[i] === 1) arr1.push(i);
			else arr0.push(i);
		}

		//best case
		if (arr3.length > 0) {
			computerSelect(arr3[random(0, arr3.length - 1)]);
		}

		//better case
		else if (arr1.length > 0) {
			computerSelect(arr1[random(0, arr1.length - 1)]);
		}

		//normal case
		else if (arr0.length > 0) {
			computerSelect(arr0[random(0, arr0.length - 1)]);
		}

		//worst case
		else if (arr2.length > 0) {
			computerSelect(arr2[random(0, arr2.length - 1)]);
		}

	}, 500);

}

// Selection of the computer
function computerSelect(id) {
	$("div.line[data-line-1='" + id + "'], div.line[data-line-2='" + id + "']").each(function (i, v) {
		if (!$(v).hasClass("line-active")) {
			var id1 = parseInt($(v).attr("data-line-1"));
			var id2 = parseInt($(v).attr("data-line-2"));

			if (checkValid(v) && turn === false) {
				if (id1 >= 0) var a = addValue(id1);
				if (id2 >= 0) var b = addValue(id2);
				$(v).addClass("line-active");
				$(v).attr("data-active", "true");

				if (a === true || b === true) {
					computer();
				} else {
					turn = true;
					$("#turn").text("Turn : " + "You");
				}
			}
		}
	});
}

// Generate random number for the computer functionality
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Game triggered
load();
