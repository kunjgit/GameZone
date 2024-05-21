var select = document.querySelectorAll(".currency"),
    input_currency = document.getElementById('input_currency'),
    output_currency = document.getElementById('output_currency'),
    correctConversionRate;

fetch(`https://api.frankfurter.app/currencies`)
  .then((data) => data.json())
  .then((data) => {
    const entries = Object.entries(data);
    for (var i = 0; i < entries.length; i++) {
      select[0].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]}</option>`;
      select[1].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]}</option>`;
    }
});

function guessConversion(){
  input_currency_val = input_currency.value;
  if(select[0].value != select[1].value ){
    const host = 'api.frankfurter.app';
    fetch(`https://${host}/latest?amount=${input_currency_val}&from=${select[0].value}&to=${select[1].value}`)
      .then((val) => val.json())
      .then((val) => {
        correctConversionRate = Object.values(val.rates)[0];
        var userGuess = prompt("Enter your guess for the conversion rate:");
        if(userGuess !== null){
          userGuess = parseFloat(userGuess);
          if(userGuess === correctConversionRate){
            alert("You guessed correctly!");
          }else{
            alert("Oops! Try again.");
          }
        }
      });
  }else{
    alert("Please select two different currencies");
  }
}

function showAnswer(){
  if(correctConversionRate !== undefined){
    alert(`The correct conversion rate is: ${correctConversionRate}`);
  }else{
    alert("Please guess the conversion rate first.");
  }
}

function checkAnswer(){
  var userGuess = prompt("Enter your guess for the conversion rate:");
  if(userGuess !== null){
    userGuess = parseFloat(userGuess);
    if(userGuess === correctConversionRate){
      alert("You guessed correctly!");
    }else{
      alert("Oops! Try again.");
    }
  }
}
