import { Range } from './Range.js';

class Preferences {

  constructor( game ) {

    this.game = game;

  }

  init() {

    const getProgressInRange = ( value, start, end ) => {

      return Math.min( Math.max( (value - start) / (end - start), 0 ), 1 );
      
    }

    this.ranges = {

      size: new Range( 'size', {
        value: this.game.cube.size,
        range: [ 2, 5 ],
        step: 1,
        onUpdate: value => {

          this.game.cube.size = value;

          this.game.preferences.ranges.scramble.list.forEach( ( item, i ) => {

            item.innerHTML = this.game.scrambler.scrambleLength[ this.game.cube.size ][ i ];

          } );

        },
        onComplete: () => this.game.storage.savePreferences(),
      } ),

      flip: new Range( 'flip', {
        value: this.game.controls.flipConfig,
        range: [ 0, 2 ],
        step: 1,
        onUpdate: value => {

          this.game.controls.flipConfig = value;

        },
        onComplete: () => this.game.storage.savePreferences(),
      } ),

      scramble: new Range( 'scramble', {
        value: this.game.scrambler.dificulty,
        range: [ 0, 2 ],
        step: 1,
        onUpdate: value => {

          this.game.scrambler.dificulty = value;

        },
        onComplete: () => this.game.storage.savePreferences()
      } ),

      fov: new Range( 'fov', {
        value: this.game.world.fov,
        range: [ 2, 45 ],
        onUpdate: value => {

          this.game.world.fov = value;
          this.game.world.resize();

        },
        onComplete: () => this.game.storage.savePreferences()
      } ),

      theme: new Range( 'theme', {
        value: { cube: 0, erno: 1, dust: 2, camo: 3, rain: 4 }[ this.game.themes.theme ],
        range: [ 0, 4 ],
        step: 1,
        onUpdate: value => {

          const theme = [ 'cube', 'erno', 'dust', 'camo', 'rain' ][ value ]
          this.game.themes.setTheme( theme );

        },
        onComplete: () => this.game.storage.savePreferences()
      } ),

      hue: new Range( 'hue', {
        value: 0,
        range: [ 0, 360 ],
        onUpdate: value => this.game.themeEditor.updateHSL(),
        onComplete: () => this.game.storage.savePreferences(),
      } ),

      saturation: new Range( 'saturation', {
        value: 100,
        range: [ 0, 100 ],
        onUpdate: value => this.game.themeEditor.updateHSL(),
        onComplete: () => this.game.storage.savePreferences(),
      } ),

      lightness: new Range( 'lightness', {
        value: 50,
        range: [ 0, 100 ],
        onUpdate: value => this.game.themeEditor.updateHSL(),
        onComplete: () => this.game.storage.savePreferences(),
      } ),

    };

    this.ranges.scramble.list.forEach( ( item, i ) => {

      item.innerHTML = this.game.scrambler.scrambleLength[ this.game.cube.size ][ i ];

    } );
    
  }

}

export { Preferences };
