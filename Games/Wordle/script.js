const words_list=["About","Alert","Argue","Beach","Above","Alike","Arise","Began","Abuse","Alive","Array","Begin","Actor","Allow","Aside","Begun","Acute","Alone","Asset","Being","Admit","Along","Audio","Below","Adopt","Alter","Audit","Bench","Adult","Among","Avoid","Billy","After","Anger","Award","Birth","Again","Angle","Aware","Black","Agent","Angry","Badly","Blame","Agree","Apart","Baker","Blind","Ahead","Apple","Bases","Block","Alarm","Apply","Basic","Blood","Album","Arena","Basis","Board","Boost","Buyer","China","Cover","Booth","Cable","Chose","Craft","Bound","Calif","Civil","Crash","Brain","Carry","Claim","Cream","Brand","Catch","Class","Crime","Bread","Cause","Clean","Cross","Break","Chain","Clear","Crowd","Breed","Chair","Click","Crown","Brief","Chart","Clock","Curve","Bring","Chase","Close","Cycle","Broad","Cheap","Coach","Daily","Broke","Check","Coast","Dance","Brown","Chest","Could","Dated","Build","Chief","Count","Dealt","Built","Child","Court","Death","Debut","Entry","Forth","Group","Delay","Equal","Forty","Grown","Depth","Error","Forum","Guard","Doing","Event","Found","Guess","Doubt","Every","Frame","Guest","Dozen","Exact","Frank","Guide","Draft","Exist","Fraud","Happy","Drama","Extra","Fresh","Harry","Drawn","Faith","Front","Heart","Dream","False","Fruit","Heavy","Dress","Fault","Fully","Hence","Drill","Fiber","Funny","Night","Drink","Field","Giant","Horse","Drive","Fifth","Given","Hotel","Drove","Fifty","Glass","House","Dying","Fight","Globe","Human","Eager","Final","Going","Ideal","Early","First","Grace","Image","Earth","Fixed","Grade","Index","Eight","Flash","Grand","Inner","Elite","Fleet","Grant","Input","Empty","Floor","Grass","Issue","Enemy","Fluid","Great","Irony","Enjoy","Focus","Green","Juice","Enter","Force","Gross","Joint","Judge","Metal","Media","Newly","Known","Local","Might","Noise","Label","Logic","Minor","North","Large","Loose","Minus","Noted","Laser","Lower","Mixed","Novel","Later","Lucky","Model","Nurse","Laugh","Lunch","Money","Occur","Layer","Lying","Month","Ocean","Learn","Magic","Moral","Offer","Lease","Major","Motor","Often","Least","Maker","Mount","Order","Leave","March","Mouse","Other","Legal","Music","Mouth","Ought","Level","Match","Movie","Paint","Light","Mayor","Needs","Paper","Limit","Meant","Never","Party","Peace","Power","Radio","Round","Panel","Press","Raise","Route","Phase","Price","Range","Royal","Phone","Pride","Rapid","Rural","Photo","Prime","Ratio","Scale","Piece","Print","Reach","Scene","Pilot","Prior","Ready","Scope","Pitch","Prize","Refer","Score","Place","Proof","Right","Sense","Plain","Proud","Rival","Serve","Plane","Prove","River","Seven","Plant","Queen","Quick","Shall","Plate","Sixth","Stand","Shape","Point","Quiet","Roman","Share","Pound","Quite","Rough","Sharp","Sheet","Spare","Style","Times","Shelf","Speak","Sugar","Tired","Shell","Speed","Suite","Title","Shift","Spend","Super","Today","Shirt","Spent","Sweet","Topic","Shock","Split","Table","Total","Shoot","Spoke","Taken","Touch","Short","Sport","Taste","Tough","Shown","Staff","Taxes","Tower","Sight","Stage","Teach","Track","Since","Stake","Teeth","Trade","Sixty","Start","Texas","Treat","Sized","State","Thank","Trend","Skill","Steam","Theft","Trial","Sleep","Steel","Their","Tried","Slide","Stick","Theme","Tries","Small","Still","There","Truck","Smart","Stock","These","Truly","Smile","Stone","Thick","Trust","Smith","Stood","Thing","Truth","Smoke","Store","Think","Twice","Solid","Storm","Third","Under","Solve","Story","Those","Undue","Sorry","Strip","Three","Union","Sound","Stuck","Threw","Unity","South","Study","Throw","Until","Space","Stuff","Tight","Upper","Upset","Whole","Waste","Wound","Urban","Whose","Watch","Write","Usage","Woman","Water","Wrong","Usual","Train","Wheel","Wrote","Valid","World","Where","Yield","Value","Worry","Which","Young","Video","Worse","While","Youth","Virus","Worst","White","Worth","Visit","Would","Vital","Voice"];

