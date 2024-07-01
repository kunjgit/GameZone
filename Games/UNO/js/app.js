console.log('uno!')

//#region  // DOM AND GLOBAL VARIABLES
const cpuHandDom = document.querySelector('.cpu-hand')
const playerHandDom = document.querySelector('.player-hand')

const cpuScoreDom = document.querySelector('#cpu-score')
const playerScoreDom = document.querySelector('#player-score')

const playPileDom = document.querySelector('.play-pile')
const drawPileDom = document.querySelector('.draw-pile')

const playerUno = document.querySelector('.player-animation')
const cpuUno = document.querySelector('.cpu-animation')

// hand arrays
const cpuHand = []
const playerHand = []

const deck = []
let playPile
let cpuScore = 0
let playerScore = 0

// variables to control gameplay
let playerTurn = true
let gameOn = true
let colorPickerIsOpen = false
let cpuDelay = Math.floor((Math.random() * cpuHand.length * 200) + 1500)
let gameOver = 100
//#endregion

//#region preload imgs for faster loading
const imgPreLoad = []
let preLoaded = false

const preLoadImgs = () => {
    for (let i = 0; i <= 3; i++) {
        let color
        if (i === 0) color = 'red'
        if (i === 1) color = 'green'
        if (i === 2) color = 'blue'
        if (i === 3) color = 'yellow'
        for (let n = 0; n <= 14; n++) {
            let img = new Image()
            img.src = 'images/' + color + i + '.png'
            imgPreLoad.push(img)
        }
    }

    for (let i = 0; i < imgPreLoad.length; i++) {
        playPileDom.appendChild(imgPreLoad[i])
        playPileDom.innerHTML = ''
    }
}
//#endregion

// #region AUDIO
const shuffleFX = new Audio('audio/shuffle.wav')
const playCardFX = new Audio('audio/playCardNew.wav')
const playCardFX2 = new Audio('audio/playCard2.wav')
const drawCardFX = new Audio('audio/drawCard.wav')
const winRoundFX = new Audio('audio/winRound.wav')
const winGameFX = new Audio('audio/winGame.wav')
const loseFX = new Audio('audio/lose.wav')
const plusCardFX = new Audio('audio/plusCard.wav')
const unoFX = new Audio('audio/uno.wav')
const colorButton = new Audio('audio/colorButton.wav')
const playAgain = new Audio('audio/playAgain.wav')

const pickPlayCardSound = () => {
    // const random = Math.random() * 10

    // if (random > 6) playCardFX.play()
    // else playCardFX2.play()

    playCardFX2.play()
}
//#endregion

// #region CARD AND DECK MANAGEMENT
class Card {
    constructor(rgb, value, points, changeTurn, drawValue, imgSrc) {
        this.color = rgb
        this.value = value
        this.points = points
        this.changeTurn = changeTurn
        this.drawValue = drawValue
        this.src = imgSrc
        this.playedByPlayer = false
    }
}

const createCard = (rgb, color) => {
    for (let i = 0; i <= 14; i++) {
        // number cards
        if (i === 0) {
            deck.push(new Card(rgb, i, i, true, 0, 'images/' + color + i + '.png'))
        }
        else if (i > 0 && i <= 9) {
            deck.push(new Card(rgb, i, i, true, 0, 'images/' + color + i + '.png'))
            deck.push(new Card(rgb, i, i, true, 0, 'images/' + color + i + '.png'))
        }
        // reverse/skip
        else if (i === 10 || i === 11) {
            deck.push(new Card(rgb, i, 20, false, 0, 'images/' + color + i + '.png'))
            deck.push(new Card(rgb, i, 20, false, 0, 'images/' + color + i + '.png'))
        }
        // draw 2
        else if (i === 12) {
            deck.push(new Card(rgb, i, 20, false, 2, 'images/' + color + i + '.png'))
            deck.push(new Card(rgb, i, 20, false, 2, 'images/' + color + i + '.png'))
        }
        else if (i === 13) {
            deck.push(new Card('any', i, 50, true, 0, 'images/wild' + i + '.png'))
        }
        else {
            deck.push(new Card('any', i, 50, false, 4, 'images/wild' + i + '.png'))
        }
    }
}

