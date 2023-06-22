var characters = [
    {name:"Shinchan", image:"https://pic-bstarstatic.akamaized.net/ugc/f0f768faa2d83bfef7dddd0300ba87cd.jpg@720w_405h_1e_1c_90q" },
     {name:"Doraemon", image:"https://www.japantimes.co.jp/wp-content/uploads/2020/05/np_file_13590.jpeg"},
     {name:"Pokemon", image:"https://img.lemde.fr/2022/12/22/5/0/1730/865/768/384/75/0/e968e4d_1671703423578-b5e.jpeg"}
   ];
   
   var currentCharacterIndex = 0;
   var timer;
   var timeLimit = 30;
   var score = 0;
   
   function startTimer() {
     var timerElement = document.getElementById("timer");
     timerElement.textContent = timeLimit;
   
     timer = setInterval(function() {
       if (timeLimit <= 0) {
         clearInterval(timer);
         showNextCharacter();
       }
       else {
         timeLimit--;
         timerElement.textContent = timeLimit;
       }
     }, 1000);
   }
   
   function showNextCharacter() {
     var characterImage = document.getElementById("character-image");
     var characterInput = document.getElementById("character-input");
     var result = document.getElementById("result");
   
     var userInput = characterInput.value.trim().toLowerCase();
     var currentCharacter = characters[currentCharacterIndex];
     if (userInput === currentCharacter.name.toLowerCase()) {
       score++;
       result.textContent = "Correct!";
     } else {
       result.textContent = "Wrong!";
     }
   
     characterInput.value = "";
   
     currentCharacterIndex++;
     if (currentCharacterIndex >= characters.length) {
       clearInterval(timer);
       characterImage.style.display = "none";
       characterInput.style.display = "none";
       result.textContent = "Game Over! Score: " + score;
       addToLeaderboard(score);
     } else {
       characterImage.src = characters[currentCharacterIndex].image;
       startTimer();
     }
   }
   
   function changeImage() {
     var characterImage = document.getElementById("character-image");
     var randomIndex = Math.floor(Math.random() * characters.length);
     characterImage.src = characters[randomIndex].image;
   }
   
   function addToLeaderboard(score) {
     var scoresList = document.getElementById("scores-list");
     var scoreItem = document.createElement("li");
     scoreItem.textContent = score;
     scoresList.appendChild(scoreItem);
   }
   
   window.addEventListener("load", function() {
     var submitBtn = document.getElementById("submit-btn");
     var changeImageBtn = document.getElementById("change-image-btn");
     var shareBtn = document.getElementById("share-btn");
     var challengeBtn = document.getElementById("challenge-btn");
   
     startTimer();
   
     submitBtn.addEventListener("click", showNextCharacter);
     changeImageBtn.addEventListener("click", changeImage);
   });
   