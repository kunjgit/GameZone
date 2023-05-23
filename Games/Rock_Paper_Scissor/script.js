//Challenge 3:Rock Paper Scissor
function rpsGame(yourChoice) {
  console.log(yourChoice)
  let humanChoice, botChoice

  humanChoice = yourChoice.id

  botChoice = numberToChoice(randTorpsInt())
  console.log('Computer choice: ', botChoice)

  results = decideWinner(humanChoice, botChoice)
  console.log(results)

  message = finalMessage(results) // ('message': 'You Won', 'color':'green')
  console.log(message)
  rpsFrontEnd(humanChoice, botChoice, message)
}

function randTorpsInt() {
  return Math.floor(Math.random() * 3)
}

function numberToChoice(number) {
  return ['rock', 'paper', 'scissors'][number]
}

function decideWinner(yourChoice, computerChoice) {
  var rpsDatabase = {
    rock: { scissors: 1, rock: 0.5, paper: 0 },
    paper: { rock: 1, paper: 0.5, scissors: 0 },
    scissors: { paper: 1, scissors: 0.5, rock: 0 },
  }

  let yourScore = rpsDatabase[yourChoice][computerChoice]
  let computerScore = rpsDatabase[computerChoice][yourChoice]

  return [yourScore, computerScore]
}

function finalMessage([yourScore, computerScore]) {
  if (yourScore === 0) {
    return { message: 'You lost!!', color: 'red' }
  } else if (yourScore === 0.5) {
    return { message: 'You tied', color: 'yellow' }
  } else if (yourScore === 1) {
    return { message: 'You Won', color: 'green' }
  }
}

function rpsFrontEnd(humanImageChoice, botImageChoice, finalMessage) {
  var imagesDatabase = {
    rock: document.getElementById('rock').src,
    paper: document.getElementById('paper').src,
    scissors: document.getElementById('scissors').src,
  }

  // lets remove all images
  document.getElementById('rock').remove()
  document.getElementById('paper').remove()
  document.getElementById('scissors').remove()

  var humanDiv = document.createElement('div')
  var botDiv = document.createElement('div')
  var messageDiv = document.createElement('div')

  humanDiv.innerHTML =
    "<img src='" +
    imagesDatabase[humanImageChoice] +
    "'; height=150 width=150 style='box-shadow: 0px 10px 50px rgb(37, 50, 233, 1);'>"
  messageDiv.innerHTML =
    "<h1 style='color:" +
    finalMessage['color'] +
    "; font-size:60px; padding:30px; '>" +
    finalMessage['message'] +
    '</h1>'
  botDiv.innerHTML =
    "<img src='" +
    imagesDatabase[botImageChoice] +
    "' height=150 width=150 style='box-shadow: 0px 10px 50px rgb(243, 38, 24,1);'>"

  document.getElementById('flex-box-rps-div').appendChild(humanDiv)
  document.getElementById('flex-box-rps-div').appendChild(messageDiv)
  document.getElementById('flex-box-rps-div').appendChild(botDiv)
}

function reload() {
  location.reload()
}
