// Selecting the dice element and the roll button from the DOM
const dice = document.querySelector('.dice');
const rollBtn = document.querySelector('.roll');

// Function to generate a random dice number between 1 and 6
const randomDice = () => {
    const random = Math.floor(Math.random() * 10);

    if (random >= 1 && random <= 6) {
        rollDice(random);
    } else {
        randomDice();
    }
}

// Function to animate the dice roll and set the final face based on the random number
const rollDice = random => {
    dice.style.animation = 'rolling 4s'; // Apply rolling animation

    setTimeout(() => {
        // Set the dice face based on the random number
        switch (random) {
            case 1:
                dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
                break;

            case 6:
                dice.style.transform = 'rotateX(180deg) rotateY(0deg)';
                break;

            case 2:
                dice.style.transform = 'rotateX(-90deg) rotateY(0deg)';
                break;

            case 5:
                dice.style.transform = 'rotateX(90deg) rotateY(0deg)';
                break;

            case 3:
                dice.style.transform = 'rotateX(0deg) rotateY(90deg)';
                break;

            case 4:
                dice.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                break;

            default:
                break;
        }

        dice.style.animation = 'none'; // Reset animation

    }, 4050); // Delay to match animation duration
}

// Event listener to trigger the dice roll on button click
rollBtn.addEventListener('click', randomDice);
