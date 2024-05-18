document.addEventListener('DOMContentLoaded', function () {

  // Declaring stuff
  let myName = ""; // declaring a variable for my easter egg
  const audioPlayer = document.querySelector('audio');

  // ------ Functions ------

  // Getting the letter sound and playing it.
  function setLetterSound(letterVariable) {
    audioPlayer.src = `sounds/mp3/${letterVariable}.mp3`;
  }

  function setGenericSound() {
    audioPlayer.src = 'sounds/mp3/like-glass.mp3';
  }

  // Generating a new element to restart the CSS3 animation.
  function generateNewElement() {
    const elm = document.getElementById('big-char');
    const newone = elm.cloneNode(true);
    elm.parentNode.replaceChild(newone, elm);
  }

  // Running the HTML5 audio player
  function runAudioPlayer() {
    audioPlayer.load(); // pre loading the audio file
    audioPlayer.play(); // play the audio
  }

  // Show and hide the about
  document.getElementById('hide-button').addEventListener('click', function () {
    document.getElementById('about-cont').style.display = "none";
  });

  document.getElementById('about-button').addEventListener('click', function () {
    document.getElementById('about-cont').style.display = "block";
  });

  // On mobile, when the user taps on "Show Keyboard" move the focus to the hidden input
  document.getElementById('show-keyboard-button').addEventListener('click', function () {
    document.getElementById('mobile-text-input').focus();
  });

  document.addEventListener('keypress', function (event) { // Do stuff when you press any key in the document

    const letterOnScreen = document.getElementById('big-char'); // get the element properties
    console.log(event.key);
    if (!/^[a-zA-Z0-9]$/.test(event.key)) {
      const specialChars = {
        '13': 'Enter',
        '32': 'Space',
      };
      const specialChar = specialChars[event.keyCode] || event.key;
      letterOnScreen.innerHTML = specialChar;
      setGenericSound(); // Set the generic sound in the resources of the audio tag
    } else {
      letterOnScreen.innerHTML = event.key;
      const pressedLetter = event.key.toLowerCase(); // passing the pressed letter to the function to add it to sources (lower case because the sound files are in lower case).
      setLetterSound(pressedLetter);
    }

    runAudioPlayer(); // Play sound
    generateNewElement(); // Generate new DOM element to restart the animation

    // An easter egg, if you type my name
    myName += event.key;
    console.log(myName);
    if (myName.toLowerCase() === "avdhesh") {
      alert('You typed my name!\n--------------------------------\nNow I will show you my website.');
      window.open('https://avdhesh-portfolio.netlify.app/', '_blank');
    }

  });

  // Mute button
  document.getElementById('mute-button').addEventListener('click', function () {
    audioPlayer.muted = !audioPlayer.muted;
    document.getElementById('mute-button').innerHTML = audioPlayer.muted ? "Unmute Sounds" : "Mute Sounds";
    console.log('Sound ' + (audioPlayer.muted ? 'muted' : 'unmuted'));
  });

});
