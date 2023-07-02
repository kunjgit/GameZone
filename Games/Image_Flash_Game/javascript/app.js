var counter = 10;

var correct_answer = false;

var buttons_block = ['<button id="button1" class="button" data-button-id="1">A</button>', '<button id="button2" class="button" data-button-id="2">B</button>', '<button id="button3" class="button" data-button-id="3">C</button>', '<button id="button4" class="button" data-button-id="4">D</button>'];

//  Variable that will hold our interval ID when we execute
//  the "run" function
var intervalId, showImage;

// Links to images in this image array.
var questions = [
    {
        question: "Which Coding Platform was founded in 2015 in the heart of Silicon Valley?",
        choices: ["CodeChef", "Codeforces", "HackerRank", "LeetCode"],
        answer: '4',
        image: "./assets/images/1.jpg"

    },
    {
        question: "It is most well known for its enterprise Linux and virtualization products",
        choices: ["VS Code", "Red Hat", "Parrot", "Windows"],
        answer: '2',
        image: "./assets/images/2.jpg"
    },
    {
        question: "A DNA microarray is also called a DNA ______ .",
        choices: ["Circuit", "Fan", "Chip", "Device"],
        answer: '3',
        image: "./assets/images/3.jpg"

    },
    {
        question: "The first Android-powered device from Samsung Mobile",
        choices: ["Samsung Galaxy", "Samsumg Xperia", "Vivo 1902", "Samsung Galaxy 2"],
        answer: '1',
        image: "./assets/images/4.jpg"

    },
    {
        question: "Andy Rubin is known as one of the three founders of what massively popular cell phone operating system?",
        choices: ["Flutter", "SUSE", "Android", "OScloud"],
        answer: '3',
        image: "./assets/images/5.jpg"

    },
    {
        question: "What company providing hosting for software development and distributed version control familiar to computer programmers",
        choices: ["Git", "Instagram", "Github", "IBM"],
        answer: '3',
        image: "./assets/images/6.jpg"

    },
    {
        question: "ChipTest, Hydra, Deep Blue, and HiTech are all computers or computer programs developed to play what?",
        choices: ["Carrom", "Sudoku", "Pinball", "Chess"],
        answer: '4',
        image: "./assets/images/7.jpg"

    },
    {
        question: "Most Used Language for Web Development?",
        choices: ["Java", "Javascript", "Python", "Ruby"],
        answer: '2',
        image: "./assets/images/8.jpg"
    },
    {
        question: "The “Big Four” in the tech industry are Google (Alphabet), Apple, Meta (Facebook), and Amazon. Which corporation known for computers, software, and Bill Gates(GAMAF)",
        choices: ["Facebook", "Google", "Microsoft", "Twilio"],
        answer: '3',
        image: "./assets/images/9.jpg"

    },
    {
        question: "Which social media platform is launched in 2010?",
        choices: ["Instagram", "Twitter", "Telegram", "Facebook"],
        answer: '1',
        image: "./assets/images/10.jpg"
    }
];

// Count will keep track of the index of the currently displaying photo
var index = 0;

var correct = 0;
var incorrect = 0;
var missed = 0;

var bg_music, sound_effect;

$("#image-holder").hide();

// TODO: Use jQuery to run "startSlideshow" when we click the "start" button.
$(".start").click(function () {
    $("iframe").remove();
    $("#question").empty();
    $("#message").empty();
    $("#play").empty();
    $(".start").remove();

    startSlideshow();
});

function startSlideshow() {
    displayImage();
    // TODO: Use showImage to hold the setInterval to run nextImage.
    showImage = setInterval(displayImage, 1000 * 18);
}

// This function will replace display whatever image it's given in the 'src' attribute of the img tag.
function displayImage() {
    $("#image-holder").show();
    sound_effect = new sound("./assets/audio/polaroid-camera-take-picture.mp3");
    sound_effect.play();

    $("#image-holder").html("<img src='" + questions[index].image + "'>");

    setTimeout(display, 7000);
}

