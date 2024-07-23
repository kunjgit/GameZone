let uname = "User"
let upt = 0
let opt = 0
var no = 10
let totalNo = 0

function copyFunc() {
    var copyText = document.getElementById("copyurl");
    copyText.focus()
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the url: " + copyText.value);
}
// function copyFunc() {
//     window.prompt("Copy to clipboard:", 'https: //vigneshnu.herokuapp.com/swg.html');
// }

function sign() {
    let regex = /[a-zA-Z]{3,15}/;
    let reg = /[5-50]/;
    namesign = ` <div id="abs"  style=" position: absolute; top: 20%;  width: 100vh;max-width:1000px; height: 100vh;">
    <div  style="width: 90%; height:60%; background: linear-gradient(to bottom, #ff0000 0%, #6666ff 100%); border-radius: 28px; border: 6px solid rgb(255, 196, 0); margin: auto;display: flex;flex-direction: column;justify-content: center;align-self:center;">
    <p style="text-align: center; width:100%; margin:10vh 0 5vh 0; font-size: 4vh;font-weight: bold; background-image: linear-gradient(to right, red, green 33%,blue 35%, black);
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;">Snake Water Gun</p>
    <div style = "margin:auto;">
    <lable style=" font-size:3vh; margin:0 8vh;display:block;">Your Name : </lable>
    <input id="name" type="text" placeholder="Enter your name " style="font-weight:bold;text-align:center; border-radius: 30px; width: 60%;height:7%; margin:1vh 8vh; padding:1em; border: 4px solid rgba(255, 128, 43, 0.849); font-family:monospace;font-size:2vh;">
    <lable style="display:block; font-size:2vh; margin:0 8vh;margin-top:2vh">How many Rounds <br> <small>do you want to play?</small> </lable>
    <input id="noOfRounds" type="number" min="5" max="50" step="5" value="10" style="font-weight:bold;text-align:center; border-radius: 30px; width: 60%;height:6%; margin:1vh 8vh; padding:1em;  border: 4px solid rgba(255, 128, 43, 0.849); font-family:monospace;font-size:2vh;">
    </div>
    <button id="play" style=" border-radius: 23px; width: 15rem; margin: 4vh auto;margin-bottom:10vh;  background: linear-gradient(to bottom, #0066ff 0%, #ff99cc 100%); padding:1.5vh; border: 5px solid rgb(72, 72, 231); font-size: 4vh; font-family: 'Fredoka One', cursive;">Play</button>
    </div> </div>`

    document.getElementById("entry").innerHTML = namesign

    play = document.getElementById("play").addEventListener("click", () => {
        uname = document.getElementById("name").value
        no = parseInt(document.getElementById("noOfRounds").value)
        totalNo = no
        if (regex.test(uname) && reg.test(no)) {
            entry = document.getElementById("entry").innerHTML = ""
            document.getElementById('userName').innerText = uname
            document.getElementById("rounds").innerText = `${ (totalNo + 1) - no}/${totalNo}`

        } else {
            alert("Please enter your name, name shold only be alphabets and between 2-15 characters and rounds must not be null.")
        }

    })

}

function end(resmessage, desc) {
    let link = "https://vigneshnu.herokuapp.com/swg.html"
    let text = `Hey!, let's play Snake Water Gun game, have fun, let's know how lucky you are!     `
    endhtml = `<div style="display: flex;flex-direction: column; align-items: center;justify-content: center; width: 100%;height: 100vh; padding: 10px;    background: linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%);margin: auto; border-radius: 18px;">

                <div style="max-height:60vh; width:90%;margin: 3vh auto; background-image:url('cong1.jpg'); background-repeat:no-repear;background-size:cover;display: flex;flex-direction: column; align-items: center ; border-radius: 12px;padding: 18px;">
                    <b style="text-align:center; font-size: 7vh;font-family: 'Lobster', cursive; color: rgb(235, 22, 22);">${resmessage}</b>
                    <b style="text-align:center; font-size: 9vh;padding:1vhfont-family: 'Baloo 2', cursive;color: rgb(240, 51, 199); ">${uname}</b>
                    <p style="font-size:3vh;padding:2vh; font-family: 'Acme', sans-serif;
                    ;">${desc}</p>
                    <input type="text" id="copyurl" style="display:none;" value="https://vigneshnu.herokuapp.com/swg.html"/>
                </div>



                <b id="replay" style="font-size:4vh; margin: 2vh auto; font-family: 'Roboto Slab', serif;background: linear-gradient(to top left, #00ff00 0%, #ffcc00 100%);padding: 12px 25px; border-radius: 12px; ">Replay</b>
                <div class="share" style="; max-height:40vh; width:80%;padding: 2vh;margin: 4vh auto; display: flex; flex-direction: column;align-items: center; background: linear-gradient(to left, #6666ff 0%, #ff3300 100%);border-radius: 12px;">
                    <b style="font-size:6vh;font-family: 'Roboto Slab', serif;padding: 8px 28px 18px 28px;font-size: 30px;  ">Share on</b>
                    <span>
                        <a onclick="copyFunc()"><img src="static/images/copy.png" alt=""style="height: 8vh;padding:5px; width: 8vh;padding:5px; border-radius: 12px;""></a>
                        <a href="mailto:?subject=Play Game&body=${text} ${link}"><img src="static/images/email.png" alt=""style=" height: 8vh;padding:5px; width: 8vh;padding:5px; border-radius: 12px;""></a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u= ${link}""><img src="static/images/facebook.png" alt="" style="height: 8vh;padding:5px; width: 8vh;padding:5px; border-radius: 12px;""></a>
                        <a href="https://api.whatsapp.com/send?text= ${text} ${link}"><img src="static/images/whatsapp.jpg" alt=""style=" height: 8vh;padding:5px; width: 8vh;padding:5px; border-radius: 12px;"></a>
                </span>
                </div>
                </div>`
    let game = document.getElementById("game").innerHTML
    document.getElementById('game').innerHTML = ""
    document.getElementById('end').innerHTML = endhtml
    document.getElementById('replay').addEventListener("click", () => {
        window.location.reload()
    })
}


