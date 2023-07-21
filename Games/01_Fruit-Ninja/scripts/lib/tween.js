exports.exponential = function(){};
exports.exponential.co = function(index, offset, target, framesNum){ return (index == framesNum) ? offset + target : target * (-Math.pow(2, -10 * index / framesNum) + 1) + offset; };
// exports.exponential.ci = function(index, offset, target, framesNum){ return (index == 0) ? offset : target * Math.pow(2, 10 * (index / framesNum - 1)) + offset; }

exports.bounce = function(){};
exports.bounce.co = function(index, offset, target, framesNum){ if((index /= framesNum) < (1 / 2.75)) return target * (7.5625 * index * index) + offset; else if(index < (2 / 2.75)) return target * (7.5625 * (index -= (1.5 / 2.75)) * index + .75) + offset; else if(index < (2.5 / 2.75)) return target * (7.5625 * (index -= (2.25 / 2.75)) * index + .9375) + offset; else return target * (7.5625 * (index -= (2.625 / 2.75)) * index + .984375) + offset; };

exports.quadratic = function(){};
exports.quadratic.ci = function(index, offset, target, framesNum){ return target * (index /= framesNum) * index + offset; };
exports.quadratic.co = function(index, offset, target, framesNum){ return - target * (index /= framesNum) * (index - 2) + offset; }
exports.quadratic.cio = function(index, offset, target, framesNum){ if((index /= framesNum / 2) < 1) return target / 2 * index * index + offset; else return - target / 2 * ((-- index) * (index - 2) - 1) + offset; };

exports.circular = function(index, offset, target, framesNum){ if((index /= framesNum / 2) < 1) return - target / 2 * (Math.sqrt(1 - index * index) - 1) + offset; else return target / 2 * (Math.sqrt(1 - (index -= 2) * index) + 1) + offset; }

exports.linear = function(index, offset, target, framesNum){ return target * index / framesNum + offset; };

exports.back = function(){};
exports.back.ci = function(index, offset, target, framesNum, s){ s = 1.70158; return target * (index /= framesNum) * index * ((s + 1) * index - s) + offset; };
exports.back.co = function(index, offset, target, framesNum, s){ s = 1.70158; return target * ((index = index / framesNum - 1) * index * ((s + 1) * index + s) + 1) + offset; };