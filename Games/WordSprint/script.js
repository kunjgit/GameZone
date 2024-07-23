var words =[
    [ 
        "next",
        "short",
        "nice",
        "bottle",
        "full",
        "soda",
        "vast",
        "glue",
        "close",
        "hurry",
        "robin",
        "trace",
        "rock",
        "absent",
        "cover",
        "note",
        "burst",
        "relax",
        "group",
        "sad",
        "rob",
        "yell",
        "pop",
        "mix",
        "fix",
        "hot",
        "pin",
        "hill",
        "wiry",
        "dirt",
    ],
    [
        "paddle",
        "answer",
        "awesome",
        "distance",
        "fertile",
        "wakeful",
        "belief",
        "slippery",
        "bizarre",
        "learned",
        "vivacious",
        "grandmother",
        "illegal",
        "thirsty",
        "wholesale",
        "tenuous",
        "skillful",
        "deteriorate",
        "poised",
        "humorous",
        "scrape",
        "replace",
        "languid",
        "adjoining",
        "interesting",
        "stranger",
        "polite",
        "scissors",
        "brainy",
        "interrogation",  
    ],
    [
        "return;",
        "#include",
        "'helloworld'",
        "obj:1",
        "call()",
        "&lt;html&gt;",
        "not_easy",
        "more-dashes",
        "camelCase",
        "ASCII",
        "array[]",
        "printf('')",
        "&lt;/html&gt;",
        "^regex$",
        "System.out.println()",
    ],
    [

        
    ],
]

var pointer = 0;
var level = 0;
var current = words[level][pointer];
var input = document.getElementById("input");
var box = document.getElementById("scrollingwords");
var orignamOffset = 133;
var offset = 133;
var nextOffset = 31;
var red = 0, green = 255, blue = 0;
var rotationOffset = -90;
var colorAddition = 25.5;
var rotationAddition = 9;
var countdown = 4;
var quaters = document.querySelectorAll('.quaters');
var score = 0;
var highscore = 0;

window.onload = function() {
    var final = "";
    for(var i = 0; i < words[level].length; i++) {
        final += "<li>" + words[level][i] + "</li>";
    }
    document.getElementsByClassName("bouncy")[0].classList.add("bouncyIntro");
    document.getElementById("q1").classList.add("q1c");
    document.getElementById("q2").classList.add("q2c");
    document.getElementById("q3").classList.add("q3c");
    document.getElementById("q4").classList.add("q4c");
    document.getElementsByTagName("ul")[0].innerHTML = final;
    document.getElementById("word").innerHTML = current;
    var currentScroll = document.getElementsByTagName("li")[pointer];
    currentScroll.style.fontSize = "19pt";
    currentScroll.style.fontWeight = "bold";
    currentScroll.style.color = "rgba(255, 255, 255, 0.7)";
}

input.onfocus = function() {
    input.placeholder = "";
}

input.onblur = function() {
    input.placeholder = "Type the text above to begin...";
}

function setColors() {
    if (green === 255 && red < 255 && blue === 0) {
        red += colorAddition;
        rotationOffset += rotationAddition;
        for (var i = 1; i < 4; i++) {
            document.getElementsByClassName('movers')[i].style.transform = "rotate(" + rotationOffset.toString() + "deg)";
        }
    }
    else if (green > 0 && red === 255 && blue === 0) {
        green -= colorAddition;
        rotationOffset += rotationAddition;
        for (var i = 2; i < 4; i++) {
            document.getElementsByClassName('movers')[i].style.transform = "rotate(" + rotationOffset.toString() + "deg)";
        }
    }
    else if (green === 0 && red === 255 && blue < 255) {
        blue += colorAddition;
        rotationOffset += rotationAddition;
        for (var i = 3; i < 4; i++) {
            document.getElementsByClassName('movers')[i].style.transform = "rotate(" + rotationOffset.toString() + "deg)";
        }
    }
}