const createDeck = () => {
    // destroy previous deck
    deck.length = 0
    // create new deck
    for (let i = 0; i <= 3; i++){
        if (i === 0) {
            createCard('rgb(255, 6, 0)', 'red')
        }
        else if (i === 1) {
            createCard('rgb(0, 170, 69)', 'green')
        }
        else if (i === 2) {
            createCard('rgb(0, 150, 224)', 'blue')
        }
        else {
            createCard('rgb(255, 222, 0)', 'yellow')
        }
    }

    console.log(deck) // TODO: remove
}

const shuffleDeck = (deck) => {
    // Fisher-Yates Method - https://www.frankmitchell.org/2015/01/fisher-yates/
    console.log('shuffling', deck)  // TODO: remove
    
    for (let i = deck.length - 1; i > 0; i--) {
        deck[i].playedByPlayer = false
        let j = Math.floor(Math.random() * (i + 1))
        let temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
    console.log(deck, 'shuffled') // TODO: remove
    shuffleFX.play()
}
//#endregion

// #region GAME BEHAVIOURS
const dealCards = () => {
    for (let i = 0; i < 7; i++) {
        // deal cards into cpu/player arrays
        cpuHand.push(deck.shift())       
        playerHand.push(deck.shift())

        // put cards on the DOM
        const cpuCard = document.createElement('img')
        cpuCard.setAttribute('src', 'images/back.png')
        cpuCard.setAttribute('class', 'cpu')
        cpuHandDom.appendChild(cpuCard)

        const playerCard = document.createElement('img')
        playerCard.setAttribute('src', playerHand[i].src)
        playerCard.setAttribute('class', 'player')
        
        // assign cards an id = their index in the playerHand array 
        //in order to reference the correct card object
        playerCard.setAttribute('id', i)
        playerHandDom.appendChild(playerCard)
    }
}

const startPlayPile = () => {
    const playCard = document.createElement('img')
    
    // find first card that isn't an action card
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].color !== "any" && deck[i].value <= 9) {
            // begin playPile array with first valid card
            playPile = deck.splice(i, 1)
            break
        }
    }

    // set playCard to correct image
    playCard.setAttribute('src', playPile[0].src)
    // play card to the playPile
    playPileDom.appendChild(playCard)
}

const newHand = () => {
    console.log('new hand')
    gameOn = true
    // clear hands and play pile
    cpuHandDom.innerHTML = ''
    cpuHand.length = 0
    playerHandDom.innerHTML = ''
    playerHand.length = 0
    playPileDom.innerHTML = ''

    // create new deck
    createDeck()
    // shuffle deck
    shuffleDeck(deck)
    // deal cards and first play card
    dealCards()
    // set down first play card that isn't an action card
    startPlayPile()

    if (colorPickerIsOpen) hideColorPicker()
}

const updatePlayPileDom = () => {
    playPileDom.innerHTML = ''

    // add played card to playPile
    const newCardImg = document.createElement('img')
    const imgSrc = playPile[playPile.length - 1].src
    newCardImg.setAttribute('src', imgSrc)
    playPileDom.appendChild(newCardImg)
}

const updateHand = (handToUpdate) => {
    let domToUpdate, cardClass;

    if (handToUpdate === cpuHand) {
        domToUpdate = cpuHandDom
        cardClass = 'cpu'
        if (cpuVisible) cpuVisible = false
    }
    else {
        domToUpdate = playerHandDom
        cardClass = 'player'
    }
    
    // clear the selected dom
    domToUpdate.innerHTML = ''

    // update dom
    for (let i = 0; i < handToUpdate.length; i++) {
        let src

        if (domToUpdate === cpuHandDom) {
            src = 'images/back.png'
        } 
        else {
            src = handToUpdate[i].src
        } 

        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', src)
        updatedCard.setAttribute('class', cardClass)
        // update ID's to match playerHand indexes
        updatedCard.setAttribute('id', i)
        domToUpdate.appendChild(updatedCard)
    }

    // keep dom element from collapsing when hand is empty
    if (handToUpdate.length === 0) {
        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', 'images/empty.png')
        updatedCard.setAttribute('class', 'empty')
        // update ID's to match playerHand indexes
        domToUpdate.appendChild(updatedCard)
    }
}

const drawCard = (handGetsCard) => {
    animateDrawCard(handGetsCard)
    // check if the deck has card to draw
    if (deck.length > 0) {
        // pull the top card
        const newCard = deck.shift()
        handGetsCard.push(newCard)
        console.log(handGetsCard, 'drew one card') // TODO: remove
        
    }
    else {
        // shuffle playPile
        shuffleDeck(playPile)
        for (let i = 0; i <= playPile.length - 1; i++) {
            // shuffled playPile becomes the new deck
            deck.push(playPile[i])
        }
        // leave the last played card on the playPile
        playPile.length = 1

        // pull the top card from the deck
        const newCard = deck.shift()
        handGetsCard.push(newCard)
        console.log(handGetsCard, 'drew one card') // TODO: remove
        
    }
    drawCardFX.play()
    setTimeout(() => {
        updateHand(handGetsCard)
    }, 500)
}

