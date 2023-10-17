let hours = 0;
let minutes = 0;
let seconds = 0;
let timerInterval;

function updateTimer() {
  // Increment the seconds
  seconds++;
  if (seconds == 60) {
    // Increment the minutes and reset the seconds
    seconds = 0;
    minutes++;
    if (minutes == 60) {
      // Increment the hours and reset the minutes
      minutes = 0;
      hours++;
    }
  }

  // Format the time
  let time = "";
  if (hours > 0) {
    time += ("0" + hours).slice(-2) + ":";
  }
  if (minutes > 0 || hours > 0) {
    time += ("0" + minutes).slice(-2) + ":";
  }
  time += ("0" + seconds).slice(-2);

  // Remove leading zeros and colons for values that are 0
  time = time.replace(/^00:/, "").replace(/^0/, "");

  // Display the time
  let timerElement = document.getElementById("timer");
  timerElement.textContent = "Simulation Time: " + time;
}

// Update the timer every second
timerInterval = setInterval(updateTimer, 1000);

// Pause the timer when the page is not focused
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    clearInterval(timerInterval);
  } else {
    timerInterval = setInterval(updateTimer, 1000);
  }
});

// Reset the timer on click of the button with id "reset-timer"
document.getElementById("reset-timer").addEventListener("click", function () {
  hours = 0;
  minutes = 0;
  seconds = 0;
  updateTimer();
});
