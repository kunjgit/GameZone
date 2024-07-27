const cards = 
	document.getElementsByClassName('card'); 
let allImages = document.getElementsByClassName('card-image'); 
let movesDisplay = document.querySelector('.move-counter'); 
let toggledCardsArray = []; 
let move = 0; 
let winCount = 0; 
const restart = document.getElementById('restart'); 

const imagesLinkArray = [ 
	{ 
		id: 1, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102833/AngularImage.png', 
		newAlt: 'Angular Image'
	}, 
	{ 
		id: 2, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102835/html5Image.png', 
		newAlt: 'HTML Image'
	}, 
	{ 
		id: 3, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102834/JSImage.jpg', 
		newAlt: 'JavaScript Image'
	}, 
	{ 
		id: 4, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102833/reactImage.png', 
		newAlt: 'React Image'
	}, 
	{ 
		id: 5, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102833/vueImage.png', 
		newAlt: 'Vue Image'
	}, 
	{ 
		id: 6, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102834/JSImage.jpg', 
		newAlt: 'JavaScript Image'
	}, 
	{ 
		id: 7, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102833/vueImage.png', 
		newAlt: 'Vue Image'
	}, 
	{ 
		id: 8, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102835/html5Image.png', 
		newAlt: 'HTML Image'
	}, 
	{ 
		id: 9, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102834/CSS3Image.png', 
		newAlt: 'CSS Image'
	}, 
	{ 
		id: 10, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102833/AngularImage.png', 
		newAlt: 'Angular Image'
	}, 
	{ 
		id: 11, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102834/CSS3Image.png', 
		newAlt: 'CSS Image'
	}, 
	{ 
		id: 12, 
		image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20231122102833/reactImage.png', 
		newAlt: 'React Image'
	} 
] 

// function to restart the game 
const restartGame = () => { 
	let toggledCard = 
		document.getElementsByClassName('card toggled'); 
	imagesLinkArray.sort(() => Math.random() - 0.5); 
	Object.values(toggledCard).forEach(function (el) { 
		setTimeout(() => { 
			el.classList.remove("toggled"); 
		}, 0); 
	}) 
	toggledCardsArray.length = 0; 
	move = 0; 
	winCount=0; 
	movesDisplay.innerText = `Moves: ${move}`; 
	let allImagesSrc = document.getElementsByClassName('card-image'); 
	Object.values(allImagesSrc).forEach((el, index)=>{ 
		el.src = imagesLinkArray[index].image; 
		el.alt = imagesLinkArray[index].newAlt; 
		el.id = imagesLinkArray[index].id 
	}) 
} 
restart.addEventListener('click', restartGame); 

//checking for the last clicked and current 
//clicked cards and applying changes accordingly 
for (var i = 0; i < cards.length; i++) { 
	cards[i].addEventListener('click', function () { 
		this.classList.add("toggled"); 
		toggledCardsArray.push(this); 
		let thisImgSrc = this.querySelector('.card-image').src; 
		let previousImgSrc = 
		toggledCardsArray[toggledCardsArray.length - 2].querySelector('.card-image').src; 
		if(thisImgSrc !== previousImgSrc) { 
			toggledCardsArray.forEach(function (el) { 
				setTimeout(() => { 
					el.classList.remove("toggled"); 
				}, 500); 
			}) 
			toggledCardsArray.length = 0; 
			move++; 
		} 
		else{ 
			toggledCardsArray.length = 0; 
			move++; 
			winCount++; 
		} 
		movesDisplay.innerText = `Moves: ${move}`; 
		if(winCount===6){ 
			setTimeout(()=>{ 
				alert(`Congratulations!!! You won the game in ${move} moves.`) 
			}, 300) 
		} 
	}) 
}
document.addEventListener('DOMContentLoaded', function () {
  var beepSound = new Audio('beep-07a.wav'); 

  var cards = document.querySelectorAll('.card');

  cards.forEach(function(card) {
      card.addEventListener('click', function () {
          beepSound.play();
      });
  });
});
