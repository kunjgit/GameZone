const scoreDisplay = document.querySelector('#final-score'), 
      score = localStorage.getItem('finalScore'),
      scoreMessage = document.querySelector('#message')

scoreDisplay.textContent = score

if (score == 40){
   scoreMessage.innerHTML = 'Great. You got all correct!'
}

if (score < 40 && score > 29){
   scoreMessage.innerHTML = "Good job. You almost got it all."
}

if (score < 30 && score > 19){
   scoreMessage.innerHTML = "Nice game. You did alright."
}

if (score < 20 && score > 9){
   scoreMessage.innerHTML = "Fair try. You can always do better."
}

if (score == 0){
   scoreMessage.innerHTML = "Ouch, you got none correct."
}

if (score < 0){
   scoreMessage.innerHTML = "Uhm... What went wrong?"
}