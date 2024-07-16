// JavaScript code here
var suspectList = [ "Suspect 1", "Suspect 2", " Suspect 3", "Suspect 4", "Suspect 5", "Suspect 6"];
var suspectGuilty = [ null, null, null, null, "Suspect 5", null];
var suspectDeduced = [];
var promptSingleCard = [];

console.log(suspectDeduced);
console.log(suspectDeduced.length);

var image1 = document.getElementById("pic_s1");
var image2 = document.getElementById("pic_s2");
var image3 = document.getElementById("pic_s3");
var image4 = document.getElementById("pic_s4");
var image5 = document.getElementById("pic_s5");
var image6 = document.getElementById("pic_s6");


var detectiveName = prompt("Reveal your identity, Detective!");

var display = function( data ){
    document.getElementById('output').innerText = data;
}

var alertButton = document.createElement('button');
alertButton.innerHTML = 'ARREST';
alertButton.classList.add('arrestButton');

alertButton.onclick = function(){
    if (suspectList[4] === suspectGuilty[4]) {
        display("Excellent! Elementary, my dear " + detectiveName);
        console.log(display);
    } else {
        display("Try again! Never trust to general impressions, my boy, but concentrate yourself upon details.");
    }
};

function changeImage(){
    if (image1.src.match("images/Suspect1.png") && promptSingleCard.length === 4) {
        image1.src = "images/Eliminated-Suspect.png";
        suspectList[0] = null;
        console.log(suspectList);
        promptSingleCard.push(1);
        console.log(promptSingleCard);
        alert("Are you sure this is your final suspect?");
        document.getElementById("deliberation").appendChild(alertButton);
    } else if (image1.src.match("images/Suspect1.png")) {
        image1.src = "images/Eliminated-Suspect.png";
        suspectList[0] = null;
        console.log(suspectList);
        promptSingleCard.push(1);
        console.log(promptSingleCard);
    } else {
        alert("This image has already been changed.");
    }
}

function changeImage2(){
    if (image2.src.match("images/Suspect2.png") && promptSingleCard.length === 4) {
        image2.src = "images/Eliminated-Suspect.png";
        suspectList[1] = null;
        console.log(suspectList);
        promptSingleCard.push(2);
        console.log(promptSingleCard);
        alert("Are you sure this is your final suspect?");
        document.getElementById("deliberation").appendChild(alertButton);
    } else if (image2.src.match("images/Suspect2.png")) {
        image2.src = "images/Eliminated-Suspect.png";
        suspectList[1] = null;
        console.log(suspectList);
        promptSingleCard.push(2);
        console.log(promptSingleCard);
    } else {
        alert("This image has already been changed.");
    }
}

function changeImage3(){
    if (image3.src.match("images/Suspect3.png") && promptSingleCard.length === 4) {
        image3.src = "images/Eliminated-Suspect.png";
        suspectList[2] = null;
        console.log(suspectList);
        promptSingleCard.push(3);
        console.log(promptSingleCard);
        alert("Are you sure this is your final suspect?");
        document.getElementById("deliberation").appendChild(alertButton);
    } else if (image3.src.match("images/Suspect3.png")) {
        image3.src = "images/Eliminated-Suspect.png";
        suspectList[2] = null;
        console.log(suspectList);
        promptSingleCard.push(3);
        console.log(promptSingleCard);
    } else {
        alert("This image has already been changed.");
    }
}

function changeImage4(){
    if (image4.src.match("images/Suspect4.png") && promptSingleCard.length === 4) {
        image4.src = "images/Eliminated-Suspect.png";
        suspectList[3] = null;
        console.log(suspectList);
        promptSingleCard.push(4);
        console.log(promptSingleCard);
        alert("Are you sure this is your final suspect?");
        document.getElementById("deliberation").appendChild(alertButton);
    } else if (image4.src.match("images/Suspect4.png")) {
        image4.src = "images/Eliminated-Suspect.png";
        suspectList[3] = null;
        console.log(suspectList);
        promptSingleCard.push(4);
        console.log(promptSingleCard);
    } else {
        alert("This image has already been changed.");
    }
}

function changeImage5(){
    if (image5.src.match("images/Suspect5.png") && promptSingleCard.length === 4) {
        image5.src = "images/Eliminated-Suspect.png";
        suspectList[4] = null;
        console.log(suspectList);
        promptSingleCard.push(5);
        console.log(promptSingleCard);
        alert("Are you sure this is your final suspect?");
        document.getElementById("deliberation").appendChild(alertButton);
    } else if (image5.src.match("images/Suspect5.png")) {
        image5.src = "images/Eliminated-Suspect.png";
        suspectList[4] = null;
        console.log(suspectList);
        promptSingleCard.push(5);
        console.log(promptSingleCard);
    } else {
        alert("This image has already been changed.");
    }
}

function changeImage6(){
    if (image6.src.match("images/Suspect6.png") && promptSingleCard.length === 4) {
        image6.src = "images/Eliminated-Suspect.png";
        suspectList[5] = null;
        console.log(suspectList);
        promptSingleCard.push(6);
        console.log(promptSingleCard);
        alert("Are you sure this is your final suspect?");
        document.getElementById("deliberation").appendChild(alertButton);
    } else if (image6.src.match("images/Suspect6.png")) {
        image6.src = "images/Eliminated-Suspect.png";
        suspectList[5] = null;
        console.log(suspectList);
        promptSingleCard.push(6);
        console.log(promptSingleCard);
    } else {
        alert("This image has already been changed.");
    }
}

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}
