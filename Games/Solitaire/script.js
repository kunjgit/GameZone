document.getElementById("startButton").addEventListener("click", function () {
			loadGame();
		});
function loadGame() {
	document.getElementById("title").remove();
	document.getElementById("subtext").remove();
	document.getElementById("startButton").remove();
	let stopWatch, newCards, flipNewCards;
let lastIndex = 51,completedAce = 0,movesMade = 0, nextIndex = 0, time = 0, handsPlayed = 0, handsWon = 0, cardsDragged = [], remainingCards = [];

let canvas = document.getElementById('canvas');
document.body.prepend(canvas);

let zone = document.getElementById('zone');
canvas.append(zone);

let scoreArea = document.getElementById('scoreArea');
canvas.append(scoreArea);

let scoreBlockTime = document.createElement('div');
scoreBlockTime.className = 'scoreBlock';
scoreArea.append(scoreBlockTime);

let scoreBlockMoves = document.getElementById('scoreBlockMoves');
scoreBlockMoves.className = 'scoreBlock';
scoreArea.append(scoreBlockMoves);

let scoreValueMoves = document.createElement('span');
scoreValueMoves.className = 'scoreValue';
scoreValueMoves.innerText = movesMade + ' moves';
scoreBlockMoves.appendChild(scoreValueMoves);

let scoreValueTime = document.createElement('span');
scoreValueTime.className = 'scoreValue';
scoreValueTime.innerText = '0:00';
scoreBlockTime.append(scoreValueTime);


initializeGame();			

function displayModel(){
	let shadowBack = document.createElement('div');
	shadowBack.id = 'shadowBack';
	zone.append(shadowBack);

	let model = document.createElement('div');
	model.id = 'model';
	shadowBack.append(model);

	let modelConent = document.createElement('div');
	modelConent.id = 'modelConent';
	model.append(modelConent);

	let modelSpan = document.createElement('span');
	modelSpan.id = 'modelSpan';
	modelSpan.innerText = 'Congratulations, you won!';
	modelConent.append(modelSpan);

	let modelScoreBlock = document.createElement('div');
	modelScoreBlock.id = 'modelScoreBlock';
	modelConent.append(modelScoreBlock);

	let playedSpan = document.createElement('span');
	playedSpan.className = 'scoreSpan';
	playedSpan.innerText = 'Hands played: ' + handsPlayed;
	modelScoreBlock.append(playedSpan);

	let wonSpan = document.createElement('span');
	wonSpan.className = 'scoreSpan';
	wonSpan.innerText = 'Hands won: ' + handsWon;
	modelScoreBlock.append(wonSpan);

	let modelBtn = document.createElement('btn');
	modelBtn.id = 'modelBtn';
	modelBtn.innerText = 'Play again';
	modelBtn.addEventListener('click', function(){
		fadeOutAnimation(shadowBack, 500);
		setTimeout(function(){
			initializeGame();
		}, 200);
	});
	modelConent.append(modelBtn);
	setTimeout(function(){
		shadowBack.style.cssText = 'opacity:1';
	}, 1);
} 

function initializeGame(){
	resetGame();
	shuffleCards(1, deck);
	handsPlayed++;

	for(let i = 28; i < deck.length; i++){
		remainingCards[i] = deck[i];
	}
	zone.innerHTML = '';
	
	newCards = document.createElement('div');
	newCards.className = 'cardBlockNewClick cardHidden';
	zone.append(newCards);

	flipNewCards = document.createElement('div');
	flipNewCards.className = 'cardBlockFlip';
	zone.append(flipNewCards);

	newCards.addEventListener('click', function(){
		distributeCards(0, flipNewCards);
		incrementMoves();
	});

	let blankBlock = document.createElement('div');
	blankBlock.className = 'blankBlock';
	zone.append(blankBlock);

	for(let i = 0; i < 4; i++){
		let aceBlock = document.createElement('div');
		aceBlock.className = 'cardBlockAce';
		aceBlock.addEventListener('drop', function(){
			processAceDrop(event);
		});
		aceBlock.addEventListener('dragover', function(){
			enableDrop(event);
		});
		zone.append(aceBlock);
	}

	let divider = document.createElement('div');
	zone.append(divider);

	for(let i = 0; i < 7; i++){
		let playBlock = document.createElement('div');
		playBlock.className = 'cardBlock';
		playBlock.addEventListener('drop', function(){
			drop(event);
		});
		playBlock.addEventListener('dragover', function(){
			enableDrop(event);
		});
		zone.append(playBlock);

		distributeCards(i, playBlock);
	}

	scoreValueTime.innerText = '0:00';
	scoreValueMoves.innerText = movesMade + ' moves';
}


function incrementMoves(){
	movesMade++;
	document.getElementsByClassName('scoreValue')[1].innerText = movesMade + ' moves';
	if(movesMade == 1){
		startStopwatch();
	}
}

function timerConvert(ms) {
	let minutes = Math.floor(ms / 60000);
	let time = ((ms % 60000) / 1000).toFixed(0);
	return (time == 60)? (minutes + 1) + ':00' : minutes + ':' + ((time < 10)? '0' : '') + time;
}

function startStopwatch(){
	stopWatch = setInterval(function() {
		time = time + 1000;
		document.getElementsByClassName('scoreValue')[0].innerText = timerConvert(time);
	}, 1000);
}

function validateDealtCards(count){
	if(remainingCards[nextIndex] == null){
		nextIndex++;
		
		if(nextIndex > lastIndex){
			flipNewCards.innerHTML = '';
			newCards.innerHTML = '';
			newCards.className = 'cardBlockNewClick cardHidden';
			nextIndex = 28;
		}

		count++;
		if(count == 30){
			lastIndex = 0;
			return false;
		}

		validateDealtCards(count);
	}
}

function distributeCards(count, playBlock){
	if(nextIndex > lastIndex){
		flipNewCards.innerHTML = '';
		newCards.innerHTML = '';
		newCards.className = 'cardBlockNewClick cardHidden';
		nextIndex = 28;
	}

	let deal = (nextIndex > 27)? remainingCards : deck;

	if(nextIndex > 27){
		validateDealtCards(1);
	}

	if(lastIndex != 0){
		for(let i = 1; i <= (count + 1); i++){
			let viewClass = (nextIndex < 28)? ' cardHidden' : '';
			let colourClass = (deal[nextIndex].suit == 'heart' || deal[nextIndex].suit == 'diamond')? ' red' : ' black';
			let topClass = (i > 1)? ' topClass' + i : '';
			let card = document.createElement('div');
			card.className = 'card' + topClass + viewClass;
			card.id = deal[nextIndex].suit + deal[nextIndex].face;
			card.setAttribute('data-id', nextIndex);
			card.setAttribute('data-face', deal[nextIndex].face);
			card.setAttribute('data-suit', deal[nextIndex].suit);
			if(nextIndex > 27){
				card.setAttribute('draggable', true);
				card.setAttribute('deal-card', true);
			}
			card.addEventListener('dragstart', function(){
				startDrag(event);
			});
			playBlock.append(card);

			let numberTop = document.createElement('div');
			numberTop.className = 'number-top' + colourClass;
			numberTop.innerText = deal[nextIndex].face;
			card.append(numberTop);

			let suitTop = document.createElement('div');
			suitTop.className = 'suit-top';
			card.append(suitTop);

			let suitTopEl = document.createElement('div');
			suitTopEl.className = deal[nextIndex].suit;
			suitTop.append(suitTopEl);

			let suitCentre = document.createElement('div');
			suitCentre.className = 'suit-centre';
			card.append(suitCentre);

			if(deal[nextIndex].face != 'J' && deal[nextIndex].face != 'Q' && deal[nextIndex].face != 'K' && deal[nextIndex].face != 'A'){
				for(let k = 0; k < parseInt(deal[nextIndex].face); k++){
					let suitEl = document.createElement('div');
					suitEl.className = deal[nextIndex].suit + ' ' + deal[nextIndex].suitClass + '-' + suitCentreClasses[k];
					suitCentre.append(suitEl);
				}
			}else{
				let suitEl = document.createElement('div');
				suitEl.className = deal[nextIndex].suitClass + ' ' + deal[nextIndex].suitCentreClass;
				suitEl.innerText = deal[nextIndex].face;
				suitCentre.append(suitEl);
			}

			let numberBottom = document.createElement('div');
			numberBottom.className = 'number-bottom';
			numberBottom.innerText = deal[nextIndex].face;
			card.append(numberBottom);

			let suitBottom = document.createElement('div');
			suitBottom.className = 'suit-bottom';
			card.append(suitBottom);

			let suitBottomEl = document.createElement('div');
			suitBottomEl.className = deal[nextIndex].suit;
			suitBottom.append(suitBottomEl);

			nextIndex++;
			if(nextIndex == 28){
				let cardBlocks = document.getElementsByClassName('cardBlock');
				for(let i = 0; i < cardBlocks.length; i++){
					let cardsEl = cardBlocks[i].getElementsByClassName('card');
					cardsEl[cardsEl.length - 1].classList.remove('cardHidden');
					cardsEl[cardsEl.length - 1].setAttribute('draggable', true);
				}
			}
			
			for(let j = 0; j < deck.length; j++){
				if(remainingCards[j] != null){
					lastIndex = j;
				}
			}

			if(nextIndex > lastIndex){
				newCards.className = 'cardBlockNewClick';
				let span = document.createElement('span');
				span.className = 'ncbSpan';
				span.innerText = '0';
				newCards.append(span);
			}
		}
	}else{
		newCards.innerHTML = '';
		newCards.className = 'cardBlockNewClick';
		let span = document.createElement('span');
		span.className = 'ncbSpanClose';
		span.innerText = 'X';
		newCards.append(span);
		newCards.removeEventListener('click', function(){
			distributeCards(0, flipNewCards);
			incrementMoves();
		});
	}
}

function fadeInAnimation(el, time){
	el.style.cssText = 'opacity:1';
	setTimeout(function(){
		el.removeAttribute('style');
	}, time);
}

function fadeOutAnimation(el, time){
	el.style.cssText = 'opacity:0;';
	setTimeout(function(){
		el.innerHTML = '';
	}, time);
}

function enableDrop(ev) {
	ev.preventDefault();
}

function startDrag(ev) {
	cardsDragged = [];
	ev.dataTransfer.setData("card", ev.target.id);
	cardsDragged.push(ev.target.id);
	let cardBlockParent = ev.target.closest('.cardBlock');
	if(cardBlockParent != null){
		let cardsEl = cardBlockParent.getElementsByClassName('card');
		let cardPos = Array.from(ev.target.parentNode.children).indexOf(ev.target);
		for(let i = cardPos + 1; i < cardsEl.length; i++){
			cardsDragged.push(cardsEl[i].id);
		}
	}
}

function processAceDrop(ev){
	let data = ev.dataTransfer.getData("card");
	let element = document.getElementById(data);
	let parent = element.closest('.cardBlock');
	if(document.getElementById(data).hasAttribute('deal-card')){
		element.removeAttribute('deal-card');
		let cardId = element.getAttribute('data-id');
		remainingCards[cardId] = null;
	}
	if(ev.target.className != 'cardBlockAce'){
		let cardBlockParent = ev.target.closest('.cardBlockAce');
		let currentFace = element.getAttribute('data-face');
		let currentSuit = element.getAttribute('data-suit');
		let cardsEl = cardBlockParent.getElementsByClassName('card');
		let dropSuit = cardsEl[cardsEl.length - 1].getAttribute('data-suit');

		if(currentSuit == dropSuit){
			let currentFacePos = cardPosition(currentFace, 1) - 1;
			let dropFacePos = cardPosition(cardsEl[cardsEl.length - 1].getAttribute('data-face'), 1);
			if(currentFacePos == dropFacePos){
				element.className = 'card';
				cardBlockParent.append(element);
				incrementMoves();
				if(parent !== null){
					let cardCount = parent.getElementsByClassName('card');
					if(cardCount.length > 0){
						cardCount[cardCount.length - 1].classList.remove('cardHidden');
						cardCount[cardCount.length - 1].setAttribute('draggable', true);
					}
				}
				checkWin();
			}
		}
	}else{
		if(element.getAttribute('data-face') == 'A'){
			element.className = 'card';
			ev.target.appendChild(element);
			incrementMoves();
			if(parent != null){
				let cardCount = parent.getElementsByClassName('card');
				if(cardCount.length > 0){
					cardCount[cardCount.length - 1].classList.remove('cardHidden');
					cardCount[cardCount.length - 1].setAttribute('draggable', true);
				}
			}
		}
	}
}

function drop(ev) {
	for(let i = 0; i < cardsDragged.length; i++){
		let data = cardsDragged[i];
		let element = document.getElementById(data);
		let parent = element.closest('.cardBlock');
		let face = element.getAttribute('data-face');
		if(element.hasAttribute('deal-card')){
			element.removeAttribute('deal-card');
			let cardId = element.getAttribute('data-id');
			remainingCards[cardId] = null;
		}
		if(ev.target.className == 'cardBlock' && face == 'K'){
			element.className = 'card topClass' + ev.target.getElementsByClassName('card').length + 1;
			ev.target.appendChild(element);
			if(parent != null){
				let cardCount = parent.getElementsByClassName('card');
				if(cardCount.length > 0){
					cardCount[cardCount.length - 1].classList.remove('cardHidden');
					cardCount[cardCount.length - 1].setAttribute('draggable', true);
				}
			}
		}
		let cardBlockParent = ev.target.closest('.cardBlock');
		let currentSuit = element.getAttribute('data-suit');
		let cardsEl = cardBlockParent.getElementsByClassName('card');
		let dropSuit = (cardsEl[cardsEl.length - 1])? cardsEl[cardsEl.length - 1].getAttribute('data-suit') : 'blank';

		if(((currentSuit == 'heart' || currentSuit == 'diamond') && (dropSuit == 'spade' || dropSuit == 'clubs')) || ((currentSuit == 'spade' || currentSuit == 'clubs') && (dropSuit == 'heart' || dropSuit == 'diamond'))){
			let currentFacePos = cardPosition(face, 0) + 1;
			let dropFacePos = cardPosition(cardsEl[cardsEl.length - 1].getAttribute('data-face'), 0);
			if(currentFacePos == dropFacePos){
				element.setAttribute('temp', true);
				element.className = 'card topClass' + (ev.target.closest('.cardBlock').getElementsByClassName('card').length + 1);
				cardBlockParent.append(element);

				if(parent != null){
					let cardCount = parent.getElementsByClassName('card');
					if(cardCount.length > 0){
						cardCount[cardCount.length - 1].classList.remove('cardHidden');
						cardCount[cardCount.length - 1].setAttribute('draggable', true);
					}
				}
			}
		}

		ev.preventDefault();
	}

	incrementMoves();
}

function checkWin(){
	let aceBlock = document.getElementsByClassName('cardBlockAce');
	for(let i = 0; i < aceBlock.length; i++){
		let card = aceBlock[i].getElementsByClassName('card');
		if(card.length == 13){
			completedAce++;
		}else{
			return completedAce = 0;
		}
	}

	if(completedAce == 4){
		return processWin();
	}
}

function processWin(){
	clearInterval(stopWatch);
	handsWon++;

	let aceBlock = document.getElementsByClassName('cardBlockAce');
	for(let i = 0; i < aceBlock.length; i++){
		let card = aceBlock[i].getElementsByClassName('card');
		for(let j = 0; j < card.length; j++){
			let counter = 500 * j;
			let maxTime = 500 * card.length + 500;
			setTimeout(function(){
				card[j].style.cssText = 'top: 457px; left -436px';
			}, counter);
			setTimeout(function(){
				card[j].removeAttribute('style');
			}, maxTime);
		}
	}
	
	setTimeout(function(){
		displayModel();
	}, 7000);
}


function resetGame(){
	clearInterval(stopWatch);
	lastIndex = 51;
	completedAce = 0;
	movesMade = 0;
	nextIndex = 0;
	time = 0;
	cardsDragged = [];
	remainingCards = [];
}
}