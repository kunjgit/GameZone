function TimerView(model) {
    this.model = model;
    LateRunner.events.on('render', this.render, this);
    this.element = document.getElementById('timer');
}

TimerView.prototype = {
    render: function() {
        this.element.innerHTML = LateRunner.timerController.getTimeLeftAsString();
    }
}