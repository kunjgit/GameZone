var config = {
    numberPlayer : 1,
    playerAI: [false, false, false, false],
    playerName: ['Player 1', 'Player 2', 'Player 3', 'Player 4']
}

function reset() {
    localStorage.removeItem('config');
}

function changePlayer(number){
    const number1 = document.querySelector('.number1');
    const number2 = document.querySelector('.number2');
    const number3 = document.querySelector('.number3');
    const number4 = document.querySelector('.number4');
    const player2 = document.querySelector('.player2');
    const player3 = document.querySelector('.player3');
    const player4 = document.querySelector('.player4');
    const player2name = document.querySelector('.player2name');
    const player3name = document.querySelector('.player3name');
    const player4name = document.querySelector('.player4name');
    switch(number){
        case 1:
            number1.classList.add('selected');
            number2.classList.remove('selected');
            number3.classList.remove('selected');
            number4.classList.remove('selected');
            player2.classList.remove('display');
            player3.classList.remove('display');
            player4.classList.remove('display');
            player2name.value = "";
            player3name.value = "";
            player4name.value = "";
            break;
        case 2:
            number1.classList.remove('selected');
            number2.classList.add('selected');
            number3.classList.remove('selected');
            number4.classList.remove('selected');
            player2.classList.add('display');
            player3.classList.remove('display');
            player4.classList.remove('display');
            player3name.value = "";
            player4name.value = "";
            break;
        case 3:
            number1.classList.remove('selected');
            number2.classList.remove('selected');
            number3.classList.add('selected');
            number4.classList.remove('selected');
            player2.classList.add('display');
            player3.classList.add('display');
            player4.classList.remove('display');
            player4name.value = "";
            break;
        case 4:
            number1.classList.remove('selected');
            number2.classList.remove('selected');
            number3.classList.remove('selected');
            number4.classList.add('selected');
            player2.classList.add('display');
            player3.classList.add('display');
            player4.classList.add('display');
            break;
        default:
            break;
    }
}

function start() {
    const number1 = document.querySelector('.number1').classList.contains('selected');
    const number2 = document.querySelector('.number2').classList.contains('selected');
    const number3 = document.querySelector('.number3').classList.contains('selected');

    for (let index = 1; index < 5; index++) {
        const name = document.querySelector(`.player${index}name`).value;
        if(name !== ""){
            config.playerName[index - 1] = name;
        }
        
    }

    if(number1) {
        config.playerAI[1] = true;
    } else if(number2) {
        config.numberPlayer = 2;
    } else if(number3){
        config.numberPlayer = 3;
    } else {
        config.numberPlayer = 4;
    }

    localStorage.setItem('config', JSON.stringify(config));

    if(number1) {
        window.location.href = "./ludo/index.html";
    } else if(number2) {
        window.location.href = "./ludo/index.html";
    } else if(number3){
        window.location.href = "./ludo/index2.html";
    } else {
        window.location.href = "./ludo/index3.html";
    }
}

let timer;

document.addEventListener('input', e => {
  const el = e.target;
  if( el.matches('[data-color]') ) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.documentElement.style.setProperty(`--color-${el.dataset.color}`, el.value);
    }, 100)
  }
})