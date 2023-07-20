exports.unsetObject = function( object ){
	for(var i in object)
	    if(object.hasOwnProperty(i) && typeof object[i] == "function")
	    	object[i] = function(){};
};

exports.getAngleByRadian = function( radian ){
	return radian * 180 / Math.PI;
}

exports.pointToRadian =	function( origin, point ){
	var PI = Math.PI;
	
	if( point[0] === origin[0] ){
		if ( point[1] > origin[1] )
			return PI * 0.5;
		return PI * 1.5
	}else if( point[1] === origin[1] ){
		if ( point[0] > origin[0] )
			return 0;
		return PI;
	}

	var t = Math.atan( ( origin[1] - point[1] ) / ( origin[0] - point[0] ) );

	if( point[0] > origin[0] && point[1] < origin[1] )
		return t + 2 * PI;

	if( point[0] > origin[0] && point[1] > origin[1] )
		return t;

	return t + PI;
}