var ball = document.getElementById("ball");

ball.style.top = ball.offsetTop + "px";
ball.style.left = ball.offsetLeft + "px";

// If you want dynamic change in values of ball height and width uncomment the below 'onresize' code.
var ballHeight = ball.offsetHeight;
var ballWidth = ball.offsetWidth;

/*
window.onresize = function (e) {
    ballHeight = ball.offsetHeight;
    ballWidth = ball.offsetWidth;
};
*/



function setValue(value) {
    return value + "px";
}



// When using event.keyCode;
function keyCode(keyPress) {

    var top = parseInt(ball.style.top);//convert from string to int
    var left = parseInt(ball.style.left);

    // W is pressed
    if (keyPress === 119 || keyPress === 87) {
        if (top > 5) {
            ball.style.top = setValue(top - 5);
        }
    }

    // A is pressed
    else if (keyPress === 97 || keyPress === 65) {
        if (left > 5) {
            ball.style.left = setValue(left - 5);
        }
    }

    // S is pressed
    else if (keyPress === 115 || keyPress === 83) {
        if (top < (window.innerHeight - ballHeight) - 5) {
            ball.style.top = setValue(top + 5);
        }
    }

    // D is pressed
    else if (keyPress === 100 || keyPress === 68) {
        if (left < (window.innerWidth - ballWidth) - 5) {
            ball.style.left = setValue(left + 5);
        }
    }

};
window.addEventListener("keypress", function (event) {
//    code(event.code); //- You can use this
//    key(event.key); //- You can also use this
    keyCode(event.keyCode);
});