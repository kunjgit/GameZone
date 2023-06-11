 /*
    The Layers Class -- A Class that generates a bunch on canvas elements, and contains methods to access them.
     */
    var Layers = function (container, names, width, height) {
        var i = 0,
        len = names.length,
        can,
        con,
        t = this;

        // this.canvas, and this.context store references to each layer's canvas DOM, and 2d drawing context
        t.canvas = [];
        t.context = [];
        t.width = width;
        t.height = height;
        t.layerNames = {};
        while (i < len) {
            can = document.createElement('canvas');
            can.style.position = 'absolute';
            con = can.getContext('2d');
            can.width = width;
            can.height = height;

            document.getElementById(container).appendChild(can);
            t.canvas.push(can);
            t.context.push(con);

            t.layerNames[names[i]] = i;

            i+=1;
        }
    };

    Layers.prototype = {
        /*
        Layers.get(indexOrName, what) -- get a layers canvas DOM, or 2d context by index or layer name

        arguments:

        lay -- give a layer number to get by index, or a string to get by layer name

        what -- 'context', or 'canvas' default is context

        ex:

        var context = layers.get('background'); // returns the context of the layer 'background'

        var canvas = layers.get(3,'canvas'); // returns the forth layer's canvas DOM
         */
        get : function (lay, what) {
            if (what === undefined){
                what = 'context'; // get context by default
			}

            if (typeof lay === 'number') { // if number assume index number
                return this[what][lay];
            }

            if (typeof lay === 'string') { // if string assume layer name, and use Layers.layerNames to find the index number
                return this[what][this.layerNames[lay]];
            }

        }
    };