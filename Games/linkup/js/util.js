var log = console.log.bind(console);
var $ = function(elem){
    return document.querySelectorAll(elem);
};
var random = function(start,end){
    start = start === void 0 ? 0 : start;
    end = end === void 0 ? 1 : end;
    end = end + 1;
    var rand = Math.random() * (end - start) + start;
    return Math.floor(rand);
};
var on = function(elem,type,callback,status){
    elem.addEventListener(type,function(e){
        callback(e);
        if (status) {
            return false;
        }
    });
};

var css = function(elem,styleObj){
    for (var i in styleObj){
        elem.style[i] = styleObj[i];
    }
};
var getLocalStorage = function(key){
    return localStorage[key] ?
    JSON.parse(localStorage[key]) : null;
}

var toNdimension = function(arr,num){
    var new_arr = [];
    for (var i=0; i<arr.length; i+=num){
        new_arr.push(arr.slice(i,i+num));
    }
    return new_arr;
}

function reduceDimension(arr) {
    return Array.prototype.concat.apply([], arr);
}