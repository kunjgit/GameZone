const clearInput = () => {
  userInput.value = "";
};

function replaceChar(origString, replaceChar, index) {
  let newStringArray = origString.split("");

  newStringArray[index] = replaceChar;

  let newString = newStringArray.join("");

  return newString;
}

// my custom flip framework (unused, so far)

const flipTo = (el, top, right, bottom, left, width, height) => {
  const element = document.querySelector(`#${el}`)

  const shortDirections = ["t", "r", "b", "l"]
  const Directions = [top, right, bottom, left]


  const first = element.getBoundingClientRect(); //shoroo

  let d;
  for(d = 0; d < 4; d++) {
    if (Directions[d] != undefined && Directions[d] != '') {
      element.classList.toggle(`m${shortDirections[d]}-[${Directions[d]}]`)
    }
  }

  if (width !== undefined && height !== undefined) {
    element.classList.toggle(`w-[${width}]`)
    element.classList.toggle(`h-[${height}]`)
  }

  const last = element.getBoundingClientRect(); //payan

  const deltaX = first.left - last.left
  const deltaY = first.top - last.top
  const deltaW = first.width / last.width
  const deltaH = first.height / last.height

  element.animate([{

      transform: `
          translate(${deltaX}px, ${deltaY}px)
          scale(${deltaW}, ${deltaH})
          `
      }, {
          transform: 'none'
      }], {
          duration: 300,
          easing: 'ease-in-out',
          fill: 'both'
  });

}

const waultLogo = '<div class="inline-block mx-1"><div class="text-lg flex text-white font-medium"><img class="w-[14px] mr-1 h-auto" src="./util/key.svg" /><span class="text-[#3ae57f]">W</span><span>ault</span></div></div>'

const userInput = document.querySelector("#vaultInput");
const submitButton = document.querySelector("#vaultSubmit");
const alertSection = document.querySelector("#alert");

const disableAll = () => {
  userInput.setAttribute("placeholder", "out of tries.");
  userInput.setAttribute("disabled", "");
  submitButton.setAttribute("disabled", "");
  submitButton.classList.toggle("hover:text-slate-400");
  submitButton.classList.replace("text-slate-300", "text-slate-400");
};

const displayAlert = () => {
  alertSection.classList.remove("hidden");
};

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* accept 'enter' button on keyboard as an
alternative to clicking the submit button */

userInput.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.keyCode === 13) {
    submitButton.click();
  }
});


/* the following characters are
accepted in number-only inputs
so i had to make a workaround */

const invalidChars = ["-", "+", "e"];

userInput.addEventListener("input", function () {
  this.value = this.value.replace(/[e\+\-]/gi, "");
});

userInput.addEventListener("keydown", function (e) {
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
});

let attempts = 4;
let i, order;
order = 0;

const rowsCh = ["A", "B", "C", "D"].map(
  (label) => document.querySelector(`.row${label}`).children
);

const rows = ["A", "B", "C", "D"].map((label) =>
  document.querySelector(`.row${label}`)
);

const vaultCode = String(getRandom(1000, 9999));

let addRow = () => {
  let currentCode = userInput.value;

  if (currentCode.length === 4) {
    for (i = 0; i < 4; i++) {
      rowsCh[order].item(i).innerHTML = currentCode[i];
      rows[order].classList.remove("hidden");

      // check wether it has to be a yellow or blue square

      if (currentCode[i] == vaultCode[i]) {
        rowsCh[order].item(i).style.background = "#00475e";
      }
      
      else if (vaultCode.includes(currentCode[i]) == true) {
        rowsCh[order].item(i).style.background = "#6b6600";
      }

      

    }

    // decrease the user attempts

    attempts--;
    document.querySelector("#attemptsWrapper").innerHTML = attempts;

    // checks wether it has to display win or lose

    if (attempts == 0) {
      disableAll();
      document.querySelector("#alertTitle").innerHTML = "Unlucky";
      document.querySelector("#alertDesc").innerHTML = "Next time, You will guess the" + waultLogo + "Code.";
      document.querySelector('#vaultPassword').innerHTML = 'The Wault Code Was ' + vaultCode
      setTimeout(() => {
        displayAlert();
      }, 300);
    }

    if (currentCode == vaultCode) {
      disableAll();
      document.querySelector("#alertTitle").innerHTML = "Victory";
      document.querySelector("#alertDesc").innerHTML = "Well done, You've Guessed the" + waultLogo + "Code.";
      setTimeout(() => {
        displayAlert();
      }, 300);
    }

    clearInput();
    order++;
  }
};
function calls(){
  swal("*INSTRUCTION - HOW TO PLAY*","The objective of this game is to find the password of 4 digits within 4 tries.\n\n\n~HINT-1:Digit in the black box-This digit is not used to form the vault's password.\n\n~HINT-2:Digit in the yellow box-This digit is used to form the vault's password but is not in it's correct position.\n\n~HINT-3:Digit in the blue box-This digit is used to form the vault's password and is in it's correct'position.\n\n\nAlso remember that the vault's password can have repeated digits.")
};