const animateDrawCard = (player) => {
    let playerClass
    if (player === cpuHand) playerClass = 'cpu-draw'
    else playerClass = 'player-draw'
    
    const drawCardEl = document.querySelector('#draw-card')
    drawCardEl.classList.remove('hidden')
    setTimeout(() => {
        drawCardEl.classList.add(playerClass)
        setTimeout(() => {
            drawCardEl.classList.add('hidden')
            drawCardEl.classList.remove(playerClass)
            clearInterval()
        }, 500)
    }, 30)
}

const showUno = (unoHand) => {
    // remove hidden class from player-uno div
    unoHand.classList.remove('hidden')
    unoFX.play()
    console.log('removed HIDDEN from', unoHand)

    // add shout class
    setTimeout(() => {
        unoHand.classList.add('shout')
        console.log('added SHOUT to', unoHand)
        //setTimeout = after x seconds remove shout
        setTimeout(() => {
            unoHand.classList.remove('shout')
            console.log('removed SHOUT from', unoHand)

            setTimeout(() => {
                unoHand.classList.add('hidden')
                console.log('added HIDDEN to', unoHand)
            }, 1000)
        }, 1000)
    }, 10) 
}

const showColorPicker = () => {
    // show the color picker
    const colorPicker = document.querySelector('.color-picker')
    colorPicker.style.opacity = 1
    colorPickerIsOpen = true

    //assign eventHandler's to buttons
    document.querySelector('.red').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(255, 6, 0)')
    })
    document.querySelector('.green').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(0, 170, 69)')
    })
    document.querySelector('.blue').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(0, 150, 224)')
    })
    document.querySelector('.yellow').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(255, 222, 0)')
    })
}

const chooseColor = (rgb) => {
    //assign the color to the wild on top of the play pile
    colorButton.play()
    playPile[playPile.length - 1].color = rgb

    // hide the color picker
    hideColorPicker()
    playerTurn = false;
    setTimeout(playCPU, cpuDelay)}

function hideColorPicker() {
    const colorPicker = document.querySelector('.color-picker')
    colorPicker.style.opacity = 0
    colorPickerIsOpen = false
}

const skipOrEndTurn = () => {
    // check if changeTurn or skip
    if (playPile[playPile.length - 1].changeTurn) {
        playerTurn = false

        // cpu's turn
        setTimeout(playCPU, cpuDelay)
    }
}

// update player names with whose turn it is
const showTurnOnDom = () => {
    if (playerTurn) {
        document.querySelector('.player-score-title').style.color = 'rgb(100, 150, 150)'
        document.querySelector('.cpu-score-title').style.color = 'rgb(6, 37, 62)'
    }
    else {
        document.querySelector('.player-score-title').style.color = 'rgb(6, 37, 62)'
        document.querySelector('.cpu-score-title').style.color = 'rgb(100, 150, 150)'
    }
}
//#endregion

//#region END OF ROUND/GAME FUNCTIONS
const tallyPoints = (loserHand) => {
    let points = 0

    for (const card of loserHand) {
        points += card.points
    }

    if (loserHand == cpuHand) {
        cpuScore += points
    }
    else {
        playerScore += points
    }
}

const updateScores = () => {
    // update cpuScoreDom
    cpuScoreDom.innerHTML = cpuScore
    if (cpuScore < gameOver / 2) cpuScoreDom.style.color = 'rgb(0, 140, 0)'
    else cpuScoreDom.style.color = 'rgb(121, 2, 2)'

    // update playerScoreDom
    playerScoreDom.innerHTML = playerScore
    if (playerScore < gameOver / 2) playerScoreDom.style.color = 'rgb(0, 140, 0)'
    else playerScoreDom.style.color = 'rgb(121, 2, 2)'
}

const checkForWinner = () => {
    // check if that no one has lost
    if (playerScore < gameOver && cpuScore < gameOver) {
        // next round
        if (playerHand.length === 0) {
            winRoundFX.play()
            endRound(playerHand)
        }
        if (cpuHand.length === 0) {
            loseFX.play()
            endRound(cpuHand)
        }
    }
        
    else {
        // game over
        endGame()
    }
}

