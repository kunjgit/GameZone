const setOfWords = [
    "The quick brown fox jumps over the lazy dog",
    " Please take your dog, Cali, out for a walk – he really needs some exercise!",
    "I have three things to do today: wash my car, call my mother, and feed my dog.",
    "Those diamonds and rubies will make a beautiful piece of jewelry.",
    "In order to keep up at that pace, Zack Squeve would have to work all night.",
    "All the grandfather clocks in that store were set at exactly 3 o’clock."
];

const arr = document.getElementById('arr');
const typedSent = document.getElementById('mySent');
const btn = document.getElementById('done');

let startTime,endTime;

const playGame = () =>{
    let randomNumber = Math.floor(Math.random()*setOfWords.length);
    console.log(randomNumber);
    arr.innerText = setOfWords[randomNumber];

    let date = new Date();
    startTime = date.getTime();
    btn.innerText = "Done";

    typedSent.value = "";
}

const endGame = () =>{
    let date = new Date();
    endTime = date.getTime();
    //time in sec 
    let totalTime = ((endTime - startTime)/1000);
    console.log(totalTime);
    let totalWords = typedSent.value;
    let wordCount = wordCounter(totalWords);
    let speed = Math.round((wordCount / totalTime) * 60);

    let finalMessage = "Speed: "+speed+" wmp";

    finalMessage += compareWords(arr.innerHTML,totalWords);
    arr.innerHTML = finalMessage;
}

const compareWords = (str1,str2) =>{
    let words1 = str1.split(" ");
    let words2 = str2.split(" ");
    let count=0;

    //forEach method calls a function once in an order
    words1.forEach(function(item,index){
        if(item == words2[index]){
            count++;
        }
    })
    let errors = words1.length - count;
    return ("&nbsp;&nbsp; Correct words: "+count+" &nbsp;&nbsp; Total errors: "+errors);
}

const wordCounter = (str) =>{
    let output = str.split(" ").length;
    console.log(output);
    return output;
}

btn.addEventListener('click',function(){
    if(this.innerText == 'Start'){
        typedSent.disabled = false;
        playGame();
    }
    else if(this.innerText == "Done"){
        typedSent.disabled = true;
        btn.innerText = "Start";
        endGame();
    }
});
