function Clock(clockElement, timeLimit, increment, stopAt, stopAction, suffix, warning, warningAction, beforeStopAction ) {
    this.element = document.getElementById(clockElement);
    this.timeLimit = timeLimit;
    this.increment = increment;
    this.stopAt = stopAt;
    this.stopAction = stopAction;
    this.suffix = suffix;
    this.warning = warning;
    this.warningAction = warningAction;
    this.beforeStopAction = beforeStopAction;

    this.beforeStopAt = stopAt + increment;
    this.running;

    this.timeLeft = timeLimit;
}

Clock.prototype.start = function() {
    var Clock = this;
    
    Clock.running = setInterval(function() {
        Clock.runClock();
    }, Clock.increment);
}; 

Clock.prototype.runClock = function() {
    var Clock = this;

    Clock.timeLeft -= Clock.increment;
    Clock.element.innerHTML = "<span class=\"clock-time\">" + (Clock.timeLeft / Clock.increment)  + Clock.suffix + "</span>";
    
    // == Apply a warning CSS class to the clock.
    if (Clock.timeLeft === Clock.warning) {
        Clock.element.className += " clock-warning";
        
        if (typeof Clock.warningAction === "function") {
            Clock.warningAction();
        }
    }

    // == Callback to execute one increment before clock stops.
    if (typeof Clock.beforeStopAction === "function") {
        if (Clock.timeLeft === (Clock.beforeStopAt)) {
            Clock.beforeStopAction();
        }
    }

    // == Stop the clock.
    if (Clock.timeLeft === Clock.stopAt) {
        Clock.stopClock();
    }
};

Clock.prototype.stopClock = function() {
    var Clock = this;

    // == Stop the timer.
    clearInterval(Clock.running);

    // == Apply CSS classes.
    Util.removeClass(Clock.element, "clock-warning");
    Clock.element.className += " clock-stop";

    // == Callback to execute when we stop the clock.
    if (typeof Clock.stopAction === "function") {
        Clock.stopAction();
    }

    // == Reset the clock.
    Clock.timeLeft = Clock.timeLimit;
};