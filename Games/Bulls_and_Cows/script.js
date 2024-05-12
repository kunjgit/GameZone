let secretCode = generateRandomCode();
        let guesses = [];

        function generateRandomCode() {
            const uniqueDigits = new Set();
            while (uniqueDigits.size < 4) {
                uniqueDigits.add(Math.floor(Math.random() * 10));
            }
            return Array.from(uniqueDigits).join("");
        }

        function check() {
            const guess = document.getElementById("try").value;
            let bulls = 0;
            let cows = 0;

            for (let i = 0; i < 4; i++) {
                if (guess[i] === secretCode[i]) {
                    bulls++;
                } else if (secretCode.includes(guess[i]) && guess[i] !== secretCode[i]) {
                    cows++;
                }
            }

            const result = `${bulls} bull${bulls !== 1 ? "s" : ""} and ${cows} cow${cows !== 1 ? "s" : ""}`;
            const guessInfo = `Your guess: ${guess} - ${result}`;
            guesses.push(guessInfo);

            document.getElementById("console").innerText = guessInfo;
            document.getElementById("history").innerHTML = `<strong>Guess History:</strong><br>${guesses.join("<br>")}`;

            if (bulls === 4) {
                alert("Congratulations, you guessed it!");
                // Reset the game
                secretCode = generateRandomCode();
                guesses = [];
                document.getElementById("try").value = ""; // Clear the guess input
                document.getElementById("console").innerText = "";
                document.getElementById("history").innerHTML = "";
            }
        }