const showCpuCards = () => {
    if (cpuHand.length >= 1) {
        cpuHandDom.innerHTML = ''
        for (let i = 0; i < cpuHand.length; i++) {
    
            // turn the cards over
            const cpuCard = document.createElement('img')
            cpuCard.setAttribute('src', cpuHand[i].src)
            cpuCard.setAttribute('class', 'cpu')
            cpuHandDom.appendChild(cpuCard)
        }
    } 
}

const hideCpuCards = () => {
    if (cpuHand.length >= 1) {
        cpuHandDom.innerHTML = ''
        for (let i = 0; i < cpuHand.length; i++) {
    
            // turn the cards over
            const cpuCard = document.createElement('img')
            cpuCard.setAttribute('src', 'images/back.png')
            cpuCard.setAttribute('class', 'cpu')
            cpuHandDom.appendChild(cpuCard)
        }
    } 
}

const endRound = (winner) => {
    console.log('round over') // TODO: remove
    gameOn = false;
    playerTurn = !playerTurn

    if (cpuHand.length > 0) showCpuCards()
    
    const endOfroundDom = document.querySelector('.end-of-round')
    const roundDom = document.querySelector('.round')
    
    // show end of round element & format it based on who won
    endOfroundDom.classList.remove('hidden')
    if (winner === playerHand) roundDom.textContent = 'You won the round!'
    else roundDom.textContent = 'CPU won the round...'
    
    // hide end of round element after 2 seconds
    setTimeout(() => {
        endOfroundDom.classList.add('hidden')
        playerTurn = !playerTurn
        newHand()
        if (!playerTurn) setTimeout(playCPU, cpuDelay)
        
    }, 3000)
}

const endGame = () => {
    console.log('game over') // TODO: remove
    gameOn = false;
    if (cpuHand.length > 0) showCpuCards()

    const endOfGameDom = document.querySelector('.end-of-game')
    const gameDom = document.querySelector('.game')

    // show end of game element & format based on winner
    endOfGameDom.classList.remove('hidden')

    if (playerScore > gameOver) {
        loseFX.play()
        gameDom.textContent = 'CPU won the game... Play again?'
    }  
    else {
        winGameFX.play()
        gameDom.textContent = 'You won the game! Play again?'
    }

    // add event listener to 'play again' button
    document.querySelector('.play-again').addEventListener('click', () => {
        playAgain.play()
        // hide end of game element on click
        endOfGameDom.classList.add('hidden')
        playerScore = 0
        cpuScore = 0
        updateScores()
        playerTurn = !playerTurn
        newHand()
        if (!playerTurn) setTimeout(playCPU, cpuDelay)
    })
}
//#endregion

//#region ////////CPU LOGIC////////
const letCpuDrawCards = () => {
    if (playPile[playPile.length - 1].drawValue > 0) {
        // add however many cards based on drawValue of last played card
        for (let i = 0; i < playPile[playPile.length - 1].drawValue; i++) {
            drawCard(cpuHand)
        }
    }
}

