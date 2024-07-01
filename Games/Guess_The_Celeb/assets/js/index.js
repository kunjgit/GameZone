const celebrities = [
    {
      name: "Tom Cruise",
      hint1: "Most handsome actor",
      hint2: "Starred in 'Mission Imposible'",
      img1: "tomcruise_1.jpg",
      img2: "tomcruise_2.jpg"
    },
    {
      name: "Emma Watson",
      hint1: "Actress",
      hint2: "Starred in 'Harry Potter'",
      img1: "emmawatson_1.jpg",
      img2: "emmawatson_2.jpg"
    },
    {
        name: "Leonardo DiCaprio",
        hint1: "Oscar-winning actor",
        hint2: "Starred in 'Titanic'",
        img1: "leonardodicaprio_1.jpg",
        img2: "leonardodicaprio_2.jpg"
    },
    {
        name: "Hritik Roshan",
        hint1: "Bollywood actor",
        hint2: "Starred in 'Kaho Naa Pyaar Hai'",
        img1: "hritikroshan_1.jpg",
        img2: "hritikroshan_2.jpg"
    },
    {
        name: "Shah Rukh Khan",
        hint1: "Bollywood actor",
        hint2: "Starred in 'Dilwale Dulhania Le Jayenge'",
        img1: "shahrukhkhan_1.jpg",
        img2: "shahrukhkhan_2.jpg"
    },

    {
        name: "Angelina Jolie",
        hint1: "Oscar-winning actress",
        hint2: "Starred in 'Maleficent'",
        img1: "angelinajolie_1.jpg",
        img2: "angelinajolie_2.jpg"
    },
    {
        name: "Amitabh Bachchan",
        hint1: "Bollywood actor",
        hint2: "Starred in 'Sholay'",
        img1: "amitabhbachchan_1.jpg",
        img2: "amitabhbachchan_2.jpg"
    },
    {
        name: "Aishwarya Rai",
        hint1: "Bollywood actress",
        hint2: "Starred in 'Devdas'",
        img1: "aishwaryarai_1.jpg",
        img2: "aishwaryarai_2.jpg"
    },
    {
        name: "Leonel Messi",
        hint1: "Footballer",
        hint2: "Plays for FC Barcelona",
        img1: "leonelmessi_1.jpg",
        img2: "leonelmessi_2.jpg"
    },
    {
        name: "Cristiano Ronaldo",
        hint1: "Footballer",
        hint2: "Plays for Juventus",
        img1: "cristianoronaldo_1.jpg",
        img2: "cristianoronaldo_2.jpg"
    },
    {
        name: "Virat Kohli",
        hint1: "Cricketer",
        hint2: "Captain of Indian Cricket Team",
        img1: "viratkohli_1.jpg",
        img2: "viratkohli_2.jpg"
    },
    {
        name:"Sourav Ganguly",
        hint1: "Cricketer",
        hint2: "Former Captain of Indian Cricket Team",
        img1: "souravganguly_1.jpg",
        img2: "souravganguly_2.jpg"
    },
  ];
  
  let currentCelebrityIndex = 0;
  let score = 0;
  
  const image1 = document.getElementById("image1");
  const image2 = document.getElementById("image2");
  const options = document.getElementsByClassName("option");
  const scoreDisplay = document.getElementById("score");
  
  function displayCelebrity() {
    const currentCelebrity = celebrities[currentCelebrityIndex];
    image1.src = `./assets/img/${currentCelebrity.img1}`;
    image2.src = `./assets/img/${currentCelebrity.img2}`;
  
    const shuffledOptions = shuffleOptions([
      currentCelebrity.name,
      getRandomCelebrityName(),
      getRandomCelebrityName(),
      getRandomCelebrityName()
    ]);
  
    for (let i = 0; i < options.length; i++) {
      options[i].textContent = shuffledOptions[i];
      options[i].addEventListener("click", handleGuess);
    }
  }
  
  function handleGuess(event) {
    const selectedOption = event.target;
    const selectedName = selectedOption.textContent;
    const correctName = celebrities[currentCelebrityIndex].name;
  
    if (selectedName === correctName) {
      score += 5;
      alert("Correct guess! +5 points");
    } else {
      alert("Wrong guess! Try again.");
    }
  
    currentCelebrityIndex++;
    if (currentCelebrityIndex >= celebrities.length) {
      alert(`Game Over! Your final score is ${score}`);
    } else {
      displayCelebrity();
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }
  
  function getRandomCelebrityName() {
    const randomIndex = Math.floor(Math.random() * celebrities.length);
    return celebrities[randomIndex].name;
  }
  
  function shuffleOptions(options) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  displayCelebrity();
  scoreDisplay.textContent = `Score: ${score}`;
  