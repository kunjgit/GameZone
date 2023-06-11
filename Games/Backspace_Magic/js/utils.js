var utils = (function() {
    
    // https://stackoverflow.com/a/966938
    // let createArray = function (length) {
    //   let arr = new Array(length || 0),
    //       i = length;
    
    //   if (arguments.length > 1) {
    //       let args = Array.prototype.slice.call(arguments, 1);
    //       while(i--) arr[length - 1 - i] = createArray.apply(this, args);
    //   }
    
    //   return arr;
    // };
    
    // https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
    let sprintf = function () {
        let args = arguments,
        string = args[0],
        i = 1;
        return string.replace(/%((%)|s|d)/g, function (m) {
            // m is the matched format, e.g. %s, %d
            let val = null;
            if (m[2]) {
                val = m[2];
            } else {
                val = args[i];
                // A switch statement so that the formatter can be extended. Default is %s
                switch (m) {
                    case '%d':
                        val = parseFloat(val);
                        if (isNaN(val)) {
                            val = 0;
                        }
                        break;
                }
                i++;
            }
            return val;
        });
    };
    
    // let getCenterObjectOrgin = function(parentValue, childValue) {
    //     return (parentValue - childValue) / 2;
    // };

    // let mixColor = function(mainColor, mixColor, mixRatio) {        
    //     let mainR = parseInt("0x" + mainColor.substring(1, 3));
    //     let mainG = parseInt("0x" + mainColor.substring(3, 5));
    //     let mainB = parseInt("0x" + mainColor.substring(5, 7));

    //     let mixR = parseInt("0x" + mixColor.substring(1, 3));
    //     let mixG = parseInt("0x" + mixColor.substring(3, 5));
    //     let mixB = parseInt("0x" + mixColor.substring(5, 7));

    //     let r = Math.floor(mainR * (1 - mixRatio) + mixR * mixRatio);
    //     let g = Math.floor(mainG * (1 - mixRatio) + mixG * mixRatio);
    //     let b = Math.floor(mainB * (1 - mixRatio) + mixB * mixRatio);

    //     return "rgb(" + [r, g, b].join(',') + ")";
    // };

    let stringSplice = function(str, index, count = 1) {
        if (index >= 0 && index <= str.length - 1) {
            return str.slice(0, index) + str.slice(index + count);
        }
        else {
            return str;
        }
    };

    let clamp = function(num, min, max) {
        return Math.min(Math.max(num, min), max);
    };

    return {
        //createArray: createArray,
        sprintf: sprintf,
        //getCenterObjectOrgin: getCenterObjectOrgin,
        //mixColor: mixColor,
        stringSplice: stringSplice,
        clamp: clamp
    };
})();







