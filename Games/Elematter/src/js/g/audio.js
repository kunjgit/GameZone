/*==============================================================================

Audio

==============================================================================*/

g.audio.sounds = {};

g.audio.add = function( key, count, settings ) {
	g.audio.sounds[ key ] = [];
	settings.forEach( function( elem, index ) {
		g.audio.sounds[ key ].push( {
			tick: 0,
			count: count,
			pool: []
		} );
		while( count-- ) {
			var audio = new Audio();
			audio.src = jsfxr( elem );
			g.audio.sounds[ key ][ index ].pool.push( audio );
		}
	}, this );
};

g.audio.play = function( key ) {
	var sound = g.audio.sounds[ key ];
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	soundData.pool[ soundData.tick ].play();
	if( soundData.tick < soundData.count - 1 ) {
		soundData.tick++;
	} else {
		soundData.tick = 0;
	}
};