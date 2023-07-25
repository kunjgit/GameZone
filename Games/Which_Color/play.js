// Game Sounds
const clock = new Audio("./assets/sounds/clock.mp3");
const correct = new Audio("./assets/sounds/correct.mp3");
const wrong = new Audio("./assets/sounds/wrong.mp3");

colors = ["gray", "white", "red", "purple", "green", "lime", "olive", "yellow", "blue", "aqua", "orange", "pink", "skyblue", "turquoise"];
let score = 0;
let count = 0;
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("h1").style.color = colors[Math.floor(Math.random() * colors.length)];

    const color_function = () => {
        return Math.floor(Math.random() * colors.length);
    };

    function click_function1() {
        if (document.getElementById("1").classList.contains("ans")){ correct.play(); score+=1;document.getElementById("1").classList.remove("ans")}
        else wrong.play();
        if (document.getElementById("2").classList.contains("ans")) document.getElementById("2").classList.remove("ans")
        document.querySelector("h3").innerText=`${score}/${count}`

        play()
    }

    function click_function2() {
        if (document.getElementById("2").classList.contains("ans")) { correct.play(); score+=1;document.getElementById("2").classList.remove("ans")}
        else wrong.play();
        if (document.getElementById("1").classList.contains("ans")) document.getElementById("1").classList.remove("ans")
        document.querySelector("h3").innerText=`${score}/${count}`

        play()
    }

    const play=()=> {
        const text_color = colors[color_function()];
        const text = colors[color_function()];
        clock.play();
        document.querySelector(".text").innerHTML = text;
        document.querySelector(".color").style.color = text_color;
        const selection_variable = Math.floor(Math.random() * 2);
            if (selection_variable) {
            document.getElementById("1").textContent = text_color;
            document.getElementById("1").classList.add("ans");
            document.getElementById("2").textContent = text;
        } else {
            document.getElementById("1").textContent = text;
            document.getElementById("2").textContent = text_color;
            document.getElementById("2").classList.add("ans");
        }
        count+=1
        document.getElementById("1").addEventListener("click", click_function1);
        document.getElementById("2").addEventListener("click", click_function2);
        if (count==11){
            document.getElementById("1").disabled=true
            document.getElementById("2").disabled=true
            document.getElementById("score").innerText =`Your final score is: ${score}`
            document.getElementById("score").style.visibility = "visible"
        }


    }

    
    play()


})

