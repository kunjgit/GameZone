game.HtmlHeader3 = me.Renderable.extend({

    init : function($parent, header){

        this.$div = $('<div class="html-flex"></div>');
        this.$label = $('<h3>' + header + '</h3>');

        $parent.append(this.$div);
        this.$div.append(this.$label);
    },
    destroy : function () {
        this.$div.remove();
        this.$label.remove();
    },
})
game.HtmlTextInput = me.Renderable.extend({

    init : function ($parent, label, type, length) {

        this.$div = $('<div class="html-flex"></div>');
        this.$label = $('<span>' + label + '</span>').css({"padding-right": "10px"});
        this.$input = $('<input class="html-input" type="' + type + '" required>');

        switch (type) {
            case "text":
                this.$input
                    .attr("maxlength", length)
                    .attr("pattern", "[a-zA-Z0-9_\-]+");
                break;
            case "number":
                this.$input.attr("max", length);
                break;
        }

        $parent.append(this.$div);
        this.$div.append(this.$label);
        this.$div.append(this.$input);
        this.$input.focus();
    },

    destroy : function () {
        this.$input.remove();
        this.$label.remove();
        this.$div.remove();
    },

    getInputValue : function () {
        return this.$input.val();
    }
});