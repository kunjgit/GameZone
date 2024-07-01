function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],
		chipsValue: {
			blue: 500,
			black: 100,
			green: 25,
			red: 5,
			white: 1
		},
		startContainer: false,
		buttons: [
			new Button('Hit', '#fff', 100, 100, () => player.hit()),
			new Button('Stand', '#fff', 200, 100, () => player.stand()),
			new Button('Go', '#fff', 935, -430, () => game.go()),
			new Button('Insurance', '#fff', 100, -80, () => player.insure()),
			//new Button('Split', '#fff', 100, -40, () => l('split')),
			new Button('Double', '#fff', 100, -40, () => player.double()),
			new Button('Give up', '#fff', 100, 0, () => player.giveUp()),
			new Button('New game', '#fff', 100, -490, () => game.reset())
		],
		buttonContainer: false,
		dealtChipContainer: false,
		inProgress: false,
		dealt: {
			blue: 0,
			black: 0,
			green: 0,
			red: 0,
			white: 0
		},
		resetChips: function(){
			Object.keys(this.dealt).forEach(color => this.dealt[color] = 0);
		},
		message: {
			text: false,
			init: function(){
				this.text = new createjs.Text(messages.bet, '40px Arial', '#fff');
				this.text.x = 850;
				this.text.y = 0;
				stage.addChild(this.text);
			}
		},

		_alert: function(msg){
			var alertText = new createjs.Text(msg.msg, '30px Arial', 'orange');
			alertText.x = msg.x || 745;
			alertText.y = 120;
			stage.addChild(alertText);
			createjs.Tween.get(alertText)
				.wait(1000)
				.to({alpha: 0}, 1000, createjs.Ease.getPowInOut(1));
		},

		reset: function(){
			['userName', 'chips', 'funds'].forEach(v => localStorage.removeItem('BlackJackJs-' + v));
			location.reload();
		},

		over: function(){
			['userName', 'chips', 'funds'].forEach(v => localStorage.removeItem('BlackJackJs-' + v));
			stage.removeAllChildren();
			var gameOverText = new createjs.Text('Game Over', '50px Arial', '#fff');
			gameOverText.center(1, 1);
			var replayText = new createjs.Text('Replay', '30px Arial', '#fff');
			replayText.center(1);
			replayText.y = 400;
			var hit = new createjs.Shape();
			hit.graphics.beginFill("#000").drawRect(0, 0, replayText.getMeasuredWidth(), replayText.getMeasuredHeight());
			replayText.hitArea = hit;
			replayText.alpha = 0.7;
			replayText.cursor = 'Pointer';
			replayText.on('mouseover', function(event){
				replayText.alpha = 1;
			});
			replayText.on('mouseout', event => replayText.alpha = 0.7);
			replayText.addEventListener('click', () => location.reload());
			stage.addChild(gameOverText, replayText);
		},

		balanceChips: function(value){
			var chips = {
				blue: 0,
				black: 0,
				green: 0,
				red: 0,
				white: 0
			};

			while(value !== 0){
				Object.keys(chips).reverse().forEach(function(chip){
					if(value >= game.chipsValue[chip]){
						value -= game.chipsValue[chip];
						chips[chip]++;
					}
				});
			}

			return chips;
		},

		startScreen: function(){
			stage.enableMouseOver(10);
			createjs.Ticker.addEventListener('tick', tick);
			createjs.Ticker.setFPS(60);
			createjs.Sound.registerSound('assets/sounds/sfx_lose.ogg', 'lose');
			createjs.Sound.registerSound('assets/sounds/sfx_shieldUp.ogg', 'win');
			createjs.Sound.registerSound('assets/Bonus/cardPlace1.ogg', 'card');
			createjs.Sound.registerSound('assets/Bonus/chipsCollide1.ogg', 'chip');
			if(localStorage.getItem('BlackJackJs-userName')){
				player.name.value = localStorage.getItem('BlackJackJs-userName');
				player.funds = localStorage.getItem('BlackJackJs-funds');
				player.chips = JSON.parse(localStorage.getItem('BlackJackJs-chips'));
				this.start();
			}
			else{
				this.startContainer = new createjs.Container();
				var titleText = new createjs.Text('BlackJackJs', '60px Arial', '#fff');
				titleText.center(1, 1);
				var nameInput = new TextInput();
				// autofocus
				nameInput._focused = true;
				nameInput._hiddenInput.style.display = 'block';
				nameInput._hiddenInput.style.left = (nameInput.x + stage.canvas.offsetLeft + nameInput._padding) + 'px';
				nameInput._hiddenInput.style.top = (nameInput.y + stage.canvas.offsetTop + nameInput._padding) + 'px';
				nameInput._hiddenInput.focus();
				nameInput.x = 430;
				nameInput.y = 400;
				nameInput._visiblePostCursorText.text = 'Your name';

				var submitText = new createjs.Text('OK', '30px Arial', '#fff');
				submitText.x = 640;
				submitText.y = 403;
				submitText.cursor = 'Pointer';
				var hit = new createjs.Shape();
				hit.graphics.beginFill('#000').drawRect(0, 0, submitText.getMeasuredWidth(), submitText.getMeasuredHeight());
				submitText.hitArea = hit;
				submitText.addEventListener('click', function(event){
					player.name.value = nameInput._visiblePreCursorText.text || 'Player 1';
					localStorage.setItem('BlackJackJs-userName', player.name.value);
					localStorage.setItem('BlackJackJs-funds', '1000');
					localStorage.setItem('BlackJackJs-chips', JSON.stringify(player.chips));
					game.start();
				});
				this.startContainer.addChild(titleText, nameInput, submitText);
				stage.addChild(this.startContainer);
			}
		},

		start: function(){
			player.name.text = new createjs.Text(player.name.value, '30px Arial', '#fff');
			player.name.text.center();
			player.name.text.y = 600;
			stage.addChild(player.name.text);
			if(this.startContainer)
				this.startContainer.removeAllChildren();
			this.message.init();
			player.fundsText.init();
			this.buildDeck();
			this.addButtons();
			this.addChips();
		},

		go: function(){
			if(player.dealt && !this.inProgress){
				game.inProgress = true;
				player.betted = true;
				this.message.text.text = '';
				this.new();
			}
			else if(!player.dealt)
				game._alert(messages.warning.bet);
		},

		end: function(){
			game.dealtChipContainer.removeAllChildren();
			game.inProgress = false;
			player.betted = false;
			player.insurance = false;
			player.doubled = false;
			player.deck = [];
			player.blackjack = false;
			bank.blackjack = false;
			bank.deck = [];
			player.dealt = 0;
			player.chips = game.balanceChips(player.funds);
			game.resetChips();
			game.addChips();
			player.store();
			bank.cardsContainer.removeAllChildren();
			player.cardsContainer.removeAllChildren();
			this.message.text.text = messages.bet;
		},

		new: function(){
			bank.cardsContainer.x = player.cardsContainer.x = 450;
			this.distributeCard('player');
			setTimeout(function(){
				game.distributeCard('player');
				setTimeout(function(){
					game.distributeCard('bank');
					setTimeout(function(){
						game.distributeCard('bank', true);
					}, 750);
				}, 750);
			}, 750);
		},

		buildDeck: function(){
			for(let i=0; i<deckNumber; i++){
				for(var suit of suits){
					for(let i=2; i<11; i++)
						this.deck.push(new Card(suit, i));

					for(let v of ['J', 'Q', 'K', 'A'])
						this.deck.push(new Card(suit, v));
				}
			}
		},

		deckValue: function(deck){
			var total = 0;

			deck.forEach(function(card){
				if(card.value >= 2 && card.value < 11)
					total += card.value;
				if(['J', 'Q', 'K'].includes(card.value))
					total += 10;
				if(card.value === 'A')
					total += 11;
			});

			return total;
		},

		distributeCard: function(to, hidden = false){
			var index = rand(0, this.deck.length - 1);
			var card = this.deck[index];
			if(hidden) card.hidden = true;

			if(to === 'bank')
				bank.deck.push(card);
			else if(to === 'player')
				player.deck.push(card);

			this.deck.splice(index, 1);
			this.displayCard(card, to);
		},

		displayCard: function(card, owner){
			if(!bank.cardsContainer){
				bank.cardsContainer = new createjs.Container();
				bank.cardsContainer.y = -100;
				stage.addChild(bank.cardsContainer);
				bank.cardsContainer.x = 450;
			}
			if(!player.cardsContainer){
				player.cardsContainer = new createjs.Container();
				player.cardsContainer.y = 300;
				stage.addChild(player.cardsContainer);
				player.cardsContainer.x = 450;
			}

			createjs.Sound.play('card');
			var card = new createjs.Bitmap(card.hidden ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value));

			if(owner === 'bank'){
				card.x = 0;
				card.y = -100;
				bank.cardsContainer.addChild(card);
				createjs.Tween.get(card)
					.to({x: 50 * bank.deck.length, y: 100}, 750, createjs.Ease.getPowInOut(1));
				bank.cardsContainer.x -= 20;
			}
			else if(owner === 'player'){
				card.x = 100;
				card.y = -400;
				player.cardsContainer.addChild(card);
				createjs.Tween.get(card)
					.to({x: 50 * player.deck.length, y: 100}, 750, createjs.Ease.getPowInOut(1));
				player.cardsContainer.x -= 20;
				if(this.deckValue(player.deck) > 21)
					player.lose();
			}

		},

		addButtons: function(){
			this.buttonContainer = new createjs.Container();
			this.buttonContainer.x = -70;
			this.buttonContainer.y = 500;
			stage.addChild(this.buttonContainer);

			this.buttons.forEach(function(b){
				var button = new createjs.Text(b.text, '30px Arial', b.color);
				button.x = b.x;
				button.y = b.y;
				var hit = new createjs.Shape();
				hit.graphics.beginFill('#000').drawRect(0, 0, button.getMeasuredWidth(), button.getMeasuredHeight());
				button.hitArea = hit;
				button.alpha = 0.7;
				button.on('mouseover', function(event){
					button.alpha = 1;
					button.cursor = 'Pointer';
				});
				button.on('mouseout', event => button.alpha = 0.7);
				button.addEventListener('click', b.onclick);
				game.buttonContainer.addChild(button);
			});
		},

		addChips: function(){
			if(!player.chipsContainer){
				player.chipsContainer = new createjs.Container();
				player.chipsContainer.x = 600;
				player.chipsContainer.y = 500;

				game.dealtChipContainer = new createjs.Container();
				stage.addChild(player.chipsContainer, game.dealtChipContainer);
			}
			else
				player.chipsContainer.removeAllChildren();

			var base = {x: 100, y: 45};
			for(var chip in player.chips){
				for(let i=0; i<player.chips[chip]; i++){
					var chipImg = new createjs.Bitmap(imgs.chips.get(chip, 'side'));
					chipImg.x = base.x;
					chipImg.y = base.y;
					chipImg.color = chip;
					chipImg.dealt = false;
					//chipImg.shadow = new createjs.Shadow("#000000", 3, 3, 5); //too laggy :/
					player.chipsContainer.addChild(chipImg);
					base.y -= 10;
					if(i === player.chips[chip] - 1){ //add click event on top chip
						chipImg.cursor = 'Pointer';
						chipImg.on('mouseover', function(event){
							event.currentTarget.scaleX = 1.1;
							event.currentTarget.scaleY = 1.1;
							event.currentTarget.y -= 8;
						});
						chipImg.on('mouseout', function(event){
							event.currentTarget.scaleX = 1;
							event.currentTarget.scaleY = 1;
							event.currentTarget.y += 8;
						});
						chipImg.addEventListener('click', event => game.throwChip(event.currentTarget));
					}
				}
				base.y = 45;
				base.x += 75;
			}
		},

		throwChip: function(chip){
			if(chip.dealt || game.inProgress) return;
			chip.dealt = true;
			//remove chip from player.chipsContainer and add it to another container
			createjs.Sound.play('chip');
			player.chipsContainer.removeChildAt(player.chipsContainer.getChildIndex(chip));
			chip.x = chip.x + player.chipsContainer.x;
			chip.y = chip.y + player.chipsContainer.y;
			game.dealtChipContainer.addChild(chip);
			createjs.Tween.get(chip)
				.to({x: rand(350, 675) , y: rand(190, 350)}, 750, createjs.Ease.getPowInOut(1));
			var color = chip.color;
			player.dealt += this.chipsValue[color]; //add chip value to player.dealt
			player.chips[color] -= 1; //Reduce player chips number
			player.funds -= game.chipsValue[color];
			player.fundsText.update();
			game.dealt[color] += 1;
			this.addChips();
		},

		check: function(){
			var bankScore = this.deckValue(bank.deck);
			var playerScore = this.deckValue(player.deck);

			if(bankScore === 21 && bank.deck.length === 2)
				bank.blackjack = true;
			if(playerScore === 21 && player.deck.length === 2)
				player.blackjack = true;

			if(bank.blackjack && player.blackjack)
				return player.draw();
			else if(bank.blackjack)
				return player.lose();
			else if(player.blackjack)
				return player.win();

			if(bankScore > 21)
				player.win();
			else if(bankScore >= 17 && bankScore <= 21){
				if(playerScore > bankScore)
					player.win();
				else
					player.lose();
			}
		}

	};

	var bank = {

		deck: [],
		cardsContainer: false,
		blackJack: false,

		play: function(){
			if(player.doubled && player.deck.length > 2)
				player.cardsContainer.children[2].image.src = imgs.cards.get(player.deck[2].suit, player.deck[2].value);

			if(this.deck.length === 2)
				this.cardsContainer.children[1].image.src = imgs.cards.get(this.deck[1].suit, this.deck[1].value);

			var total = game.deckValue(this.deck);
			if(total < 17){
				game.distributeCard('bank');
				if(game.deckValue(this.deck) < 17)
					setTimeout(() => bank.play(), 1000);
				else
					game.check();
			}
			else
				game.check();
		},

	};

	var player = {

		deck: [],
		name: {
			value: 'Player 1',
			text: false,
		},
		cardsContainer: false,
		chipsContainer: false,
		blackjack: false,
		insurance: false,
		doubled: false,
		funds: 1000,
		fundsText: {
			text: false,
			init: function(){
				this.text = new createjs.Text(player.funds, '30px Arial', '#fff');
				this.text.x = 880;
				this.text.y = 590;
				stage.addChild(this.text);
			},
			update: function(){
				this.text.text = player.funds;
			}
		},
		betted: false,
		dealt: 0,
		chips: game.balanceChips(1000),

		hit: function(){
			if(this.betted){
				if(this.doubled && this.deck.length !== 2)
					return game._alert(messages.warning.hit);
				else if(this.doubled)
					return game.distributeCard('player', true);
				game.distributeCard('player');
			}
			else
				game._alert(messages.warning.bet);
		},

		stand: function(){
			if(!this.betted)
				return game._alert(messages.warning.bet);
			game.inProgress = true;
			bank.play();
		},

		insure: function(){
			if(game.inProgress && bank.deck.length === 2 && bank.deck[0].value === 'A'){
				this.insurance = Math.round(this.dealt / 2);
				this.funds -= this.insurance;
				this.chips = game.balanceChips(this.funds);
				this.fundsText.update();
				game._alert(messages.warning.insured);
			}
			else
				game._alert(messages.warning.insurance);
		},

		double: function(){
			if(game.inProgress && this.deck.length === 2 && !this.doubled){
				if(this.funds >= this.dealt){
					game._alert(messages.warning.doubled);
					this.doubled = true;
					this.funds -= this.dealt;
					this.dealt *= 2;
					this.chips = game.balanceChips(this.funds);
					this.store();
					game.addChips();
					for(var chip in game.dealt){
						//update graphic dealtcontainer
						for(let i=0; i<game.dealt[chip]; i++){
							var chipImg = new createjs.Bitmap(imgs.chips.get(chip, 'side'));
							chipImg.x = rand(350, 675);
							chipImg.y = rand(190, 350);
							chipImg.color = chip;
							chipImg.dealt = true;
							game.dealtChipContainer.addChild(chipImg);
						}
					}
					for(var chip in game.dealt)
						if(game.dealt[chip])
							game.dealt[chip] *= 2;
					player.fundsText.update();
				}
				else
					game._alert(messages.warning.funds);
			}
			else
				game._alert(messages.warning.double);
		},

		giveUp: function(){
			if(game.inProgress && this.deck.length === 2 && bank.deck.length === 2){
				game._alert(messages.warning.gaveUp);
				this.funds += Math.round(this.dealt / 2);
				this.chips = game.balanceChips(this.funds);
				this.fundsText.update();
				player.store();
				game.addChips();
				game.end();
			}
			else
				game._alert(messages.warning.giveUp);
		},

		win: function(){
			game.message.text.text = messages.win;
			setTimeout(function(){
				createjs.Sound.play('win');
				player.funds += player.blackjack ? player.dealt * 3 : player.dealt * 2;
				game.end();
				player.fundsText.update();
			}, 2000);
		},

		lose: function(){
			game.message.text.text = messages.lose;
			if(this.doubled && this.deck.length === 3)
				this.cardsContainer.children[2].image.src = imgs.cards.get(this.deck[2].suit, this.deck[2].value);
			setTimeout(function(){
				createjs.Sound.play('lose');
				if(bank.blackjack && player.insurance){
					player.funds += player.insurance * 2;
					player.chips = game.balanceChips(player.funds);
					player.fundsText.update();
				}
				if(player.funds <= 0)
					return game.over();
				game.end();
			}, 2000);
		},

		draw: function(){
			game.message.text.text = messages.draw;
			setTimeout(function(){
				if(bank.blackjack && player.insurance){
					player.funds += player.insurance * 2;
					player.chips = game.balanceChips(player.funds);
					player.fundsText.update();
				}
				game.end();
				player.funds += player.dealt;
				player.fundsText.update();
			}, 2000);
		},

		store: function(){
			localStorage.setItem('BlackJackJs-funds', this.funds);
			localStorage.setItem('BlackJackJs-chips', JSON.stringify(this.chips));
		},

	};

	function tick(){
		stage.update();
	}

	game.startScreen();

}
