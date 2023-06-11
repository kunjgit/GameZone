function SubtitleView(model) {
    this.model = model;
    LateRunner.events.on('render', this.render, this);
    this.element = document.getElementById('subtitles');
}

SubtitleView.prototype = {
    render: function() {
        this.element.innerHTML = this.model.currentSubtitle;
    }
};