const message= document.getElementById("message");

//Scrolls to top after the game finishes
function scrollToTop(){
    window.scroll({
        top:0,
        left:0,
        behaviour: "smooth",
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    createSquares();
    //getNewWord();

    let guessedWords = [[]];
    let availableSpace =1;

    let word=words_list[Math.floor(Math.random()*words_list.length)].toLowerCase();
    let guessedWordCount = 0;

    console.log(word);

    const keys=document.querySelectorAll(".keyboard-row button");
    // The below function can be used to fetch 5 letter words using APIs

    // function getNewWord() {
    //     fetch(
    //       `https://wordsapiv1.p.rapidapi.com/words/`,
    //       {
    //         method: "GET",
    //         params: {random: 'true'},
    //         headers: {
    //           "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
    //           "x-rapidapi-key": "Your_API_Key",
    //         },
    //       }
    //     )
    //       .then((response) => {
    //         return response.json();
    //       })
    //       .then((res) => {
    //         word = res.word;
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //       });
    //   }

    //Number of guesses made
    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords-1];
    }

    //increment the square boxes(tiles)
    function updateGuessedWords(letter){
         const currentWordArr =getCurrentWordArr();

         if(currentWordArr && currentWordArr.length<5){
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace=availableSpace+1;

            availableSpaceEl.textContent=letter;
         }
    }

    //Get Color of Tile after each guess
    function getTileColor(letter,index){
        const isCorrectLetter = word.includes(letter);

        if(!isCorrectLetter){
            return "rgb(58,58,60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if(isCorrectPosition){
            return "rgb(83,141,78)";
        }

        return "rgb(181,159,59)";
    }

    //Change the Color of Keyboard keys according to the color scheme once a guess is made
    function changeKeyColor(tileColor,letter){
        const letterKey = document.querySelector(`[data-key=${letter}]`);

        if(letterKey.style.backgroundColor=="rgb(83, 141, 78)"){
            return;    
        }

        letterKey.style=`background-color:${tileColor};`
    }

    //Handle "Enter" Key
    function handleSubmitWord(){
       const currentWordArr = getCurrentWordArr();
       if(currentWordArr.length!==5){
        console.log(currentWordArr);
        window.alert("Word must be 5 letters");
        return;
       }

       const currentWord = currentWordArr.join("");

       const firstLetterId = guessedWordCount*5 + 1;
       const interval = 300;
       currentWordArr.forEach((letter,index) => {

        //Change Color of Tile successively with animation 
        setTimeout(() => {
            const tileColor = getTileColor(letter,index);
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor}; border-color:${tileColor};`;
            changeKeyColor(tileColor,letter);
        }, interval*index) 
       });

       guessedWordCount+=1;

       //If Guessed word is the correct word
       if(currentWord===word){
        message.innerHTML=`Congratulations!<br>You Won!!!`;
        scrollToTop();
        return;
       }

       //If player has exhausted the guesses and couldn't guess the right word
       if(guessedWords.length === 6){
        message.innerHTML=`Sorry.You Lost.<br>Correct Word is ${word}`;
        scrollToTop();
        return;
       }

       //Go to next row of tiles
       guessedWords.push([]);
    }

    //Handle "Del" Key
    function handleDeleteLetter(){
        const currentWordArr= getCurrentWordArr();
        const removedLetter = currentWordArr.pop();
        guessedWords[guessedWords.length-1]= currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace-1));
        lastLetterEl.textContent = '';
        availableSpace=availableSpace-1;
    }

    //Creating square tiles
    function createSquares(){
        const gameBoard = document.getElementById("board");

        for(let index = 0; index < 30; index++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id",index+1);
            gameBoard.appendChild(square);
        }
    }


    //Function performed when a key is presses
    for(let i=0;i<keys.length;i++){
        keys[i].onclick = ({target}) => {
          const letter =target.getAttribute("data-key");
          if(letter==='enter'){
            handleSubmitWord();
            return;
          }

          if(letter==='del'){
            handleDeleteLetter();
            return;
          }

          console.log(letter);
          updateGuessedWords(letter);
        };
      }

})