function start(value, callback) {
    no = no - 1
    sysno = Math.ceil(0 + (6 - 3) * Math.random());
    system = document.getElementById('system')
    user = document.getElementById('user')
    fight = document.getElementById('fight')
    system.innerHTML = ""
    user.innerHTML = ""
    fight.innerHTML = ""
    document.getElementById("msg").innerHTML = ""
    document.getElementById("result").innerHTML = ""
    if (value == 1) {
        user.innerHTML = `<img src="static/images/snake.jpg" alt="snake">`
    } else if (value == 2) {
        user.innerHTML = `<img src="static/images/water.jpg" alt="water">`

    } else if (value == 3) {
        user.innerHTML = `<img src="static/images/gun.jpg" alt="gun">`

    }

    if (sysno == 1) {
        system.innerHTML = `<img src="static/images/snake.jpg" alt="snake" >`
    } else if (sysno == 2) {
        system.innerHTML = `<img src="static/images/water.jpg" alt="water">`

    } else if (sysno == 3) {
        system.innerHTML = `<img src="static/images/gun.jpg" alt="gun">`

    }
    userno = value
    rounds = document.getElementById('rounds')
    userScore = document.getElementById('userScore')
    systemScore = document.getElementById('systemScore')

    if (userno == "1" && sysno == "2") {
        console.log(`you sysno : ${userno} && system's sysno : ${sysno} `)
        console.log('You Win !')
        upt += 1
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/snake.jpg" alt="snake">`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        message = `Snake drank the water`
        result = `You Win !`
    } else if (userno == "1" && sysno == "3") {
        opt += 1
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/gun.jpg" alt="gun" >`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        message = `Gun shooted the Snake`
        result = `You Lost !`
    } else if (userno == "3" && sysno == "2") {
        opt += 1
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/water.jpg" alt="water" >`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        message = `gun lost in water`
        result = `You Lost !`
    } else if (userno == "3" && sysno == "1") {
        upt += 1
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/gun.jpg" alt="gun" >`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        message = `Gun kills the snake`
        result = `You Win !`
    } else if (userno == "2" && sysno == "3") {
        upt += 1
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/water.jpg" alt="water" >`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        message = `gun lost in water`
        result = `You Win !`
    } else if (userno == "2" && sysno == "1") {
        opt += 1
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/snake.jpg" alt="snake" >`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        message = `Snake drank the water`
        result = `You Lost !`
    } else if (userno == sysno) {
        upt += 1;
        opt += 1;
        setTimeout(() => {
            fight.innerHTML = `<img src="static/images/draw.jpg" alt="draw" >`
            rounds.innerText = `${ (totalNo + 1) - no}/${totalNo}`
            userScore.innerText = `${upt}`
            systemScore.innerText = `${opt}`
        }, 300);
        result = `Match draw`
        message = `Both gets one point`

    }
    setTimeout(() => {
        msg = document.getElementById('msg').innerHTML = `<p>${message}</p>`

    }, 500);
    setTimeout(() => {

        result = document.getElementById('result').innerHTML = `<p>${result}</p>`
    }, 800);

    if (no == 1) {
        document.getElementById('question').innerText = ""
        document.getElementById("home").innerHTML = ` <div class="flex" style="height:18vh;font-size: 8vh;">
        <strong style="font-family: fantasy; color: red;">Game Over</strong>
    </div>`
        let resmessage = ""
        let desc = ""
        if (opt < upt) {
            resmessage = "Congratulations"
            desc = `You won with ${upt-opt} points`

        } else if (upt < opt) {
            resmessage = "Better luck next time"
            desc = `You lose with ${opt-upt} points`

        } else {
            resmessage = "Match draw"
            desc = `both gets ${opt} points`

        }
        setTimeout(() => {

            end(resmessage, desc, start(1))
        }, 3000);
    }
}

water = document.getElementById('2').addEventListener('click', () => {
    start(2)
})
gun = document.getElementById('3').addEventListener('click', () => {
    start(3)
})
snake = document.getElementById('1').addEventListener('click', () => {
    start(1)
})