const Easing = {

  Power: {

    In: power => {

      power = Math.round( power || 1 );

      return t => Math.pow( t, power );

    },

    Out: power => {

      power = Math.round( power || 1 );

      return t => 1 - Math.abs( Math.pow( t - 1, power ) );

    },

    InOut: power => {

      power = Math.round( power || 1 );

      return t => ( t < 0.5 )
        ? Math.pow( t * 2, power ) / 2
        : ( 1 - Math.abs( Math.pow( ( t * 2 - 1 ) - 1, power ) ) ) / 2 + 0.5;

    },

  },

  Sine: {

    In: () => t => 1 + Math.sin( Math.PI / 2 * t - Math.PI / 2 ),

    Out: () => t => Math.sin( Math.PI / 2 * t ),

    InOut: () => t => ( 1 + Math.sin( Math.PI * t - Math.PI / 2 ) ) / 2,

  },

  Back: {

    Out: s => {

      s = s || 1.70158;

      return t => { return ( t -= 1 ) * t * ( ( s + 1 ) * t + s ) + 1; };

    },

    In: s => {

      s = s || 1.70158;

      return t => { return t * t * ( ( s + 1 ) * t - s ); };

    }

  },

  Elastic: {

    Out: ( amplitude, period ) => {

      let PI2 = Math.PI * 2;

      let p1 = ( amplitude >= 1 ) ? amplitude : 1;
      let p2 = ( period || 0.3 ) / ( amplitude < 1 ? amplitude : 1 );
      let p3 = p2 / PI2 * ( Math.asin( 1 / p1 ) || 0 );

      p2 = PI2 / p2;

      return t => { return p1 * Math.pow( 2, -10 * t ) * Math.sin( ( t - p3 ) * p2 ) + 1 }

    },

  },

};

export { Easing };
