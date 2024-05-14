//Function to generate and display a random number
function generateRandomNumber() {
  const min = 1;
  const max = 100; // You can change the range as needed
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  //Display the random number in the result paragraph
  document.getElementById(
    "result"
  ).textContent = `Random Number: ${randomNumber}`;
}

//Add a click event listener to the button
document
  .getElementById("generateButton")
  .addEventListener("click", generateRandomNumber);
