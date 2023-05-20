// Generate random number 
const guessingNumber = Math.floor((Math.random() * 10) + 1);
let guessTimes = 0;

// console.log("Random Number: " + guessingNumber);  // check the random number 

// Check the number guessed by User 
function checkNum() 
{
    const resultText = document.getElementById("result");
    const submitBtn = document.getElementById("submitBtn");
    const refreshBtn = document.getElementById("refreshBtn");
    let numInput = document.getElementById("num").value;

    numInput = Number.parseInt(numInput.trim());
    guessTimes++;

    if (numInput === '' || isNaN(numInput) || typeof numInput === 'undefined' || !Number.isInteger(Number(numInput)) || numInput < 1 || numInput > 10)
        resultText.innerHTML = "Please enter a valid integer between 1 and 10.";
    else 
    {
        if(numInput == guessingNumber)
        {
            // change buttons 
            submitBtn.style.display = "none";
            refreshBtn.style.display = "block";
            
            // disable input 
            document.getElementById("num").disabled = "true";
            document.getElementById("num").style.color = "#2c3e50";
            
            // display results 
            resultText.classList.add("active");
            resultText.innerHTML = `${numInput} is the correct number, you took ${guessTimes} guesses!`;
        }
        else
            resultText.innerHTML = `You guessed the wrong number: ${numInput}.`;
    }
}
