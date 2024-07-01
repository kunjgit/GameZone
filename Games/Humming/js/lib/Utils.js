(function(root) {

    var Utils = (function()
    {
        var lastGuid = 0;

        var getGuid = function()
        {
            lastGuid += 1;
            return lastGuid;
        };

        var getRandomInt = function(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var getRandomColor = function(saturation, lightness)
        {
            var hue = getRandomInt(1, 360); // pick a random hue

            return { hue: hue, saturation: saturation, lightness: lightness };
        };

        var removeObjFromArray = function(arr, obj)
        {
            for (var i = 0, l = arr.length; i < l; i++) {
                if ( arr[i].id === obj.id ) {
                    arr.splice(i, 1);
                    return true;
                }
            }

            return false;
        };

        var sortByZIndex = function(a, b)
        {
            return (a.zIndex - b.zIndex);
        };

        var secondsToTime = function(secs)
        {
            var sec_numb = parseInt(secs, 10);
            var hours   = Math.floor(sec_numb / 3600);
            var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
            var seconds = sec_numb - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}

            return {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
        };

        var getHSLString = function(hsl)
        {
            return "hsl(" + hsl.hue + ", " + hsl.saturation + "%, " + hsl.lightness + "%)";
        };

        return {
            getGuid: getGuid,
            getRandomInt: getRandomInt,
            getRandomColor: getRandomColor,
            removeObjFromArray: removeObjFromArray,
            sortByZIndex: sortByZIndex,
            secondsToTime: secondsToTime,
            getHSLString: getHSLString
        };

    })();

    root.Utils = Utils;

})(window);