var Util = function() {
    return {
        // == Get the child index from an array of children elements.
        childIndex: function(child, children) {
            var numberOfChildren = children.length;
            for (var i = 0; i < numberOfChildren; ++i) {
                if (child === children[i]) {
                    return i;
                }
            }
        },

        // == Check if an element has a given class name.
        hasClass: function(element, className) {
            return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
        },

        // == Check if an element doesn't have a given class.
        doesntHaveClass: function(element, className) {
            var Util = this;
            return ! Util.hasClass(element, className);
        },

        // == Get a random item from an array.
        randomItem: function(array) {
            var Util = this;
            return array[Util.randomNumber(array.length)];
        },

        // == Remove a class from an element.
        removeClass: function(element, className) {
            var Util = this;
            if (Util.hasClass(element, className)) {
                element.classList.remove(className);
            }
        },

        // == Shuffle an array. Taken from: http://stackoverflow.com/a/6274381
        shuffleArray: function(a) {
            var Util = this;
            var j, x, i;

            for (i = a.length; i; i--) {
                j = Util.randomNumber(i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }

            return a;
        },

        randomNumber: function(num) {
            var number = Math.floor(Math.random() * num);
            
            if (number === 0) {
                return 1;
            }

            return number;
        }
    }
}();