function changeLevel(newLevel) {
    input.value = "";
    document.getElementById("q1").classList.add("q1c");
    document.getElementById("q2").classList.add("q2c");
    document.getElementById("q3").classList.add("q3c");
    document.getElementById("q4").classList.add("q4c");
    red = blue = 0;
    green = 255;
    rotationOffset = -90;
    quaters.forEach(quater => {
        var c = "rgb(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")";
        quater.style.borderLeftColor = c;
        quater.style.borderTopColor = c;
        quater.style.transform = "rotate(" + rotationOffset.toString() + "deg)";
    })
    level = newLevel;
    pointer = 0;
    current = words[level][pointer];
    var final = "";
    for(var i = 0; i < words[level].length; i++) {
        final += "<li>" + words[level][i] + "</li>";
    }
    document.getElementsByTagName("ul")[0].innerHTML = final;
    document.getElementById("word").innerHTML = current;
    offset = orignamOffset;
    var currentScroll = document.getElementsByTagName("li")[pointer];
    currentScroll.style.fontSize = "19pt";
    currentScroll.style.fontWeight = "bold";
    currentScroll.style.color = "rgba(255, 255, 255, 0.7)";
    var setLevel = level===2?"Coding":level;
    document.getElementById("message").innerHTML = "Level-" + level.toString();
    box.style.marginTop = offset.toString() + "px";
}

function setScore() {
    score += countdown;
    document.getElementById("score").innerHTML = score.toString();
}

function setHighScore() {
    if (score > highscore) {
        highscore = score;
        document.getElementById("highscore").innerHTML = highscore.toString();
    }
    score = 0;
    document.getElementById("score").innerHTML = score.toString();
}

function decodeHtml(html) {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = html;
	return textArea.value;
}

input.oninput = function() {
    if (level === 0 && pointer === 0 && input.value.length === 1) {
        var timed = setInterval(clockHandler, 1000);
        function clockHandler() {
            if (countdown > 0) {
                countdown--;
                if (countdown === 0) {
                    document.getElementById("message").innerHTML = "Game Over";
                    input.blur();
                    input.value = "";
                    setTimeout(() => {
                        clearInterval(timed);    
                        changeLevel(0);
                        countdown = 4;
                        setHighScore();
                        document.getElementById("secs").innerHTML = countdown;
                    }, 1000);
                }
            }
            document.getElementById("secs").innerHTML = countdown;
        }
    }
    document.getElementsByClassName("bouncy")[0].classList.remove("bouncyIntro");
    document.getElementsByClassName("bouncy")[0].style.opacity = "1";
    document.getElementById("q1").classList.remove("q1c");
    document.getElementById("q2").classList.remove("q2c");
    document.getElementById("q3").classList.remove("q3c");
    document.getElementById("q4").classList.remove("q4c");
    document.getElementsByClassName("bouncy")[0].classList.remove("bounce");
    if (input.value === decodeHtml(words[level][pointer])) {
        setColors();
        setScore();
        if (level === 0 && pointer >=19 && pointer != 29)
            countdown = 3;
        else
            countdown = 4;
        document.getElementById("secs").innerHTML = countdown;
        if (blue === 255) {
            var n = level + 1;
            changeLevel(n);
        }
        else {
            pointer += 1;
            current = words[level][pointer];
            document.getElementById("word").innerHTML = current;
            var currentScroll = document.getElementsByTagName("li")[pointer-1];
            currentScroll.style.fontSize = "13pt";
            currentScroll.style.fontWeight = "";
            currentScroll.style.color = "rgba(255, 255, 255, 0.2)";
            currentScroll = document.getElementsByTagName("li")[pointer];
            currentScroll.style.fontSize = "19pt";
            currentScroll.style.fontWeight = "bold";
            currentScroll.style.color = "rgba(255, 255, 255, 0.7)";
            document.getElementsByClassName("bouncy")[0].classList.add("bounce");
            offset = offset - nextOffset;
            quaters.forEach(quater => {
                var c = "rgb(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")";
                quater.style.borderLeftColor = c;
                quater.style.borderTopColor = c;
            })
            box.style.marginTop = offset.toString() + "px";
            input.value = "";
        }   
    }
}
