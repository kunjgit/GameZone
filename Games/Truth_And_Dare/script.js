const truths = [
    "What is your biggest fear?",
    "Have you ever lied to a friend to avoid a situation?",
    "What is the most embarrassing thing you've ever done?",
    "Have you ever cheated on a test?",
    "What is one thing you've never told anyone about yourself?",
    "What's the most adventurous thing you've ever done?",
    "What's your most significant achievement?",
    "What's your most embarrassing nickname?",
    "What's your favorite guilty pleasure?",
    "What's your most bizarre habit?",
    "What's the craziest thing you've done for love?",
  ];
  
  const dares = [
    "Call a random contact from your phone and say 'I love you!'",
    "Do your best impression of a famous celebrity.",
    "Sing a song in a funny voice.",
    "Wear socks on your hands for the next three rounds.",
    "Text your crush and tell them you like them (if applicable).",
    "Speak in an accent for the next three rounds.",
    "Do the chicken dance for one minute.",
    "Let the group give you a makeover.",
    "Do a headstand or handstand against a wall.",
    "Wear a funny hat for the rest of the game.",
    "Eat a spoonful of hot sauce.",
    "Put ice cubes down your shirt for 10 seconds.",
    "Go outside and yell 'I love Truth or Dare!' loudly.",
    "Blindfold yourself and do a silly dance.",
  ];
  
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  function getRandomTruthOrDare() {
    const questionContainer = document.getElementById("question");
    const isTruth = Math.random() < 0.5;
  
    if (isTruth) {
      const randomTruth = getRandomItem(truths);
      questionContainer.textContent = `Truth: ${randomTruth}`;
    } else {
      const randomDare = getRandomItem(dares);
      questionContainer.textContent = `Dare: ${randomDare}`;
    }
  }
  