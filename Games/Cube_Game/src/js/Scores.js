class Scores {

  constructor( game ) {

    this.game = game;

    this.data = {
      2: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      },
      3: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      },
      4: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      },
      5: {
        scores: [],
        solves: 0,
        best: 0,
        worst: 0,
      }
    }

  }

  addScore( time ) {

    const data = this.data[ this.game.cube.sizeGenerated ];

    data.scores.push( time );
    data.solves++;

    if ( data.scores.lenght > 100 ) data.scores.shift();

    let bestTime = false    

    if ( time < data.best || data.best === 0 ) {

      data.best = time;
      bestTime = true;

    }

    if ( time > data.worst ) data.worst = time;

    this.game.storage.saveScores();

    return bestTime;

  }

  calcStats() {

    const s = this.game.cube.sizeGenerated;
    const data = this.data[ s ];

    this.setStat( 'cube-size', `${s}<i>x</i>${s}<i>x</i>${s}` );
    this.setStat( 'total-solves', data.solves );
    this.setStat( 'best-time', this.convertTime( data.best ) );
    this.setStat( 'worst-time', this.convertTime( data.worst ) );
    this.setStat( 'average-5', this.getAverage( 5 ) );
    this.setStat( 'average-12', this.getAverage( 12 ) );
    this.setStat( 'average-25', this.getAverage( 25 ) );

  }

  setStat( name, value ) {

    if ( value === 0 ) value = '-';

    this.game.dom.stats.querySelector( `.stats[name="${name}"] b` ).innerHTML = value;

  }

  getAverage( count ) {

    const data = this.data[ this.game.cube.sizeGenerated ];

    if ( data.scores.length < count ) return 0;

    return this.convertTime( data.scores.slice( -count ).reduce( ( a, b ) => a + b, 0 ) / count );

  }

  convertTime( time ) {

    if ( time <= 0 ) return 0;

    const seconds = parseInt( ( time / 1000 ) % 60 );
    const minutes = parseInt( ( time / ( 1000 * 60 ) ) );

    return minutes + ':' + ( seconds < 10 ? '0' : '' ) + seconds;

  }

}

export { Scores };
