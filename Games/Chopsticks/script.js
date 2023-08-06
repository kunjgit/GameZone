let GAME = {};

$(document).ready(function() {

	GAME.game = $(".game");
	GAME.startScreen = $(".start-screen");
	GAME.startBtn = $(".option.start");
	GAME.playAreas = $(".playArea");
	GAME.state = 0;
	GAME.player1 = $(".playArea.p1");
	GAME.p1Hands = $(".hand.p1");
	GAME.p1Hand1 = $(".p1.top");
	GAME.p1Hand2 = $(".p1.bottom");
	GAME.player2 = $(".playArea.p2");
	GAME.p2Hands = $(".hand.p2");
	GAME.p2Hand1 = $(".p2.top");
	GAME.p2Hand2 = $(".p2.bottom");
	GAME.splitBtns = $(".split-btn");
	GAME.upBtns = $(".split-btn.up");
	GAME.downBtns = $(".split-btn.down");
	GAME.updateBtns = $(".split-btn.update");

	GAME.startBtn.click(function() {
		GAME.startScreen.fadeOut(300, function() {
			GAME.playAreas.fadeIn();
		});
	});

	GAME.p1Hands.click(GAME.clickHand);
	GAME.p2Hands.click(GAME.clickHand);

	GAME.updateBtns.click(function() { 		
		GAME.state = (GAME.state == 2) ? 3 : 0;
		GAME.player1.toggleClass("currentTurn");
		GAME.player2.toggleClass("currentTurn");
		GAME.unselectHand(GAME.p1Hand1);
		GAME.unselectHand(GAME.p1Hand2);
		GAME.unselectHand(GAME.p2Hand1);
		GAME.unselectHand(GAME.p2Hand2);
		GAME.splitBtns.css("display", "");
	
	});
	
	GAME.downBtns.click(function() { GAME.sharePoints(false); });
	GAME.upBtns.click(function() { GAME.sharePoints(true); });

	GAME.player1.addClass("currentTurn");
});

// attack opponent
GAME.challenge = function(increaseBy, target) {
	let value = Number(target.attr("points"));

	let finalVal;
	if (value + increaseBy > 4)
		finalVal = 0;
	else
		finalVal = value + increaseBy;

	GAME.updateMove(target, finalVal, false);

	if (GAME.state == 1) {
		if (GAME.p2Hand1.attr("points") == 0 &&
			GAME.p2Hand2.attr("points") == 0) {


			window.setTimeout(function() { GAME.endScreen(1); }, 500);

			GAME.state = 6;
		}
		else { GAME.state = 3; }
	}
	else if (GAME.state == 4) {

		if (GAME.p1Hand1.attr("points") == 0 &&
			GAME.p1Hand2.attr("points") == 0) {
			window.setTimeout(function() { GAME.endScreen(2); }, 500);

			GAME.state = 6;
		}
		else { GAME.state = 0; }
	}
};

