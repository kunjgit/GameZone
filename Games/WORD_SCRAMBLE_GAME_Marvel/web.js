const msg = document.querySelector(".msg");
const guess = document.querySelector("input");
const btn = document.querySelector(".btn");
const hint = document.querySelector(".hint");
const show = document.querySelector(".show");
const skip = document.querySelector(".skip");
let play = false;
let newWords = "";
let randWords = "";
let sWords = [
  "2008",
  "Mjolnir",
  "Vibranium",
  "TChalla",
  "Chitauri",
  "storkclub",
  "gamora",
  "harley",
  "hydra",
  "cork",
  "malekith",
  "morag",
  "yellowjacket",
  "nigeria",
  "shuri",
  "groot",
  "peterparker",
  "wakanda",
  "thanos",
  "eitri"
];
const createNewWords = function () {
  let randNum = Math.floor(Math.random() * sWords.length);
  // console.log(randNum);
  let newTempSwords = sWords[randNum];
  return newTempSwords;
};
const scrambleWords = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let temp = arr[i];
    console.log(temp);
    let j = Math.floor(Math.random() * (i + 1));
    console.log(i);
    console.log(j);
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
skip.addEventListener("click", () => {
  // btn.innerHTML="Guess";
  // skip.style.display="block";
  // guess.classList.toggle('text');
  newWords = createNewWords();
  randWords = scrambleWords(newWords.split("")).join("");
  // console.log(randWords.join(""));
  msg.innerHTML = `Unscramble The Answer:- ${randWords}`;
  hintQuestions();
});
btn.addEventListener("click", function () {
  if (!play) {
    play = true;
    btn.innerHTML = "Guess";
    skip.style.display = "block";
    guess.classList.toggle("text");
    newWords = createNewWords();
    randWords = scrambleWords(newWords.split("")).join("");
    // console.log(randWords.join(""));
    msg.innerHTML = `Unscramble The Answer:- ${randWords}`;
    hintQuestions();
  } else {
    let tempWord = guess.value;
    if (tempWord === newWords) {
      // console.log("sahi");
      play = false;
      msg.innerHTML = `CORRECT!, IT IS ${newWords}`;
      btn.innerHTML = "Next";
      guess.classList.toggle("text");
      guess.value = "";
      show.style.display = "none";
      skip.style.display = "none";
    } else {
      // console.log("galat");
      msg.innerHTML = `It's INCORRECT. TRY AGAIN -- ${randWords}`;
      show.style.display = "block";
      show.innerHTML = "STUCK ? SHOW ANSWER";
      show.addEventListener("click", () => {
        // let a = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? ');
        if (newWords === sWords[0]) {
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let a = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? ');
          show.innerHTML = "2008";
          guess.value = "2008";
        } else if (newWords === sWords[1]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='dumbledore';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let b = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? ');
          show.innerHTML = "Mjolnir";
          guess.value = "Mjolnir";
        } else if (newWords === sWords[2]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');

          // show.innerHTML='tomriddle';

          // show.innerHTML='STUCK ? SHOW ANSWER';

          // let c = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "Vibranium";
          guess.value = "Vibranium";
        } else if (newWords === sWords[3]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='hagrid';
          // show.innerHTML='STUCK ? SHOW ANSWER';

          // let d = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "TChalla";
          guess.value = "TChalla";
        } else if (newWords === sWords[4]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='slytherin';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let e = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "Chitauri";
          guess.value = "Chitauri";
        } else if (newWords === sWords[5]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='voldemort';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let f = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "storkclub";
          guess.value = "storkclub";
        } else if (newWords === sWords[6]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='siriusblack';
          // show.innerHTML='STUCK ? SHOW ANSWER';

          // let g = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "gamora";
          guess.value = "gamora";
        } else if (newWords === sWords[7]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');

          // show.innerHTML='spiders';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let h = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "harley";
          guess.value = "harley";
        } else if (newWords === sWords[8]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');

          // show.innerHTML='fang';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let i = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? ');
          show.innerHTML = "hydra";
          guess.value = "hydra";
        } else if (newWords === sWords[9]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='ginny';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let j = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? ');
          show.innerHTML = "cork";
          guess.value = "cork";
        } else if (newWords === sWords[10]) {
          // confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER? IF YES, CLICK AGAIN');
          // show.innerHTML='keeper';
          // show.innerHTML='STUCK ? SHOW ANSWER';
          // let k = confirm('ARE YOU SURE YOU WANT TO SEE THE ANSWER?');
          show.innerHTML = "malekith";
          guess.value = "malekith";
        } else if (newWords === sWords[11]) {
          show.innerHTML = "morag";
          guess.value = "morag";
        }
        else if (newWords === sWords[12]) {
          show.innerHTML = "yellowjacket";
          guess.value = "yellowjacket";
        }
        else if (newWords === sWords[13]) {
          show.innerHTML = "nigeria";
          guess.value = "nigeria";
        }
        else if (newWords === sWords[14]) {
          show.innerHTML = "shuri";
          guess.value = "shuri";
        }
        else if (newWords === sWords[15]) {
          show.innerHTML = "groot";
          guess.value = "groot";
        } else if (newWords === sWords[16]) {
          show.innerHTML = "peterparker";
          guess.value = "peterparker";
        } else if (newWords === sWords[17]) {
          show.innerHTML = "wakanda";
          guess.value = "wakanda";
        } else if (newWords === sWords[18]) {
          show.innerHTML = "thanos";
          guess.value = "thanos";
        } else if (newWords === sWords[19]) {
          show.innerHTML = "eitri";
          guess.value = "eitri";
        }
      });
    }
  }
});
function hintQuestions() {
  if (newWords === sWords[0]) {
    hint.innerHTML =
      "HINT: What year was the first Iron Man movie released, kicking off the Marvel Cinematic Universe?";
    console.log("2008");
  } else if (newWords === sWords[1]) {
    hint.innerHTML = "HINT: What is the name of Thor’s hammer?";
    console.log("Mjolnir");
  } else if (newWords === sWords[2]) {
    hint.innerHTML = "HINT: What is Captain America’s shield made of? ";
    console.log("Vibranium");
  } else if (newWords === sWords[3]) {
    hint.innerHTML = "HINT:  What is the real name of the Black Panther?";
    console.log("Tchalla");
  } else if (newWords === sWords[4]) {
    hint.innerHTML =
      "HINT: What is the alien race Loki sends to invade Earth in The Avengers?";
    console.log("Chitauri");
  } else if (newWords === sWords[5]) {
    hint.innerHTML =
      "HINT: Where does Peggy tell Steve she wants to meet him for a dance, before he plunges into the ice?";
    console.log("storkclub");
  } else if (newWords === sWords[6]) {
    hint.innerHTML =
      "HINT: Who does the Mad Titan sacrifice to acquire the Soul Stone?";
    console.log("gamora");
  } else if (newWords === sWords[7]) {
    hint.innerHTML =
      "HINT: What is the name of the little boy Tony befriends while stranded in the Iron Man 3?";
    console.log("harley");
  } else if (newWords === sWords[8]) {
    hint.innerHTML =
      "HINT: What is the name of the organisation revealed to have taken over S.H.I.E.L.D. in Captain America: The Winter Soldier?";
    console.log("hydra");
  } else if (newWords === sWords[9]) {
    hint.innerHTML =
      "HINT: Director Taika Waititi also played which comedic Thor: Ragnarok character?";
    console.log("cork");
  } else if (newWords === sWords[10]) {
    hint.innerHTML = "HINT:Who was the villain of ‘Thor: The Dark World?";
    console.log("malekith");
  } else if (newWords === sWords[11]) {
    hint.innerHTML =
      "HINT:. Which planet does Peter Quill retrieve the Orb containing the Power Stone?";
    console.log("morag");
  } else if (newWords === sWords[12]) {
    hint.innerHTML =
      "HINT:. In the Ant-Man, Darren Cross developed a shrinking suit similar to the one worn by Scott Lang. What was it called?";
    console.log("yellowjacket");
  } else if (newWords === sWords[13]) {
    hint.innerHTML =
      "HINT:. In Black Panther, what African country is Nakia operating in as a spy before T’Challa arrived and brought her back to Wakanda?";
    console.log("nigeria");
  } else if (newWords === sWords[14]) {
    hint.innerHTML =
      "HINT:. Who is Black Panthers sister?";
    console.log("shuri");
  }
  else if (newWords === sWords[15]) {
    hint.innerHTML = "HINT: What is the name of the tree-like humanoid character in 'Guardians of the Galaxy'?";
    
  } else if (newWords === sWords[16]) {
    hint.innerHTML = "HINT: What is the real name of Spider-Man?";
  } else if (newWords === sWords[17]) {
    hint.innerHTML = "HINT: What is the hidden and technologically advanced African nation in the Marvel Universe?";
  } else if (newWords === sWords[18]) {
    hint.innerHTML = "HINT: Who is the main antagonist in Avengers: Infinity War and Avengers: Endgame?";
  } else if (newWords === sWords[19]) {
    hint.innerHTML = "HINT: Who is the giant dwarf and weaponsmith played by Peter Dinklage in Avengers: Infinity War?";
  }

}
