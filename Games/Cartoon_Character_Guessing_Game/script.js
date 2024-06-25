const data = [
    {
        "id": 1,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Mickey_Mouse_%28poster_version%29.svg/800px-Mickey_Mouse_%28poster_version%29.svg.png",
        "character_name": "Mickey Mouse"
    },
    {
        "id": 2,
        "image_url": "https://th.bing.com/th/id/OIP.ggStsRwWxTyMR5U9BIWpFAHaHw?w=176&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        "character_name": "SpongeBob SquarePants"
    },
    {
        "id": 3,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png",
        "character_name": "Homer Simpson"
    },
    {
        "id": 4,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/5/53/Scooby-Doo.png",
        "character_name": "Scooby-Doo"
    },
    {
        "id": 5,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/f/f6/Tom_Tom_and_Jerry.png",
        "character_name": "Tom Cat"
    },
    {
        "id": 6,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/2/2f/Jerry_Mouse.png",
        "character_name": "Jerry Mouse"
    },
    {
        "id": 7,
        "image_url": "https://www.desicomments.com/wp-content/uploads/2017/02/Image-Of-Donald-Duck.jpg",
        "character_name": "Donald Duck"
    },
    {
        "id": 8,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png",
        "character_name": "Bart Simpson"
    },
    {
        "id": 9,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/1/17/Bugs_Bunny.svg",
        "character_name": "Bugs Bunny"
    },
    {
        "id": 10,
        "image_url": "https://pngimg.com/uploads/pokemon/pokemon_PNG148.png",
        "character_name": "Pikachu"
    },
    {
        "id": 11,
        "image_url": "https://vignette.wikia.nocookie.net/vsbattles/images/4/4f/PopEye.png/revision/latest?cb=20160307172307",
        "character_name": "Popeye"
    },
    {
        "id": 12,
        "image_url": "https://www.nicepng.com/png/detail/53-534923_cartoon-character-png-fred-flintstone.png",
        "character_name": "Fred Flintstone"
    },
    {
        "id": 13,
        "image_url": "https://www.cartoonpics.net/data/media/11/snoopy_friends.png",
        "character_name": "Snoopy"
    },
    {
        "id": 14,
        "image_url": "https://images2.wikia.nocookie.net/__cb20130525054541/woodywoodpecker/images/2/26/Woody-woodpecker-tv-04-g.jpg",
        "character_name": "Woody Woodpecker"
    },
    {
        "id": 15,
        "image_url": "https://vignette.wikia.nocookie.net/dominios-encantados/images/e/ea/WIKI_BUZ_LIGHTYEAR.jpg/revision/latest?cb=20141222161728&path-prefix=es",
        "character_name": "Buzz Lightyear"
    },
    {
        "id": 16,
        "image_url": "https://images6.fanpop.com/image/photos/38800000/Elsa-frozen-38894629-960-960.jpg",
        "character_name": "Elsa"
    },
    {
        "id": 17,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/1/17/Batman-BenAffleck.jpg",
        "character_name": "Batman"
    }
]
const questionWrapper = document.querySelector(".question-wrapper");
let timeInterval;

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}
function getRandomOption() {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].character_name;
}

function getRandomOptions(correctCharacter) {
    let options = [correctCharacter];
    while (options.length < 4) {
        let option = getRandomOption();
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    return options.sort(() => Math.random() - 0.5); // shuffle the options list
}

function createResetBtnElement() {
    let resetBtnElement = document.createElement('button');
    resetBtnElement.setAttribute('class', 'bg-blue-700 font-bold px-6 py-2 rounded hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-300 border-2 border-white mr-4')
    resetBtnElement.addEventListener('click', renderQuestion)
    resetBtnElement.textContent = 'Reset'
    resetBtnElement.style.pointerEvents = 'auto';
    return resetBtnElement;
}

function createQuitBtnElement() {
    let quitBtnElement = document.createElement('button');
    quitBtnElement.setAttribute('class', 'bg-blue-700 font-bold px-6 py-2 rounded hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-300 border-2 border-blue-700')
    quitBtnElement.addEventListener('click', () => {
        window.location.href = 'index.html'
    })
    quitBtnElement.textContent = 'Quit'
    quitBtnElement.style.pointerEvents = 'auto';
    return quitBtnElement;
}

function createImageElement(url) {
    let imgElement = document.createElement('img');
    imgElement.setAttribute('class', "mx-auto my-8 h-40 w-40")
    imgElement.setAttribute('src', url);

    return imgElement;      
}

function createTimerElement() {
    let timerElement = document.createElement('span');
    timerElement.setAttribute('class', "text-blue-600 bg-white rounded px-2 py-1 font-bold")
    let timeLeft = 10;
    timerElement.textContent = `Time Left: ${timeLeft}s`
    timeInterval = setInterval(() => {
        timeLeft-=1
        timerElement.textContent = `Time Left: ${timeLeft}s`
        if (timeLeft==0) {
            clearInterval(timeInterval)
            renderQuestion()
            return
        }
    }, 1000)  

    return timerElement;
}

function createHeaderElement() {
    let headerElement = document.createElement('h1');
    headerElement.setAttribute('class', "text-gray-200 flex items-center p-2")
    headerElement.innerHTML = `<span class='flex-1 text-left text-xl'>Guess who is this!</span>`
    headerElement.appendChild(createTimerElement())

    return headerElement;      
}

function createOptionsElement(index, option, correctOption) {
    let optionElement = document.createElement('div');
    optionElement.setAttribute('class', 'option w-full bg-white shadow-md rounded p-2 flex my-4 flex items-center cursor-pointer hover:bg-blue-100')
    optionElement.innerHTML = `
                <div class="no bg-blue-500 h-8 w-8 f rounded-full text-white">${index + 1}</div>
                <div class="value text-xl flex-1 text-left pl-2">${option}</div>
                <span class="text-lg check">&check;</span>
                <span class="text-xl times">&times;</span>
        `

    optionElement.addEventListener('click', (e) => {
        if (option === correctOption) {
            optionElement.classList.add('correct')
        } else {
            optionElement.classList.add('wrong')
        }
        questionWrapper.style.pointerEvents = 'none';
        clearInterval(timeInterval)
    })
    return optionElement;
}

function renderQuestion() {
    questionWrapper.innerHTML = ``;
    questionWrapper.classList.remove('hide');
    questionWrapper.style.pointerEvents = 'auto';

    const randomQuestion = getRandomQuestion();
    const options = getRandomOptions(randomQuestion.character_name);

    questionWrapper.appendChild(createHeaderElement())
    questionWrapper.appendChild(createImageElement(randomQuestion.image_url))
    options.map((option, index) => {
        questionWrapper.appendChild(createOptionsElement(index, option, randomQuestion.character_name))
    })
    questionWrapper.appendChild(createResetBtnElement());
    questionWrapper.appendChild(createQuitBtnElement());
}

document.addEventListener('DOMContentLoaded', renderQuestion);
