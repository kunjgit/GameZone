const animationEngine = ( () => {

  let uniqueID = 0;

  class AnimationEngine {

    constructor() {

      this.ids = [];
      this.animations = {};
      this.update = this.update.bind( this );
      this.raf = 0;
      this.time = 0;

    }

    update() {

      const now = performance.now();
      const delta = now - this.time
      this.time = now;

      let i = this.ids.length;

      this.raf = i ? requestAnimationFrame( this.update ) : 0;

      while ( i-- )
        this.animations[ this.ids[ i ] ] && this.animations[ this.ids[ i ] ].update( delta );

    }

    add( animation ) {

      animation.id = uniqueID ++;

      this.ids.push( animation.id );
      this.animations[ animation.id ] = animation;

      if ( this.raf !== 0 ) return;

      this.time = performance.now();
      this.raf = requestAnimationFrame( this.update );

    }

    remove( animation ) {

      const index = this.ids.indexOf( animation.id );

      if ( index < 0 ) return;

      this.ids.splice( index, 1 );
      delete this.animations[ animation.id ];
      animation = null;

    }

  }

  return new AnimationEngine();

} )();

class Animation {

  constructor( start ) {

    if ( start === true ) this.start();

  }

  start() {

    animationEngine.add( this );

  }

  stop() {

    animationEngine.remove( this );

  }

  update( delta ) {}

}

export { Animation };
