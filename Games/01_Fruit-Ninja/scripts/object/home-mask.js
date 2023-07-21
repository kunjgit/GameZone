var displacement = require( "../factory/displacement" );
var tween = require( "../lib/tween" );

exports = displacement.create("images/home-mask.png", 640, 183, 0, -183, 0, 0, tween.exponential.co, 1e3);