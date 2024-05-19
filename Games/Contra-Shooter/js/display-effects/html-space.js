/* types

   1 -> full
   2 -> top half
   3 -> middle half
   4 -> bottom half
*/

game.HtmlSpace = me.Renderable.extend({

    init : function (type, options) {

        type = type || 1;
        options = options || {};
        var background = options.background || null;
        var ht = options.height || '50%';

        switch (type){

            case 1 :
                this.cssVals = {height: "100%"};
                break;

            case 2 :
                this.cssVals = {top: "25%", height: "50%"};
                break;

            case 3 :
                this.cssVals = {top: "50%", height: "50%"};
                break;

            case 4 :
                this.cssVals = {top: "75%", height: "50%"};
                break;
        }
        if(background) this.cssVals["background"] = background;
        this.cssVals["width"] = "50%";

        this.$htmlspace = $('<div class="html-space">').css(this.cssVals);
        $(me.video.getWrapper()).append(this.$htmlspace);
    },

    destroy : function () {
        this.$htmlspace.remove();
    },
});