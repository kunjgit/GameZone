function Painter(element) {
    this.element = element;
    this.paintClass = 'painted';
    this.npcPaintClass = 'npc-painted';
}

Painter.prototype.paint = function() {
    var Painter = this;

    Painter.removePaint(Painter.npcPaintClass);

    if (Util.doesntHaveClass(Painter.element.parentElement, Painter.paintClass)) {
        Painter.element.parentElement.className += ' ' + Painter.paintClass;
    }
};

Painter.prototype.removePaint = function(paintClass) {
    Util.removeClass(this.element.parentElement, paintClass);
};

Painter.prototype.npcPaint = function() {
    var Painter = this;

    Painter.removePaint(Painter.paintClass);

    if (Util.doesntHaveClass(Painter.element.parentElement, Painter.npcPaintClass)) {
        Painter.element.parentElement.className += ' ' + Painter.npcPaintClass;
    }
};

Painter.prototype.isPaintable = function (element, character) {
    var Painter = this;
    var paint;

    if (character instanceof Npc) {
        paint = Painter.npcPaintClass;
    }

    if (character instanceof Player) {
        paint = Painter.paintClass;
    }

    return Util.doesntHaveClass(element, paint);
};
