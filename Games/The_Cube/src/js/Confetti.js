import { Animation } from './Animation.js';

class Confetti {

  constructor( game ) {

    this.game = game;
    this.started = 0;

    this.options = {
      speed: { min: 0.0011, max: 0.0022 },
      revolution: { min: 0.01, max: 0.05 },
      size: { min: 0.1, max: 0.15 },
      colors: [ 0x41aac8, 0x82ca38, 0xffef48, 0xef3923, 0xff8c0a ],
    }

    this.geometry = new THREE.PlaneGeometry( 1, 1 );
    this.material = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } );

    this.holders = [
      new ConfettiStage( this.game, this, 1, 20 ),
      new ConfettiStage( this.game, this, -1, 30 ),
    ];

  }

  start() {

    if ( this.started > 0 ) return;

    this.holders.forEach( holder => {

      this.game.world.scene.add( holder.holder );
      holder.start();
      this.started ++;

    } );

  }

  stop() {

    if ( this.started == 0 ) return;

    this.holders.forEach( holder => {

      holder.stop( () => {

        this.game.world.scene.remove( holder.holder );
        this.started --;

      } );

    } );

  }

  updateColors( colors ) {

    this.holders.forEach( holder => {

      holder.options.colors.forEach( ( color, index ) => {

        holder.options.colors[ index ] = colors[ [ 'D', 'F', 'R', 'B', 'L' ][ index ] ];

      } );

    } );

  }

}

class ConfettiStage extends Animation {

  constructor( game, parent, distance, count ) {

    super( false );

    this.game = game;
    this.parent = parent;

    this.distanceFromCube = distance;

    this.count = count;
    this.particles = [];

    this.holder = new THREE.Object3D();
    this.holder.rotation.copy( this.game.world.camera.rotation );

    this.object = new THREE.Object3D();
    this.holder.add( this.object );

    this.resizeViewport = this.resizeViewport.bind( this );
    this.game.world.onResize.push( this.resizeViewport )
    this.resizeViewport();    

    this.geometry = this.parent.geometry;
    this.material = this.parent.material;

    this.options = this.parent.options;

    let i = this.count;
    while ( i-- ) this.particles.push( new Particle( this ) );

  }

  start() {

    this.time = performance.now();
    this.playing = true;

    let i = this.count;
    while ( i-- ) this.particles[ i ].reset();

    super.start();

  }

  stop( callback ) {

    this.playing = false;
    this.completed = 0;
    this.callback = callback;

  }

  reset() {

    super.stop();

    this.callback();

  }

  update() {

    const now = performance.now();
    const delta = now - this.time;
    this.time = now;

    let i = this.count;

    while ( i-- )
      if ( ! this.particles[ i ].completed ) this.particles[ i ].update( delta );

    if ( ! this.playing && this.completed == this.count ) this.reset();

  }

  resizeViewport() {

    const fovRad = this.game.world.camera.fov * THREE.Math.DEG2RAD;

    this.height = 2 * Math.tan( fovRad / 2 ) * ( this.game.world.camera.position.length() - this.distanceFromCube );
    this.width = this.height * this.game.world.camera.aspect;

    const scale = 1 / this.game.transition.data.cameraZoom;

    this.width *= scale;
    this.height *= scale;

    this.object.position.z = this.distanceFromCube;
    this.object.position.y = this.height / 2;

  }
  
}

class Particle {

  constructor( confetti ) {

    this.confetti = confetti;
    this.options = this.confetti.options;

    this.velocity = new THREE.Vector3();
    this.force = new THREE.Vector3();

    this.mesh = new THREE.Mesh( this.confetti.geometry, this.confetti.material.clone() );
    this.confetti.object.add( this.mesh );

    this.size = THREE.Math.randFloat( this.options.size.min, this.options.size.max );
    this.mesh.scale.set( this.size, this.size, this.size );

    return this;

  }

  reset( randomHeight = true ) {

    this.completed = false;

    this.color = new THREE.Color( this.options.colors[ Math.floor( Math.random() * this.options.colors.length ) ] );
    this.mesh.material.color.set( this.color );

    this.speed = THREE.Math.randFloat( this.options.speed.min, this.options.speed.max ) * - 1;
    this.mesh.position.x = THREE.Math.randFloat( - this.confetti.width / 2, this.confetti.width / 2 );
    this.mesh.position.y = ( randomHeight )
      ? THREE.Math.randFloat( this.size, this.confetti.height + this.size )
      : this.size;

    this.revolutionSpeed = THREE.Math.randFloat( this.options.revolution.min, this.options.revolution.max );
    this.revolutionAxis = [ 'x', 'y', 'z' ][ Math.floor( Math.random() * 3 ) ];
    this.mesh.rotation.set( Math.random() * Math.PI / 3, Math.random() * Math.PI / 3, Math.random() * Math.PI / 3 );

  }

  stop() {

    this.completed = true;
    this.confetti.completed ++;

  }

  update( delta ) {

    this.mesh.position.y += this.speed * delta;
    this.mesh.rotation[ this.revolutionAxis ] += this.revolutionSpeed;

    if ( this.mesh.position.y < - this.confetti.height - this.size )
      ( this.confetti.playing ) ? this.reset( false ) : this.stop();

  }

}

export { Confetti };
