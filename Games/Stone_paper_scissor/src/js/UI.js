const $playerScore = document.querySelector('#score1');
const $playerVideo = document.querySelector('#player-video');
const $playerHand = document.querySelector('#player-hand');

const $robotScore = document.querySelector('#score2');
const $robotImage = document.querySelector('#robot'); 
const $robotHand = document.querySelector('#robot-hand');

const $statusText = document.querySelector('#message');

const $timerRing = document.querySelector('#timer-ring');
const $timerRingCircle = document.querySelector('#timer-ring-circle');
const radius = $timerRingCircle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;


export const UI = {

    init: function() {

        this.initTimerCircle();
        this.showTimer(false);

        // preload some images
        (new Image()).src = "assets/rock.png";
        (new Image()).src = "assets/paper.png";
        (new Image()).src = "assets/scissors.png";
    },

    initTimerCircle: function() {
        $timerRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        $timerRingCircle.style.strokeDashoffset = `${circumference}`;
    },

    setStatusMessage: function(message) {
        $statusText.textContent = message;
    },
    
    startAnimateMessage: function() {
        $statusText.classList.add("fade-in-out");
    },
    
    stopAnimateMessage: function() {
        $statusText.classList.remove("fade-in-out");
    },
    
    startCountdown: async function() {
        return new Promise(resolve => {
            this.setStatusMessage("On your marks!");
            setTimeout(() => { this.setStatusMessage("Ready"); }, 1000);
            setTimeout(() => { this.setStatusMessage("Show your hand!!"); resolve(); }, 2000);
        });
    },

    showTimer: function(show) {
        $timerRing.style.visibility = (show ? 'visible' : 'hidden');
    },

    setTimerProgress: function(percent) {
        const offset = circumference - percent * circumference;
        $timerRingCircle.style.strokeDashoffset = offset;
    },

    setPlayerHand: function(gesture) {
        switch(gesture) {
            case 'rock': $playerHand.textContent = "✊"; break;
            case 'paper': $playerHand.textContent = "🤚"; break;
            case 'scissors': $playerHand.textContent = "✌"; break;
            default: $playerHand.textContent = ""; break;
        }
    },

    setPlayerScore: function(score) {
        $playerScore.textContent = score;
    },
    
    setRobotScore: function(score) {
        $robotScore.textContent = score;
    },

    animatePlayerHand: function() {
        $playerHand.classList.add("player-hand-zoom");
        setTimeout(() => { $playerHand.classList.remove("player-hand-zoom"); }, 1000);
    },

    showRobotImage: function(show) {
        $robotImage.style.display = (show ? 'block' : 'none');
        $robotHand.style.display = (show ? 'none' : 'block');
    },

    showRobotHand: function(show) {
        $robotHand.style.display = (show ? 'block' : 'none');
        $robotImage.style.display = (show ? 'none' : 'block');
    },

    setRobotGesture: function(gesture) {
        switch(gesture) {
            case 'rock': $robotHand.src = "assets/rock.png"; break;
            case 'paper': $robotHand.src = "assets/paper.png"; break;
            case 'scissors': $robotHand.src = "assets/scissors.png"; break;
            default: $robotHand.src = ""
        }
    },

    initPlayerVideo: async function(constraints) {

        // get cam video stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        $playerVideo.srcObject = stream;
    
        return new Promise(resolve => {
            $playerVideo.onloadedmetadata = () => {
                $playerVideo.onloadeddata = () => {
                    resolve($playerVideo);
                };
            };
        });
    },

    isMobile: function() {
        // remember kids: this is super unreliable
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
}