const playCPU = () => {   
    if (!playerTurn && gameOn) {
        console.log('cpu beginning turn') // TODO: remove        
        
        // create temp array of playable cards based on last card played
        const playable = determinePlayableCards()

        // if no playable cards
        if (playable.length === 0) {
            console.log('CPU has no cards to play') // TODO: remove
            // draw card
            drawCard(cpuHand)
            // end turn
            setTimeout(() => {
                console.log('CPU ending turn') // TODO: remove
                playerTurn = true
                return
            }, 500)
        }
        //if one playable card
        else if (playable.length === 1) {
            // chosenCard = playable[0]
            setTimeout(playCPUCard, 300, playable[0])
            
            //playCPUCard(playable[0])
        }
        // if more than one playable cards
        else if (playable.length > 1) {
            console.log('cpu has', playable.length, 'playable cards')
            
            let chosenCard = runStrategist(playable)
            setTimeout(playCPUCard, 300, chosenCard)
            

            //playCPUCard(chosenCard)
        }
    }
//#region CPU SPECIFIC FUNCTIONS
    function determinePlayableCards() {
        const playableCards = []

        console.log('last card played:') // TODO: remove
        console.log(playPile[playPile.length - 1])
        for (let i = 0; i < cpuHand.length; i++) {
            if (cpuHand[i].color === playPile[playPile.length - 1].color || cpuHand[i].value === playPile[playPile.length - 1].value || cpuHand[i].color === 'any' || playPile[playPile.length - 1].color === 'any') {
                let validCard = cpuHand.splice(i, 1)
                playableCards.push(validCard[0])
            }
        }
        console.log('playable cards:')
        console.log(playableCards) // TODO: remove
        
        return playableCards
}
    
    function runStrategist(playable) {
        let cardIndex
            
        // run strategist to determine strategy
        let strategist = Math.random()
        console.log('strategist:', strategist) // TODO: remove
        // if strategist > 0.5 || playerHand <= 3
        if (playPile.length > 2 && (strategist > 0.7 || playerHand.length < 3 || cpuHand.length > (playerHand.length * 2) || (playPile[playPile.length - 1].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0) || (playPile[playPile.length - 2].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0))) {
            // prioritize action/high point cards
            console.log('cpu chose high card') // TODO: remove
            let highestValue = 0

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value > highestValue) {
                    highestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            // return playable to cpuHand
            returnPlayablesToHand()
    }
        else {
            // else prioritize color || number cards
            console.log('cpu chose low card') // TODO: remove
            let lowestValue = 14

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value < lowestValue) {
                    lowestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            returnPlayablesToHand()           
        }

        console.log(chosenCard[0])  // TODO: remove
        return chosenCard[0]

        function returnPlayablesToHand() {
            if (playable.length > 0) {
                for (const card of playable) {
                    cpuHand.push(card)
                }
            }
        }
    }

    function playCPUCard(chosenCard) {
        console.log('playing card:') // TODO: remove
        console.log(chosenCard)
        
        //animate random card from cpuHandDom
        const cpuDomCards = cpuHandDom.childNodes
        cpuDomCards[Math.floor(Math.random() * cpuDomCards.length)].classList.add('cpu-play-card')
        console.log('animating CPU card')
        pickPlayCardSound()
        // debugger
        
        setTimeout(() => {
            playPile.push(chosenCard)
            // update playPileDom
            updatePlayPileDom()

            // check if cpu played wild
            if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0 && playPile[playPile.length - 1].playedByPlayer === false) {
                console.log('cpu played a wild') // TODO: remove
                chooseColorAfterWild()
            }

            // check cpuHand length and update cpuHandDom
            if (cpuHand.length >= 1) {
                updateHand(cpuHand)
                if (cpuHand.length === 1) {
                    showUno(cpuUno)
                }
            }
            // if end of round
            else {
                // tallyPoints(playerHand)
                // updateScores()
                // checkForWinner()
                updateHand(cpuHand)
                setTimeout(() => {
                    tallyPoints(playerHand)
                    updateScores()
                    checkForWinner()
                }, 1200)
            }

            // if cpu played a draw card
            if (chosenCard.drawValue > 0) {
                // alert('cpu played a +' + chosenCard.drawValue + ' card!')
                console.log('cpu played a +' + chosenCard.drawValue + ' card!') // TODO: remove
                hitWithDrawCard()
                setTimeout(() => {
                    for (let i = 0; i < chosenCard.drawValue; i++) {
                        drawCard(playerHand)
                    }
                    checkChangeTurn()
                },1000)
            }
            // else checkChangeTurn()
            else setTimeout(checkChangeTurn, 500)
        }, 500)
        

        function checkChangeTurn() {
            if (chosenCard.changeTurn) {
                // if changeTurn, playerTurn = true
                console.log('cpu has finished its turn') // TODO: remove
                playerTurn = true
                return
            }
            else {
                // else cpuTurn() again
                console.log('cpu goes again') // TODO: remove
                setTimeout(playCPU, cpuDelay)
            }
        }
    }

    function chooseColorAfterWild() {
        console.log('cpu picking new color') // TODO: remove
        const colors = ['rgb(255, 6, 0)', 'rgb(0, 170, 69)', 'rgb(0, 150, 224)', 'rgb(255, 222, 0)']
        const colorsInHand = [0, 0, 0, 0]

        // cpu checks how many of each color it has
        for (const card of cpuHand) {
            if (card.color === colors[0]) colorsInHand[0]++
            if (card.color === colors[1]) colorsInHand[1]++
            if (card.color === colors[2]) colorsInHand[2]++
            if (card.color === colors[3]) colorsInHand[3]++
        }

        // find the index of the max value
        let indexOfMax = colorsInHand.indexOf(Math.max(...colorsInHand))

        // style the wild card and it's color
        const wildCardDom = playPileDom.childNodes[0]
        wildCardDom.style.border = '5px solid ' + colors[indexOfMax]
        wildCardDom.style.width = '105px'
        playPile[playPile.length - 1].color = colors[indexOfMax]
    }
    //#endregion
}

