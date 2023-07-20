var displacement = require( "../factory/displacement" );
var tween = require( "../lib/tween" );

exports = displacement.create("images/logo.png", 288, 135, 17, -182, 17, 1, tween.exponential.co, 1e3);