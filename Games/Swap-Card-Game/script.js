// Audion variables
const bgMusic = new Audio();
bgMusic.src = 'https://drive.google.com/uc?export=download&id=1Y2NcCVRjdQypNCXcj6t-hu8GdqMxMcPS';
bgMusic.volume = 0.3;

const winSound = new Audio();
winSound.src = 'https://drive.google.com/uc?export=download&id=1_U-FQd0q9ZTfnDQTEBtM8ZB0gf-cEUwL';

const looseSound = new Audio();
looseSound.src = 'https://drive.google.com/uc?export=download&id=19tUhCzCGyNX9Es2xqiAcJpyklQ7L7I3_';

function assign() {
	bgMusic.play();

	if (x.nm === 1) {
		$("#a").each(function () {
			$(this).attr("src", ".\\Deck\\Hearts\\" + x.val + "-H.png");
		});
	}
	if (x.nm === 2) {
		$("#a").each(function () {
			$(this).attr("src", ".\\Deck\\Diamonds\\" + x.val + "-D.png");
		});
	}
	if (x.nm === 3) {
		$("#a").each(function () {
			$(this).attr("src", ".\\Deck\\Clubs\\" + x.val + "-C.png");
		});
	}
	if (x.nm === 4) {
		$("#a").each(function () {
			$(this).attr("src", ".\\Deck\\Spades\\" + x.val + "-S.png");
		});
	}

	if (y.nm === 1) {
		$("#b").each(function () {
			$(this).attr("src", ".\\Deck\\Hearts\\" + y.val + "-H.png");
		});
	}
	if (y.nm === 2) {
		$("#b").each(function () {
			$(this).attr("src", ".\\Deck\\Diamonds\\" + y.val + "-D.png");
		});
	}
	if (y.nm === 3) {
		$("#b").each(function () {
			$(this).attr("src", ".\\Deck\\Clubs\\" + y.val + "-C.png");
		});
	}
	if (y.nm === 4) {
		$("#b").each(function () {
			$(this).attr("src", ".\\Deck\\Spades\\" + y.val + "-S.png");
		});
	}

	if (z.nm === 1) {
		$("#c").each(function () {
			$(this).attr("src", ".\\Deck\\Hearts\\" + z.val + "-H.png");
		});
	}
	if (z.nm === 2) {
		$("#c").each(function () {
			$(this).attr("src", ".\\Deck\\Diamonds\\" + z.val + "-D.png");
		});
	}
	if (z.nm === 3) {
		$("#c").each(function () {
			$(this).attr("src", ".\\Deck\\Clubs\\" + z.val + "-C.png");
		});
	}
	if (z.nm === 4) {
		$("#c").each(function () {
			$(this).attr("src", ".\\Deck\\Spades\\" + z.val + "-S.png");
		});
	}
}

$(document).ready(function () {
	$("#con1").hide();
});

$(document).ready(function () {
	$("#con3").hide();
});

var btn = document.getElementById("btn");
btn.onclick = function () {
	document.querySelector('.con').style.display = 'none';
	btn.style.display = 'none';
	$(document).ready(function () {
		$("#con1").show(1000);
	});
}

var show = document.getElementById("show");
var a1 = document.getElementById("a");
var b1 = document.getElementById("b");
var c1 = document.getElementById("c");

var x = { val: Math.floor((Math.random() * 13) + 1), nm: Math.floor((Math.random() * 4) + 1) };
var y = { val: Math.floor((Math.random() * 13) + 1), nm: Math.floor((Math.random() * 4) + 1) };
var z = { val: Math.floor((Math.random() * 13) + 1), nm: Math.floor((Math.random() * 4) + 1) };

show.onclick = function () {
	assign();

	$(document).ready(function () {
		$("#con1").hide();
	});

	$(document).ready(function () {
		$("#con2").show(1000);
	});
}

var swap2 = document.getElementById("swap2");

swap2.onclick = function () {
	let d = Math.floor((Math.random() * 100) + 1);
	let t = { val: Math.floor((Math.random() * 13) + 1), nm: Math.floor((Math.random() * 4) + 1) };
	for (let i = 0; i < d; i++) {
		t = x;
		x = y;
		y = z;
		z = t;
	}

	assign();

	$(document).ready(function () {
		$("#con2").hide();
	});

	$(document).ready(function () {
		$("#con3").show(1000);
	});
}

var x1, y1, z1;

if (x.nm == 1) {
	x1 = "Hearts";
}
if (x.nm == 2) {
	x1 = "Diamonds";
}
if (x.nm == 3) {
	x1 = "Clubs";
}
if (x.nm == 4) {
	x1 = "Spades";
}

if (y.nm == 1) {
	y1 = "Hearts";
}
if (y.nm == 2) {
	y1 = "Diamonds";
}
if (y.nm == 3) {
	y1 = "Clubs";
}
if (y.nm == 4) {
	y1 = "Spades";
}

if (z.nm == 1) {
	z1 = "Hearts";
}
if (z.nm == 2) {
	z1 = "Diamonds";
}
if (z.nm == 3) {
	z1 = "Clubs";
}
if (z.nm == 4) {
	z1 = "Spades";
}

var submit = document.getElementById("sub");
submit.onclick = function () {
	let g1 = document.getElementById("g1").value;
	let g2 = document.getElementById("g2").value;
	let g3 = document.getElementById("g3").value;
	let g4 = document.getElementById("nm1").value;
	let g5 = document.getElementById("nm2").value;
	let g6 = document.getElementById("nm3").value;

	let announce = document.getElementById('print');
	if (g1 == x.val && g2 == y.val && g3 == z.val && g4 == x1 && g5 == y1 && g6 == z1) {
		announce.innerHTML = "YOU WIN !!";
		announce.style.color = 'lightgreen';
		winSound.play();
		setTimeout(function () {
			location.reload();
		}, 5000);
	}
	else {
		announce.innerHTML = "TRY AGAIN !!";
		announce.style.color = 'salmon';
		looseSound.play();
		setTimeout(function () {
			announce.innerHTML = "";
		}, 3200);
	}
}