function display() {
    $("#image-holder").hide();
    sound_effect = new sound("./assets/audio/countdown.mp3");
    sound_effect.play();
    $("#question").append(questions[index].question);
    for (let i = 0; i < questions[index].choices.length; i++) {
        $(".buttons").append(buttons_block[i]);
        $(".buttons").append("<h2 id='choice" + (i + 1) + "'>" + questions[index].choices[i] + "</h2><br>");
    }

    run();

    $(".button").click(function () {
        sound_effect.stop();
        var buttonID = $(this).attr("data-button-id");
        $("#question").empty();
        if (buttonID === questions[index].answer) {
            correct_answer = true;
            stop();
        } else
            stop();
    });

}

function run() {
    intervalId = setInterval(decrement, 1000);
}

//  The decrement function.
function decrement() {

    //  Decrease counter by one.
    counter--;
    //  Show the counter in the #show-counter tag.
    $("#show-counter").html("<h2>0:0" + counter + "</h2>");
    //  Once counter hits zero...
    if (counter === 0) {
        // run the stop function.
        stop();

    }
}

//  The stop function
function stop() {
    $("#show-counter").empty();
    clearInterval(intervalId);
    clearInterval(showImage);

    if (correct_answer) {
        sound_effect = new sound("./assets/audio/rightanswer.mp3");
        sound_effect.play();
        message2();
        correct_answer = false;
    } else {
        if (counter === 0)
            message1();
        else {
            sound_effect = new sound("./assets/audio/Wrong-answer-sound-effect.mp3");
            sound_effect.play();
            message3();
        }

    }

    counter = 10;

    if (index === questions.length)
        setTimeout(startover, 3000);
    else
        setTimeout(startSlideshow, 3000);
}

function message1() {
    $("#question").empty();
    $("#message").text('Time is up! The correct answer is: ');
    for (let i = 0; i < questions[index].choices.length; i++) {
        if (questions[index].answer != i + 1) {
            $("#button" + (i + 1)).remove();
            $("#choice" + (i + 1)).remove();
        }
    }
    missed++;
    index++;
    setTimeout(clear_display, 2000);
}

function message2() {
    $("#message").html('Your answer is correct!');
    for (let i = 0; i < questions[index].choices.length; i++) {
        if (questions[index].answer != i + 1) {
            $("#button" + (i + 1)).remove();
            $("#choice" + (i + 1)).remove();
        }
    }
    correct++;
    index++;
    setTimeout(clear_display, 2000);
}

function message3() {
    $("#question").empty();
    $("#message").text('Your answer is incorrect! The correct answer is: ');
    for (let i = 0; i < questions[index].choices.length; i++) {
        if (questions[index].answer != i + 1) {
            $("#button" + (i + 1)).remove();
            $("#choice" + (i + 1)).remove();
        }
    }
    incorrect++;
    index++;
    setTimeout(clear_display, 2000);
}

function startover() {
    $(".bg").append('<iframe src="assets/audio/Elevator-music.mp3" allow="autoplay" style="display:none" id="iframeAudio"></iframe>');
    $("#image-holder").empty();
    $("#question").text("GAME OVER!");
    $("#message").append("Here is your score - " + "<br>");
    $("#message").append("<p>Correct: " + correct + "</p");
    $("#message").append("<p>Incorrect: " + incorrect + "</p");
    $("#message").append("<p>Timed Out: " + missed + "</p");
    $("#play").text("Wanna give it another go?");
    $(".left-div").append('<button class="button start animated lightSpeedIn delay-1s">START</button>');

    index = 0;
    correct = 0;
    incorrect = 0;
    missed = 0;
    correct_answer = false;

    $(".start").click(function () {
        $("iframe").remove();
        $(".left-div").empty();
        $(".left-div").append('<p id="question"></p>');
        $(".left-div").append('<p id="message"></p>');
        $(".left-div").append('<div class="buttons"></div>');
        $(".left-div").append('<div id="show-counter"></div>');
        $(".left-div").append('<p id="play" class="animated lightSpeedIn delay-2s"></p>');

        startSlideshow();
    });
}

function clear_display() {
    $("#message").empty();
    $(".buttons").empty();
}

//help with sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}