GAME.clickHand = function() {

	let caller = $(this);
	let playerNum = caller.hasClass("p1") ? 1 : 2;
	let isSelected = caller.hasClass("selected");

	if (GAME.state == 0 && playerNum == 1) {

		GAME.selectHand(caller);
		GAME.state = 1;
	}

	else if (GAME.state == 1) {

		if (playerNum == 1 && isSelected) {

			GAME.unselectHand(caller);
			GAME.state = 0;
		}
		else if (playerNum == 1 && !isSelected) {

			GAME.selectHand(caller);
			GAME.state = 2;
			$(".split-btn.p1").css("display", "initial");
		}
		else if (playerNum == 2) {

			let challengeHand = GAME.p1Hand1.hasClass("selected") ?
				GAME.p1Hand1 : GAME.p1Hand2;
			let challengeAmount = Number(challengeHand.attr("points"));

			if ((challengeAmount != 0) && (caller.attr("points") != 0)) {

				GAME.unselectHand(challengeHand);
				GAME.challenge(challengeAmount, caller);
				GAME.player1.toggleClass("currentTurn");
				GAME.player2.toggleClass("currentTurn");
				GAME.unselectHand(GAME.p1Hand1);
				GAME.unselectHand(GAME.p1Hand2);
				GAME.unselectHand(GAME.p2Hand1);
				GAME.unselectHand(GAME.p2Hand2);
				GAME.splitBtns.css("display", "");
			
			}
		}
	}

	else if (GAME.state == 3 && playerNum == 2) {

		GAME.selectHand(caller);
		GAME.state = 4;
	}

	else if (GAME.state == 4) {

		if (playerNum == 2 && isSelected) {	

			GAME.unselectHand(caller);
			GAME.state = 3;
		}
		else if (playerNum == 2 && !isSelected) {

			GAME.selectHand(caller);
			GAME.state = 5;
			$(".split-btn.p2").css("display", "initial");
		}
		else if (playerNum == 1) {

			let challengeHand = GAME.p2Hand1.hasClass("selected") ?
				GAME.p2Hand1 : GAME.p2Hand2;
			let challengeAmount = Number(challengeHand.attr("points"));

			if ((challengeAmount != 0) && (caller.attr("points") != 0)) {

				GAME.unselectHand(challengeHand);
				GAME.challenge(challengeAmount, caller);
				GAME.player1.toggleClass("currentTurn");
				GAME.player2.toggleClass("currentTurn");
				GAME.unselectHand(GAME.p1Hand1);
				GAME.unselectHand(GAME.p1Hand2);
				GAME.unselectHand(GAME.p2Hand1);
				GAME.unselectHand(GAME.p2Hand2);
				GAME.splitBtns.css("display", "");
			
			}
		}
	}

};

// unselect a hand
GAME.unselectHand = function(hand) {

	let old = hand.attr("src");
	if (old.search("unselected") == -1) {

		hand.removeClass("selected");
		hand.attr("src", old.replace("selected", "unselected"));
	}
};

// select a hand
GAME.selectHand = function(hand) {

	let old = hand.attr("src");
	if (old.search("unselected") != -1) {

		hand.addClass("selected");
		hand.attr("src", old.replace("un", ""));
	}
};

// redistribute points
GAME.sharePoints = function(upwards) {

	let Hand1, Hand2;
	if (GAME.state == 2) {

		Hand1 = GAME.p1Hand1;
		Hand2 = GAME.p1Hand2;
	}
	else if (GAME.state == 5) {

		Hand1 = GAME.p2Hand1;
		Hand2 = GAME.p2Hand2;
	}
	else {
		return;
	}

	let pts;
	pts = [
		Number(Hand1.attr("points")),
		Number(Hand2.attr("points")),
	];

	if (upwards)
	{	
		if(pts[1] > 0){
			if (pts[0] + 1 > 4)
				pts[0] = 0;
			else
				pts[0] += 1;
			pts[1] -= 1;
		}
	}
	else
	{
		if(pts[0] > 0){
			if (pts[1] + 1 > 4)
				pts[1] = 0;
			else
				pts[1] += 1;
			pts[0] -= 1;

		}
	}
	
	GAME.updateMove(Hand1, pts[0], true);
	GAME.updateMove(Hand2, pts[1], true);

	if(GAME.state == 2){
		if (pts[0] == 0 && pts[1] == 0){
			window.setTimeout(function() { GAME.endScreen(2); }, 500);
		}
	}
	else{
		if (pts[0] == 0 && pts[1] == 0){
			window.setTimeout(function() { GAME.endScreen(1); }, 500);
		}
	}

}

GAME.updateMove = function(hand, points, isSelected) {

	hand.attr("points", points);

	hand.attr("src", "media/points-" + String(points) + "-" +
		(isSelected ? "" : "un") + "selected.svg");
};

	
GAME.endScreen = function(playerNumber) {

	GAME.game
		.html("<body>Game Over </br></br>Player " + playerNumber + " Wins!!!</br></br><img src = \"media/cup.jpg\" width=\"200\" height=\"150\" style=\"vertical-align:middle\"\></body>")
		.addClass("endScreen");
};
