const pianoKeys = document.querySelectorAll('.key')

function playsound(newUrl) {
    new Audio(newUrl).play()
}

pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = '24-piano-keys/key' + number + '.mp3'

    pianoKey.addEventListener('click', () => playsound(newUrl))
})

// Keypress event logic
function handleKeyPress(evt){
    switch(evt.key){
        case "q":
            new Audio("24-piano-keys/key01.mp3").play();
            break;
        
        case "w":
            new Audio("24-piano-keys/key02.mp3").play();
            break;

        case "e":
            new Audio("24-piano-keys/key03.mp3").play();
            break;

        case "r":
            new Audio("24-piano-keys/key04.mp3").play();
            break;
        
        case "t":
            new Audio("24-piano-keys/key05.mp3").play();
            break;

        case "y":
            new Audio("24-piano-keys/key06.mp3").play();
            break;

        case "u":
            new Audio("24-piano-keys/key07.mp3").play();
            break;

        case "i":
            new Audio("24-piano-keys/key08.mp3").play();
            break;
        
        case "o":
            new Audio("24-piano-keys/key09.mp3").play();
            break;

        case "p":
            new Audio("24-piano-keys/key10.mp3").play();
            break;

        case "a":
            new Audio("24-piano-keys/key11.mp3").play();
            break;

        case "s":
            new Audio("24-piano-keys/key12.mp3").play();
            break;

        case "d":
            new Audio("24-piano-keys/key13.mp3").play();
            break;
        
        case "f":
            new Audio("24-piano-keys/key14.mp3").play();
            break;

        case "g":
            new Audio("24-piano-keys/key15.mp3").play();
            break;

        case "h":
            new Audio("24-piano-keys/key16.mp3").play();
            break;

        case "j":
            new Audio("24-piano-keys/key17.mp3").play();
            break;
        
        case "k":
            new Audio("24-piano-keys/key18.mp3").play();
            break;

        case "l":
            new Audio("24-piano-keys/key19.mp3").play();
            break;

        case "x":
            new Audio("24-piano-keys/key20.mp3").play();
            break;

        case "c":
            new Audio("24-piano-keys/key21.mp3").play();
            break;
        
        case "v":
            new Audio("24-piano-keys/key22.mp3").play();
            break;

        case "b":
            new Audio("24-piano-keys/key23.mp3").play();
            break;

        case "n":
            new Audio("24-piano-keys/key24.mp3").play();
            break;
        
        default:
    }
}

document.addEventListener('keypress', handleKeyPress)