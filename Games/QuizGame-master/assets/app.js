const questionEl = document.getElementById("question");
const picEl = document.getElementById("questionPic");
const choicesEl = document.getElementById("choices");
const submitBtn = document.getElementById("submit");
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const resultsDiv = document.getElementById("results");

let inputEls = document.querySelectorAll('input');
let i = 0, interval = 0, numRight = 0, numWrong = 0;
let count = 20;
let progress = 100;
let score = 0;
let userGuess;

window.customElements.define('progress-ring', ProgressRing);

let questionArr = [];
let pics = [];
let user, userScores;

let newTimeIndicator = document.createElement("div");
newTimeIndicator.setAttribute("id", "time-indicator");
newTimeIndicator.setAttribute("style","position: relative;display: flex;justify-content: center;flex-direction: column");
let progressRing = document.createElement("progress-ring");
progressRing.setAttribute("stroke",4);
progressRing.setAttribute("radius",45);
progressRing.setAttribute("progress",100);
let spanEl = document.createElement("span");
spanEl.setAttribute("style","bottom: 55px;position: relative;left: 35px;color: antiquewhite;");
newTimeIndicator.appendChild(progressRing);
newTimeIndicator.appendChild(spanEl);
picEl.append(newTimeIndicator);

async function load() {
  if (localStorage.getItem("questionData") && localStorage.getItem("picData")) {
    questionArr = JSON.parse(localStorage.getItem("questionData"));
    pics = JSON.parse(localStorage.getItem("picData"));
  } else {
    try {
      const data = await getData(
        "https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple"
      );
      questionArr = data.results.map(question=>{
        return (
          {
            ...question,
            question: question.question.replace(/&#039;/g,"'").replace("&amp;","&").replace(/&quot;/g,'"')
          }
        )
      });
      localStorage.setItem("questionData", JSON.stringify(questionArr));
    } catch (error) {
      console.error(error);
    }
    for (let i = 0; i < questionArr.length; i++) {
      try {
        let googleUrl = 'https://www.googleapis.com//customsearch/v1?';
        googleUrl += 'key=AIzaSyD_tgpw_aI3elBJ3FQzH5kqi00Qep6jXxM';
        googleUrl += '&cx=016797827939605093875:zpsbjfzch8y';
        googleUrl += '&searchType=image&q=';
        googleUrl += questionArr[i].correct_answer;
        googleUrl += '+';
        googleUrl += questionArr[i].category;
        const picsResponse  = await getData(googleUrl);
        pics.push(picsResponse.items[0].link);
      } catch (error) {
          console.log(error);
      } 
    }
    localStorage.setItem("picData", JSON.stringify(pics));
  }
  if(localStorage.getItem("scores")) {
    userScores = JSON.parse(localStorage.getItem("scores"));
  } else {
    userScores = [];
  }
}

async function getData(url = "", cors = 'cors') {
  const response = await fetch(url, {
    method: "GET",
    mode: cors,
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrer: "no-referrer",
  });
  return await response.json();
}

function start () {
  if (i < questionArr.length) {
    picEl.setAttribute(
      "style",
      `background: url(${pics[i]});background-size: cover;`
    );
    choicesEl.innerHTML = "";
    questionEl.textContent = questionArr[i].question;
    const choicesOrdered = questionArr[i].incorrect_answers;
    choicesOrdered.push(questionArr[i].correct_answer);
    const choices = choicesOrdered.sort((a, b) => 0.5 - Math.random());  
    for (let i = 0; i < choices.length; i++) {
        let checkboxDiv = document.createElement('div');
        checkboxDiv.setAttribute('class','mdc-checkbox');
        let checkboxInput = document.createElement('input');
        checkboxInput.setAttribute('type',"checkbox")
        checkboxInput.setAttribute('class', "mdc-checkbox__native-control")
        checkboxInput.setAttribute("id","checkbox-"+i);
        checkboxInput.addEventListener("click", uncheckOtherInputs);
        let checkbox = document.createElement('div');
        checkbox.setAttribute("class", "mdc-checkbox__background");
        let checkboxSvg = document.createElement('svg');
        checkboxSvg.setAttribute("class", "mdc-checkbox__checkmark");
        checkboxSvg.setAttribute("viewBox", "0 0 24 24");
        let checkboxPath = document.createElement("path");
        checkboxPath.setAttribute("class", "mdc-checkbox__checkmark-path")
        checkboxPath.setAttribute("fill","none")
        checkboxPath.setAttribute("d","M1.73,12.91 8.1,19.28 22.79,4.59");
        checkboxSvg.append(checkboxPath);
        let mixedmarkDiv = document.createElement('div');
        mixedmarkDiv.setAttribute("class","mdc-checkbox__mixedmark");
        checkbox.append(checkboxSvg,mixedmarkDiv);
        let checkboxRipple = document.createElement('div');
        checkboxRipple.setAttribute("class","mdc-checkbox__ripple");
        checkboxDiv.append(checkboxInput,checkbox,checkboxRipple);
        let checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute("for","checkbox-"+i);
        checkboxLabel.textContent = choices[i];
        let checkboxForm = document.createElement('div');
        checkboxForm.setAttribute("class","mdc-form-field");
        checkboxForm.append(checkboxDiv,checkboxLabel);
        choicesEl.append(checkboxForm);
    }
    inputEls = document.querySelectorAll('input');
  } else {
    if(localStorage.getItem("user")) {
      user = localStorage.getItem("user");
    } else {
      user = null;
    }
    let userScore = {
      user: user,
      score: score
    };
    userScores.push(userScore);
    localStorage.setItem("scores",JSON.stringify(userScores));
    resultsDiv.textContent = `You answered ${numRight} correct, ${numWrong} incorrect with an overall score of ${score}!`;
    resultsDiv.setAttribute("style", "display: block");
    score = 0;
    clearInterval(interval);
  }
}

function uncheckOtherInputs(event) {
    const id = parseInt(event.target.id.split('-')[1]);
    inputEls.forEach((el,i)=>{
        if(id !== i) {
            const selectedEl = document.getElementById("checkbox-"+i);
            selectedEl.checked = false;
        }
    });
}

function checkUserGuess() {
    let answerChecked = false;
    inputEls.forEach((el,i)=>{
        const selectedEl = document.getElementById("checkbox-"+i);
        if(selectedEl.checked === true ) {
            userGuess = i
            answerChecked = true;
        }
    });
    if (answerChecked){
      if (document.getElementById('checkbox-'+userGuess).parentNode.parentNode.children[1].textContent === questionArr[i].correct_answer) {
        alert("Correct Answer!");
        numRight++;
        score += count;
        resetQuestion(true);
      } else {
        alert("Wrong!!!!!!!!!");
        numWrong++;
        resetQuestion(true);
      }
    } else {
      alert("No answer checked!");
    }
}

function decrement() {
  if(count>0) {
    count--;
    newTimeIndicator.children[1].textContent = count;
    progress -= 5;
    progressRing.setAttribute('progress',progress);
  } else {
    numWrong++;
    resetQuestion();
  }
}

function resetQuestion(restartClock = false) {
    restartClock && clearInterval(interval);
    i++;
    count=20;
    progress=100;
    if (restartClock) {
      interval = setInterval(decrement,1000);
    }
    start();
}

document.addEventListener('scroll', function() {
    topAppBarElement.setAttribute('class','mdc-top-app-bar mdc-top-app-bar--short mdc-top-app-bar--short-collapsed');
    for (el of topAppBarElement.children[0].children[1].children) {el.setAttribute('style','display: none')};
    if(this.scrollingElement.scrollTop===0) {
        topAppBarElement.setAttribute('class','mdc-top-app-bar mdc-top-app-bar--short');
        for (el of topAppBarElement.children[0].children[1].children) {el.setAttribute('style','display: inline-block')};
    }
});
submitBtn.addEventListener("click", checkUserGuess);
async function run() {
  await load();
  start();
  interval = setInterval(decrement, 1000);
}
run();

var GoogleAuth; // Google Auth object.
function initClient() {
  gapi.client.init({
      'apiKey': '',
      'clientId': '748578261822-cgsg0pirpmf3q0q1vg28tf3icanigk03.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
  });
}

// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }
