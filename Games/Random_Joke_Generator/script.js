// grab a reference for necessary HTML elements
// .joke-text
const jokeText = document.querySelector('.joke-text');
// .new-joke-btn 
const newJokeBtn = document.querySelector('.new-joke-btn');
// .copy-btn
const copyBtn = document.querySelector('.copy-btn');

// add 'click' eventListener to .new-joke-btn
newJokeBtn.addEventListener('click', getJoke);

// add 'click' eventListener to .copy-btn
copyBtn.addEventListener('click', copyJoke);

// immediately call getJoke()
getJoke();

// getJoke() function definition
function getJoke() {
  // make an API request to https://icanhazdadjoke.com/'
  fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  }).then(function(response) {
    /* convert Stringified JSON response to Javascript Object */
    return response.json();
  }).then(function(data) {
    /* replace innerText of .joke-text with data.joke */
    // extract the joke text
    const joke = data.joke;
    // do the replacement
    jokeText.innerText = joke;
  }).catch(function(error) {
    // if some error occurred
    jokeText.innerText = 'Oops! Some error happened :(';
    // console log the error
    console.log(error);
  });
}

// copyJoke() function definition
function copyJoke() {
  // create a temporary textarea element to hold the joke text
  const textarea = document.createElement('textarea');
  // set the textarea's value to the joke text
  textarea.value = jokeText.innerText;
  // append the textarea to the document body (off-screen)
  document.body.appendChild(textarea);
  // select the text inside the textarea
  textarea.select();
  // execute the copy command
  document.execCommand('copy');
  // remove the textarea from the document
  document.body.removeChild(textarea);
  // optionally, provide feedback to the user
  alert('Joke copied to clipboard!');
}
