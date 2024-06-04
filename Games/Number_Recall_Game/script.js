document.addEventListener('DOMContentLoaded', () => {
    const sequenceDiv = document.getElementById('pattern')
    const playerInput = document.getElementById('input')
    const submit = document.getElementById('submit')
    const start = document.getElementById('start')
    const restart = document.getElementById('restart')
    const message = document.getElementById('msg')
    const score = document.getElementById('score')

    let sequence = []
    let round = 0
    playerInput.disabled = true
    submit.disabled = true

    //generate a random number
    const generateNextNumber = () => {
        return Math.floor(Math.random() * 10);
    }

    const showSequence = () => {
        //it sets pattern to be the current sequence of numbers ( from array sequence )
        sequenceDiv.innerText = sequence.join(' ')

        //for round 1, sequenceDiv.innerText = '' will get executed after 1400ms, i.e, sequence is shown for 1400ms
        setTimeout(() => {
            sequenceDiv.innerText = '...'
        }, 1000 + 200 * round) //it ensures as the game progresses and round increases, the sequence is displayed for a longer period before it is hidden.
    }

    const startGame = () => {
        sequence = []
        round = 0
        currScore = 0
        score.innerHTML = 'Score is : ' + currScore
        message.innerText = ''
        playerInput.value = ''
        playerInput.disabled = false
        submit.disabled = false
        restart.style.display = 'block'
        start.style.display = 'none'
        nextRound()
    }

    //it will show next sequence of numbers
    const nextRound = () => {
        round++
        sequence.push(generateNextNumber())
        showSequence()
    }

    const checkSequence = () => {
        //converting input value to an array
        const playerSequence = playerInput.value.split('').map(Number)
        if (playerSequence.join('') === sequence.join('')) {
            // message.innerText = 'Correct!'
            currScore += 10
            score.innerHTML = 'Score is : ' + currScore
            playerInput.value = ''
            setTimeout(() => {
                message.innerText = ''
                nextRound();
            }, 1000);
        } else {
            message.innerText = 'Game Over!' + '\n' + 'The correct sequence was: ' + sequence.join('')
            playerInput.disabled = true
            submit.disabled = true
        }
    }

    submit.addEventListener('click', checkSequence)
    start.addEventListener('click', startGame)
    restart.addEventListener('click', startGame)
})