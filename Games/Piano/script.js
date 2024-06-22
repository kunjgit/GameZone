const pianoKeys = document.querySelectorAll('.key');

function playsound(newUrl) {
    new Audio(newUrl).play();
}

function addActiveClass(keyElement) {
    keyElement.classList.add('active');
    setTimeout(() => {
        keyElement.classList.remove('active');
    }, 200); // Adjust the duration as needed
}

// Click event logic
pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1);
    const newUrl = '24-piano-keys/key' + number + '.mp3';

    pianoKey.addEventListener('click', () => {
        playsound(newUrl);
        addActiveClass(pianoKey);
    });
});

// Keypress event logic
function handleKeyPress(evt) {
    switch(evt.key) {
        case "q":
            playsound("24-piano-keys/key01.mp3");
            addActiveClass(pianoKeys[0]);
            break;
        
        case "w":
            playsound("24-piano-keys/key02.mp3");
            addActiveClass(pianoKeys[1]);
            break;

        case "e":
            playsound("24-piano-keys/key03.mp3");
            addActiveClass(pianoKeys[2]);
            break;

        case "r":
            playsound("24-piano-keys/key04.mp3");
            addActiveClass(pianoKeys[3]);
            break;
        
        case "t":
            playsound("24-piano-keys/key05.mp3");
            addActiveClass(pianoKeys[4]);
            break;

        case "y":
            playsound("24-piano-keys/key06.mp3");
            addActiveClass(pianoKeys[5]);
            break;

        case "u":
            playsound("24-piano-keys/key07.mp3");
            addActiveClass(pianoKeys[6]);
            break;

        case "i":
            playsound("24-piano-keys/key08.mp3");
            addActiveClass(pianoKeys[7]);
            break;
        
        case "o":
            playsound("24-piano-keys/key09.mp3");
            addActiveClass(pianoKeys[8]);
            break;

        case "p":
            playsound("24-piano-keys/key10.mp3");
            addActiveClass(pianoKeys[9]);
            break;

        case "a":
            playsound("24-piano-keys/key11.mp3");
            addActiveClass(pianoKeys[10]);
            break;

        case "s":
            playsound("24-piano-keys/key12.mp3");
            addActiveClass(pianoKeys[11]);
            break;

        case "d":
            playsound("24-piano-keys/key13.mp3");
            addActiveClass(pianoKeys[12]);
            break;
        
        case "f":
            playsound("24-piano-keys/key14.mp3");
            addActiveClass(pianoKeys[13]);
            break;

        case "g":
            playsound("24-piano-keys/key15.mp3");
            addActiveClass(pianoKeys[14]);
            break;

        case "h":
            playsound("24-piano-keys/key16.mp3");
            addActiveClass(pianoKeys[15]);
            break;

        case "j":
            playsound("24-piano-keys/key17.mp3");
            addActiveClass(pianoKeys[16]);
            break;
        
        case "k":
            playsound("24-piano-keys/key18.mp3");
            addActiveClass(pianoKeys[17]);
            break;

        case "l":
            playsound("24-piano-keys/key19.mp3");
            addActiveClass(pianoKeys[18]);
            break;

        case "x":
            playsound("24-piano-keys/key20.mp3");
            addActiveClass(pianoKeys[19]);
            break;

        case "c":
            playsound("24-piano-keys/key21.mp3");
            addActiveClass(pianoKeys[20]);
            break;
        
        case "v":
            playsound("24-piano-keys/key22.mp3");
            addActiveClass(pianoKeys[21]);
            break;

        case "b":
            playsound("24-piano-keys/key23.mp3");
            addActiveClass(pianoKeys[22]);
            break;

        case "n":
            playsound("24-piano-keys/key24.mp3");
            addActiveClass(pianoKeys[23]);
            break;
        
        default:
    }
}
document.addEventListener('keypress', handleKeyPress)

