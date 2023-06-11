    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function () {
            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                window.setTimeout(callback, 1000 / 60);

            };

        }
            ());
    }


var Shell = {
        /*
        Shell.distance
        -- the distance formula

         */
        distance : function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        },
        /*
        Shell.boundingBox
        -- bounding box collision detection

         */
        boundingBox : function (x1, y1, w1, h1, x2, y2, w2, h2) {
            var o = false; // default to false
            if ((x1 > x2 + w2) || (x1 + w1 < x2) || (y1 + h1 < y2) || (y1 > y2 + h2)) { // if the two objects do not overlap
                o = false; //then they do not overlap
            } else {
                o = true; // else they do
            }
            return o; // return the boolean answer
        },
        /*
        Shell.per
        -- simple percent function

        l - low
        h - high
         */
        per : function (l, h) {
            return l * 100 / h;
        },
        /*
        Shell.findAngles
        -- find the angles that are between a currentHeading and a targetHeading to know which
        is the shorter distance to move when changing a heading.

        ch -- current heading
        th -- target heading
         */
        findAngles : function (ch, th) {
            var angles = {};
            angles.clock = ch - th;
            angles.counter = th - ch;
            if (angles.clock < 0) {
                angles.clock += Math.PI * 2;
            }
            if (angles.counter < 0) {
                angles.counter += Math.PI * 2;
            }
            //if(angle1 < angle2){ return true}else{return false};
            return angles;
        },
        /*
        Shell.bind
        -- use to bind event handlers to an Element

         */
        bind : function (el, eventName, eventHandler) {
            if (el.addEventListener) {
                el.addEventListener(eventName, eventHandler, false);
            } else {
                if (el.attachEvent) {
                    el.attachEvent('on' + eventName, eventHandler);
                }
            }
        },
        rnd : function (n) {
            return Math.random() * n;
        },
        rRnd : function (n) {
            return Math.round(this.rnd(n));
        }
    };