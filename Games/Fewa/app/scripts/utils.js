(function () {
    "use strict";

    game.obj = {
        extend: (function () {
            var hasOwn = Object.prototype.hasOwnProperty,
                toStr = Object.prototype.toString,
                isPlainObject = function (obj) {

                    if (!obj || toStr.call(obj) !== '[object Object]') {
                        return false;
                    }

                    var has_own_constructor = hasOwn.call(obj, 'constructor'),
                        has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');

                    // Not own constructor property must be Object
                    if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
                        return false;
                    }

                    // Own properties are enumerated firstly, so to speed up,
                    // if last one is own, then all properties are own.
                    var key;
                    for (key in obj) {
                    }

                    return key === undefined || hasOwn.call(obj, key);
                };

            return function extend() {

                var options, name, src, copy, copyIsArray, clone,
                    target = arguments[0],
                    i = 1,
                    length = arguments.length,
                    deep = false;

                // Handle a deep copy situation
                if (typeof target === 'boolean') {
                    deep = target;
                    target = arguments[1] || {};
                    // skip the boolean and the target
                    i = 2;
                } else if ((typeof target !== 'object' && typeof target !== 'function') || target === null) {
                    target = {};
                }

                for (; i < length; ++i) {
                    options = arguments[i];
                    // Only deal with non-null/undefined values
                    if (options !== null) {
                        // Extend the base object
                        for (name in options) {
                            src = target[name];
                            copy = options[name];

                            // Prevent never-ending loop
                            if (target === copy) {
                                continue;
                            }

                            // Recurse if we're merging plain objects or arrays
                            if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && Array.isArray(src) ? src : [];
                                } else {
                                    clone = src && isPlainObject(src) ? src : {};
                                }

                                // Never move original objects, clone them
                                target[name] = extend(deep, clone, copy);

                                // Don't bring in undefined values
                            } else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }

                // Return the modified object
                return target;
            };
        })()
    };

    game.obj.extend(true, game, {

        vendor: {
            prefixes: ['', 'ms', 'webkit', 'moz', 'o'],
            get: function (prop) {
                var name, i;
                for (i = 0; i < this.prefixes.length; i++) {
                    name = this.prefixes[i] + (this.prefixes[i] === '' ? prop : prop.charAt(0).toUpperCase() + prop.slice(1));
                    if (typeof document.body.style[name] !== 'undefined') {
                        return name;
                    }
                }
                return null;
            }
        },

        dom: {
            get: function (id) {
                return document.getElementById(id);
            },
            create: function (n) {
                return document.createElement(n);
            }
        },

        arr: {
            create: function (n, v) {
                var arr = [],
                    val;
                for (var i = 0; i < n; i += 1) {
                    val = typeof v === 'undefined' ? [] : v;
                    arr.push(val);

                }
                return arr;
            },
            move: function (arr, from, to) {
                arr[from] = arr.splice(to, 1, arr[from])[0];
            },
            loop: function (arr, cb, context) {
                var len = arr.length,
                    i = 0;
                for (; i < len; i += 1) {
                    cb.call(context || null, arr[i], i);
                }
            }
        },

        rand: {
            intg: function (max) {
                return Math.random() * (max || 0xfffffff) | 0;
            },
            flot: function () {
                return Math.random();
            },
            bool: function () {
                return Math.random() > 0.5;
            },
            range: function (min, max) {
                return game.rand.intg(max - min) + min;
            },
            rangef: function (min, max) {
                return game.rand.flot() * (max - min) + min;
            },
            select: function (source) {
                return source[game.rand.range(0, source.length)];
            }
        },

        PI2: Math.PI * 2,
        RAD: Math.PI / 180,
        DEG: 180 / Math.PI,

        noop: function () {
        },

        line: function (c, x1, y1, x2, y2, col, lw) {
            c.strokeStyle = col;
            c.lineWidth = lw;
            c.beginPath();
            c.moveTo(x1, y1);
            c.lineTo(x2, y2);
            c.stroke();
        },
        rect: function (c, x, y, w, h, r, col, lw, fillcolor, glow) {
            x += lw;
            w -= lw * 2;
            y += lw;
            h -= lw * 2;
            c.beginPath();
            c.strokeStyle = col;
            c.lineWidth = lw;
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y);
            c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r);
            c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h);
            c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r);
            c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
            c.stroke();
            if (fillcolor) {
                c.fillStyle = fillcolor;
                c.fill();
            }
            if (glow) {
                game.rect(c, x - lw, y - lw, w + lw * 2, h + lw * 2, r * 1.2, glow, lw / 2);
            }
        },
        sine: function (c, x1, y1, x2, y2, col, lw) {
            var xc = (x1 + x2) / 2,
                yc = (y1 + y2) / 2;

            c.strokeStyle = col;
            c.lineWidth = lw;
            c.beginPath();
            c.moveTo(x1, y1);
            c.bezierCurveTo(x1, y1, xc / 2, yc * 1.5, xc, yc);
            c.bezierCurveTo(xc * 1.5, yc / 2, x2, y2, x2, y2);
            c.stroke();
        }
    });
})();