const hitWithDrawCard = () => {
    plusCardFX.play()
    playPileDom.classList.add('shout')
    setTimeout(() => {
        playPileDom.classList.remove('shout')
    }, 1000)
}
//#endregion

const playPlayerCard = (index) => {
    let cardToPlay = playerHand.splice(index, 1)
    cardToPlay[0].playedByPlayer = true
    playPile.push(cardToPlay[0])

    // clear the playPile
    updatePlayPileDom()
}

//#region ///////MAIN GAME FUNCTION////////
const startGame = () => {
    if (!preLoaded) {
        preLoadImgs()
        preLoaded = true
    } 

    playerScore = 0
    cpuScore = 0

    listenForDevMode()
    setInterval(showTurnOnDom, 100)
    newHand()
    updateScores()

    if (!playerTurn) setTimeout(playCPU, cpuDelay)


    // set event listeners on playerHandDom and drawPileDom
    // playerHandDom
    playerHandDom.addEventListener('click', (event) => {
        if (playerTurn && !colorPickerIsOpen && event.target.getAttribute('id')) {

            const lastCardDom = playPileDom.childNodes[0]
            if (lastCardDom.style !== '100px') {
                lastCardDom.style.width = '100px'
                lastCardDom.style.border = 'none'
            }

            // use target's ID to find card object in array
            let index = parseInt(event.target.getAttribute('id'))
            
            // if value or color matches topOfPlayPile OR color = 'any'
            if (playerHand[index].value === playPile[playPile.length - 1].value || playerHand[index].color === playPile[playPile.length - 1].color || playerHand[index].color === 'any' || playPile[playPile.length - 1].color === 'any') {     
                
                // animate clicked card
                pickPlayCardSound()
                event.target.classList.add('play-card')
                console.log('you played', event.target) // TODO: remove

                setTimeout(() => {
                    // set topOfPlayPile to target.src
                    //topOfPlayPile.length = 0
                    playPlayerCard(index)


                    // invoke cpuTurn to add cards if there are any to add
                    letCpuDrawCards()
                    
                    // check playerHand length and update DOM
                    if (playerHand.length >= 1) {
                        updateHand(playerHand)
                        if (playerHand.length === 1) showUno(playerUno)
                    }
                    else {
                        updateHand(playerHand)
                        setTimeout(() => {
                            tallyPoints(cpuHand)
                            updateScores()
                            checkForWinner()
                        }, 1200)
                    }

                    //check if wild
                    if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0 && playPile[playPile.length - 1].playedByPlayer) {
                        // set new color
                        showColorPicker()
                        return
                    }

                    skipOrEndTurn();
                }, 1000)
                
            }
        }
    })
    
    let areYouSure = false

    drawPileDom.addEventListener('click', () => {
        if (playerTurn && !colorPickerIsOpen) {
            drawCard(playerHand)
            // playerTurn = false;
            // setTimeout(playCPU, cpuDelay)
            setTimeout(() => {
                playerTurn = false;
                setTimeout(playCPU, cpuDelay)
            }, 500)
        }
    })
}
//#endregion
let cpuVisible = false

const listenForDevMode = () => {
    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase()
        console.log(key)
        if (key === 'p') {
            playerTurn = true;
            console.log('forced playerTurn', playerTurn)
        }

        if (key === 'c') {
            drawCard(cpuHand)
            updateHand(cpuHand)
        }

        if (key === 'x') {
            playerHand.pop()
            updateHand(playerHand)
        }

        if (key === 'z') {
            cpuHand.pop()
            updateHand(cpuHand)
        }

        if (key === 'w') {
            const wild = new Card('any', 13, 50, true, 0, 'images/wild13.png')
            playerHand.push(wild)
            updateHand(playerHand)
        }

        if (key === '4') {
            const wild4 = new Card('any', 14, 50, true, 4, 'images/wild14.png')
            playerHand.push(wild4)
            updateHand(playerHand)
        }

        if (key === '=') {
            playerScore += 10
            updateScores()
        }

        if (key === 's') {
            if (cpuVisible) {
                hideCpuCards()
                cpuVisible = false
            }
            else {
                showCpuCards()
                cpuVisible = true
            }
        }
    })
}

startGame()
